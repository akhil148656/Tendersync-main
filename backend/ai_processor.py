import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY not found in environment.")
    client = None

def summarize_tender_document(title, description, text_content):
    """
    Analyzes a tender document to extract detailed technical and financial constraints,
    eligibility criteria, and scope of work using Gemini.
    """
    if not client:
        return "AI Summary unavailable (API key missing).", 0

    system_prompt = """
    You are an expert procurement analyst specializing in Indian Government Tenders (GeM and eProcure).
    Your task is to analyze the provided TENDER DOCUMENT TEXT and extract a professional, detailed summary and a Risk Score.
    
    CRITICAL INSTRUCTIONS:
    1. If the text contains detailed "Scope of Work" or "Technical Specifications", summarize them precisely.
    2. Identify specific "Eligibility Criteria" (Experience, Turnover, Certifications).
    3. Look for "Key Dates" and "Financial Constraints" (EMD, Performance Security).
    4. EVALUATE RISK: Assign a Risk Score from 0 to 100 based on complexity, tight deadlines, heavy penalties, or vague requirements. (0 = Low Risk, 100 = High Risk).
    5. FORMAT: Start your response with [RISK_SCORE: XX] where XX is the number, followed by the markdown summary.
    6. Use professional business language.
    """

    user_message = f"Tender Title: {title}\nTender Description: {description}\n\nDocument Text Content:\n{text_content[:30000]}"

    try:
        response = client.models.generate_content(
            model='models/gemini-flash-latest',
            config={
                "system_instruction": system_prompt,
            },
            contents=user_message,
        )
        output = response.text
        
        # Parse Risk Score
        risk_score = 0
        import re
        match = re.search(r"\[RISK_SCORE:\s*(\d+)\]", output)
        if match:
            risk_score = int(match.group(1))
            output = output.replace(match.group(0), "").strip()

        print(f"AI Analysis (Risk: {risk_score}) generated for {title[:30]}...")
        return output, risk_score
    except Exception as e:
        import traceback
        traceback.print_exc()
        return "Error generating AI summary.", 0

def chat_with_ai(messages):
    """
    Handles a multi-turn chat conversation using Gemini.
    `messages` is a list of dicts: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
    """
    if not client:
        return "AI Assistant is currently offline (API key missing)."

    try:
        # Convert internal message format to Gemini format
        # Gemini expects 'user' and 'model' roles.
        history = []
        for i, msg in enumerate(messages[:-1]):
            # Gemini history MUST start with a 'user' message. 
            # If the first message in our list is from the assistant (greeting), skip it for Gemini history.
            if i == 0 and msg["role"] == "assistant":
                continue
            role = "user" if msg["role"] == "user" else "model"
            history.append({"role": role, "parts": [{"text": msg["content"]}]})
        
        chat = client.chats.create(
            model='models/gemini-flash-latest',
            config={
                "system_instruction": "You are TenderSync, an intelligent AI Assistant for tender management. Help the user analyze RFPs, evaluate risks, and optimize bidding strategies based on their available data.",
            },
            history=history
        )
        
        last_message = messages[-1]["content"]
        response = chat.send_message(last_message)
        return response.text
    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"Error: {str(e)}"
def analyze_tender_pnl_and_risk(tender_data, user_inventory_data):
    """
    Detailed P&L and Risk Analysis comparing Tender requirements vs User Quality/Quantity data using Gemini.
    """
    if not client:
        return {"error": "AI Assistant is currently offline (API key missing)."}

    system_prompt = """
    You are an expert Financial Analyst and Risk Auditor for government tenders.
    Your task is to analyze a TENDER (requirements/constraints) and compare it against the USER'S INVENTORY and quality/quantity data.
    
    CRITICAL: YOU MUST OUTPUT ONLY VALID JSON.
    
    Input:
    1. Tender Text (Requirements)
    2. User Inventory/Capability Data (What they have)
    
    Output JSON Schema:
    {
      "profit_analysis": {
         "estimated_revenue": "Price estimate for contract",
         "estimated_costs": "Cost breakdown based on inventory",
         "net_profit_margin": "Percentage",
         "summary": "Financial feasibility summary"
      },
      "risk_assessment": {
         "detailed_score": 0-100,
         "risk_factors": ["item1", "item2"],
         "feasibility": "High/Medium/Low",
         "gap_analysis": "What is missing or insufficient"
      },
      "comparison": [
         {"requirement": "spec needed", "user_data": "what user has", "status": "Match/Gap/Mismatch", "impact": "Cost/Risk impact"}
      ]
    }
    """

    user_message = f"""
    ANALYSIS REQUEST:
    
    TENDER INFO:
    Title: {tender_data.get('title')}
    Description: {tender_data.get('description')}
    AI Summary: {tender_data.get('ai_summary')}
    
    USER INVENTORY / RAW MATERIALS DATA:
    {user_inventory_data}
    
    Provide the detailed JSON analysis.
    """

    try:
        response = client.models.generate_content(
            model='models/gemini-flash-latest',
            config={
                "system_instruction": system_prompt,
                "response_mime_type": "application/json",
            },
            contents=user_message,
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
