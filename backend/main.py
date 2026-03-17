import time
from datetime import datetime
from scraper import scrape_eprocure, scrape_gem
from ai_processor import summarize_tender_document
from db import insert_tender, check_tender_exists

def process_tenders(tenders):
    new_tenders_count = 0
    for t in tenders:
        tender_id = t.get("tender_id")
        
        # 1. Check if already in DB
        if check_tender_exists(tender_id):
            print(f"Tender {tender_id} already exists. Skipping.")
            continue
            
        print(f"Processing new tender: {tender_id}")
        
        # 2. Generate AI Summary using Gemini API
        ai_summary, risk_score = summarize_tender_document(
            title=t.get("title", ""),
            description=t.get("description", ""),
            text_content=t.get("text_content", "")
        )
        
        # 3. Construct DB record
        tender_record = {
            "tender_id": tender_id,
            "title": t.get("title", ""),
            "description": t.get("description", ""),
            "deadline": t.get("deadline", ""),
            "url": t.get("url", ""),
            "ai_summary": ai_summary,
            "risk_score": risk_score
        }
        
        # 4. Save to Supabase
        inserted = insert_tender(tender_record)
        if inserted:
            print(f"Successfully inserted tender: {tender_id}")
            new_tenders_count += 1
        
        # Add a small delay to avoid rate limits on free-tier keys
        print("Sleeping for 2s to respect rate limits...")
        time.sleep(2)
            
    return new_tenders_count

def run_scraper_job():
    print(f"--- Starting Tender Scraping Job at {datetime.now()} ---")
    
    try:
        print("Scraping eProcure...")
        eprocure_results = scrape_eprocure()
        print(f"Found {len(eprocure_results)} tenders from eProcure.")
        process_tenders(eprocure_results)
    except Exception as e:
        print(f"Error in eProcure job: {e}")
        
    try:
        print("\nScraping GeM...")
        gem_results = scrape_gem()
        print(f"Found {len(gem_results)} tenders from GeM.")
        process_tenders(gem_results)
    except Exception as e:
        print(f"Error in GeM job: {e}")
        
    print(f"--- Job Finished at {datetime.now()} ---")

if __name__ == "__main__":
    run_scraper_job()
