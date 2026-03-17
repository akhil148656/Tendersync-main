import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase credentials not found in environment.")
    supabase = None
else:
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
        supabase = None


def insert_tender(tender_data: dict):
    """
    Inserts a tender dictionary into the Supabase 'tenders' table.
    """
    if not supabase:
        print("Supabase client not initialized. Cannot insert tender.")
        return None
    try:
        response = supabase.table("tenders").insert(tender_data).execute()
        return response.data
    except Exception as e:
        print(f"Error inserting tender: {e}")
        return None


def check_tender_exists(tender_id: str):
    """
    Checks if a tender with the given tender_id already exists.
    """
    if not supabase:
        return False
    try:
        response = supabase.table("tenders").select("id").eq("tender_id", tender_id).execute()
        return len(response.data) > 0
    except Exception as e:
        print(f"Error checking if tender exists: {e}")
        return False
