from fastapi import FastAPI, HTTPException, File, UploadFile, Response, Form
import pdfplumber
import io
import os
import shutil
import uuid
from datetime import datetime
from typing import List, Optional
from pdf_generator import generate_pdf_report
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
from ai_processor import chat_with_ai, analyze_tender_pnl_and_risk
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Supabase Client Initialization
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Ensure uploads directory exists
UPLOAD_DIR = "uploads/bids"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Enable CORS for frontend at port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Convert Pydantic models to dicts for ai_processor
        messages_dict = [m.model_dump() for m in request.messages]
        response_text = chat_with_ai(messages_dict)
        return {"role": "assistant", "content": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class FinancialAnalysisRequest(BaseModel):
    tender_data: dict
    user_inventory_data: str

@app.post("/api/analyze-financials")
async def financial_analysis_endpoint(request: FinancialAnalysisRequest):
    try:
        response = analyze_tender_pnl_and_risk(request.tender_data, request.user_inventory_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract-text")
async def extract_text_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if file.filename.endswith('.pdf'):
            text = ""
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return {"text": text}
        else:
            # Assume text/plain or similar
            return {"text": content.decode('utf-8', errors='ignore')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ExportReportRequest(BaseModel):
    tender_data: dict
    analysis_result: dict

@app.post("/api/export-report")
async def export_report_endpoint(request: ExportReportRequest):
    try:
        pdf_content = generate_pdf_report(request.tender_data, request.analysis_result)
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Tender_Analysis_{request.tender_data.get('tender_id', 'report')}.pdf"}
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
        
class ProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    username: Optional[str] = None
    contractor_type: Optional[str] = None
    pan: Optional[str] = None
    gstin: Optional[str] = None
    license: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

@app.get("/profile")
async def get_profile_endpoint():
    try:
        # Fetch the first profile (Demo Mode)
        res = supabase.table("profiles").select("*").limit(1).execute()
        
        if not res.data:
            # Create default profile if none exists
            default_profile = {
                "company_name": "KIHTRAK SOLNS",
                "username": "KS",
                "avatar_initials": "KS",
                "contractor_type": "Infrastructure",
                "pan": "ABCDE1234F",
                "gstin": "22AAAA0000A1Z5",
                "license": "LIC-2024-78421",
                "email": "contact@kihtrak.sol",
                "phone": "+91 91234 56789",
                "address": "Delhi, India",
                "profile_last_updated": datetime.now().isoformat()
            }
            insert_res = supabase.table("profiles").insert(default_profile).execute()
            if insert_res.data:
                return insert_res.data[0]
            raise Exception("Failed to create default profile")
            
        return res.data[0]
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/profile/update")
async def update_profile_endpoint(profile: ProfileUpdate):
    try:
        # 1. Fetch current profile ID
        current_res = supabase.table("profiles").select("id").limit(1).execute()
        if not current_res.data:
            # If no profile, we can't update. But /api/profile handles creation.
            raise HTTPException(status_code=404, detail="Profile not found. Please visit /api/profile first.")
            
        profile_id = current_res.data[0]["id"]
        update_data = profile.model_dump(exclude_unset=True)
        
        # 2. Automatically generate initials if company_name changes
        if "company_name" in update_data:
            words = update_data["company_name"].split()
            initials = "".join([w[0] for w in words]).upper()[:2]
            update_data["avatar_initials"] = initials
            
        update_data["profile_last_updated"] = datetime.now().isoformat()
        
        # 3. Apply update
        res = supabase.table("profiles").update(update_data).eq("id", profile_id).execute()
        
        if not res.data:
            raise Exception("Failed to update profile record")
            
        updated_profile = res.data[0]
        return {
            "message": "Profile updated successfully",
            "profile": {
                "company_name": updated_profile.get("company_name"),
                "username": updated_profile.get("username"),
                "avatar_initials": updated_profile.get("avatar_initials"),
                "updated_at": updated_profile.get("profile_last_updated")
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- New Bid Submission System ---

async def save_upload_file(upload_file: UploadFile, subfolder: str) -> str:
    if not upload_file:
        return ""
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(upload_file.filename)[1]
    filename = f"{file_id}{ext}"
    
    folder_path = os.path.join(UPLOAD_DIR, subfolder)
    os.makedirs(folder_path, exist_ok=True)
    
    file_path = os.path.join(folder_path, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    # Return a relative URL or full path for now
    # In production, this would be an S3/Supabase Storage URL
    return f"/uploads/bids/{subfolder}/{filename}"

@app.post("/api/submit-bid")
async def submit_bid_endpoint(
    tender_id: str = Form(...),
    bid_amount: float = Form(...),
    delivery_timeline: str = Form(...),
    notes: Optional[str] = Form(None),
    technical_proposal: UploadFile = File(...),
    financial_proposal: UploadFile = File(...),
    company_profile: UploadFile = File(...),
    compliance_documents: List[UploadFile] = File(...),
    past_experience_docs: Optional[List[UploadFile]] = File(None)
):
    try:
        # 1. Create Bid Entry in Supabase
        # We need a tender_name for the existing dashboard UI
        # Fetching tender name if possible, or using ID as name
        tender_name = tender_id 
        
        bid_data = {
            "tender_id": tender_id,
            "tender_name": tender_name,
            "amount": int(bid_amount),
            "delivery_timeline": delivery_timeline,
            "notes": notes,
            "status": "Pending",
            "date_submitted": datetime.now().isoformat(),
            # Additional fields for compatibility with existing UI
            "ai_recommendation": f"Submission with {len(compliance_documents)} compliance docs.",
            "win_probability": 0, # To be updated by AI later
            "risk_score": 0
        }
        
        res = supabase.table("bids").insert(bid_data).execute()
        if not res.data:
            raise Exception("Failed to create bid entry")
        
        inserted_bid = res.data[0]
        bid_id = inserted_bid["id"]
        
        # 2. Save and Link Documents
        doc_tasks = []
        
        # Single files
        doc_tasks.append(("technical_proposal", technical_proposal))
        doc_tasks.append(("financial_proposal", financial_proposal))
        doc_tasks.append(("company_profile", company_profile))
        
        # Multi files
        for doc in compliance_documents:
            doc_tasks.append(("compliance_document", doc))
            
        if past_experience_docs:
            for doc in past_experience_docs:
                doc_tasks.append(("past_experience", doc))
                
        document_entries = []
        for doc_type, file in doc_tasks:
            file_url = await save_upload_file(file, str(bid_id))
            document_entries.append({
                "bid_id": bid_id,
                "document_type": doc_type,
                "file_url": file_url,
                "uploaded_at": datetime.now().isoformat()
            })
            
        # 3. Batch insert document metadata
        if document_entries:
            supabase.table("bid_documents").insert(document_entries).execute()
            
        return {
            "bid_id": f"BID-{str(bid_id)[:8].upper()}",
            "db_id": bid_id,
            "status": "Pending",
            "message": "Bid submitted successfully",
            "documents_uploaded": True
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bid/{bid_id}")
async def get_bid_endpoint(bid_id: str):
    try:
        # Fetch bid details
        bid_res = supabase.table("bids").select("*").eq("id", bid_id).execute()
        if not bid_res.data:
            raise HTTPException(status_code=404, detail="Bid not found")
            
        # Fetch documents
        doc_res = supabase.table("bid_documents").select("*").eq("bid_id", bid_id).execute()
        
        return {
            "bid_details": bid_res.data[0],
            "documents": doc_res.data if doc_res.data else [],
            "status": bid_res.data[0].get("status", "Pending")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
