from fastapi import FastAPI, HTTPException, File, UploadFile
import pdfplumber
import io
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
from ai_processor import chat_with_ai, analyze_tender_pnl_and_risk

app = FastAPI()

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

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
