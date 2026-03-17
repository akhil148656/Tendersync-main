import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import fitz  # PyMuPDF
import os
import shutil

def get_driver():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless") # Commented out to avoid bot detection
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Add some common anti-detection flags
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument("--disable-blink-features=AutomationControlled")
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    return driver

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a locally saved PDF file.
    """
    try:
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def download_pdf(url, dest_path):
    """
    Downloads a PDF from a URL.
    """
    try:
        response = requests.get(url, stream=True, timeout=30)
        if response.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
        return False
    except Exception as e:
        print(f"Error downloading PDF: {e}")
        return False

def scrape_eprocure():
    print("Starting scraping eprocure.gov.in...")
    driver = get_driver()
    tenders = []
    try:
        # FrontEndTendersByOrganisation is a common page, we can also use activeTenders
        driver.get("https://eprocure.gov.in/eprocure/app?page=FrontEndActiveTenders&service=page")
        
        # Wait for the table to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//table[@id='table']"))
        )
        
        # Grab rows
        rows = driver.find_elements(By.XPATH, "//table[@id='table']//tr")
        # First row is usually header
        for row in rows[1:6]: # Limit to 5 for initial testing
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 5:
                # eprocure columns typically: S.No, e-Published Date, Closing Date, Opening Date, Title/Ref.No, Org Chain etc
                # We'll adapt based on typical active tenders structure
                title = cols[4].text.strip()
                date_str = cols[2].text.strip() # Closing date is typically 3rd col
                organization = cols[5].text.strip() if len(cols) > 5 else "Unknown Org"
                
                # Try to extract the tender ID from the title cell if possible
                tender_id = f"EPROC_{title[:10].replace(' ', '_')}" 
                
                # Link is often in the title cell
                link_element = cols[4].find_elements(By.TAG_NAME, "a")
                url = link_element[0].get_attribute("href") if link_element else driver.current_url
                
                tenders.append({
                    "tender_id": tender_id,
                    "title": title,
                    "description": f"Organization: {organization}",
                    "deadline": date_str,
                    "url": url,
                    "text_content": f"Title: {title}. Organization: {organization}. Deadline: {date_str}"
                })
    except Exception as e:
        print(f"Error scraping eprocure: {e}")
    finally:
        driver.quit()
        
    return tenders

def scrape_gem():
    print("Starting scraping gem.gov.in...")
    driver = get_driver()
    tenders = []
    try:
        driver.get("https://bidplus.gem.gov.in/bidlists")
        # Wait for tender blocks
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "card"))
        )
        
        cards = driver.find_elements(By.CLASS_NAME, "card")
        for card in cards[:5]: # grab first 5 for testing
            try:
                title_elem = card.find_elements(By.CLASS_NAME, "block_header")
                tender_id_elem = card.find_elements(By.XPATH, ".//p[contains(text(), 'Bid No')]/span")
                date_elem = card.find_elements(By.XPATH, ".//p[contains(text(), 'End Date')]/span")
                
                tender_id = tender_id_elem[0].text.strip() if tender_id_elem else f"GEM_{time.time()}"
                title = title_elem[0].text.strip() if title_elem else "GeM Tender"
                deadline = date_elem[0].text.strip() if date_elem else "Unknown"
                
                # Discovery: Bid No is the link to the PDF
                pdf_url = ""
                bid_no_link = card.find_elements(By.CSS_SELECTOR, "a.bid_no_hover")
                if bid_no_link:
                    pdf_url = bid_no_link[0].get_attribute("href")
                
                text_content = f"GeM Bid Title: {title}. Tender ID: {tender_id}. Deadline: {deadline}."
                
                # If we have a PDF URL, download and extract
                if pdf_url:
                    print(f"Attempting to process PDF for {tender_id}: {pdf_url}")
                    temp_dir = "temp_pdfs"
                    os.makedirs(temp_dir, exist_ok=True)
                    pdf_filename = f"{tender_id.replace('/', '_')}.pdf"
                    pdf_path = os.path.join(temp_dir, pdf_filename)
                    
                    if download_pdf(pdf_url, pdf_path):
                        extracted_text = extract_text_from_pdf(pdf_path)
                        if extracted_text:
                            print(f"Successfully extracted {len(extracted_text)} chars from PDF.")
                            # Prefix with short info but provide the core PDF text
                            text_content = f"--- METADATA ---\nTitle: {title}\nID: {tender_id}\nDeadline: {deadline}\n--- PDF CONTENT ---\n{extracted_text}"
                        
                        # Cleanup
                        try:
                            os.remove(pdf_path)
                        except:
                            pass
                
                tenders.append({
                    "tender_id": tender_id,
                    "title": title,
                    "description": "GeM Bid",
                    "deadline": deadline,
                    "url": pdf_url or driver.current_url,
                    "text_content": text_content
                })
            except Exception as e:
                print(f"Error parsing particular GeM card: {e}")
    except Exception as e:
        print(f"Error scraping GeM: {e}")
    finally:
        driver.quit()
        
    return tenders
