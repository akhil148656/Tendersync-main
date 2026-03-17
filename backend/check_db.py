from db import supabase
import json

def check_db():
    print("Checking tenders table...")
    try:
        res = supabase.table('tenders').select('*').limit(1).execute()
        if res.data:
            print(f"Tender columns: {list(res.data[0].keys())}")
            if 'risk_score' in res.data[0]:
                print("SUCCESS: 'risk_score' column exists.")
            else:
                print("FAILURE: 'risk_score' column is MISSING.")
        else:
            print("Tenders table empty.")
    except Exception as e:
        print(f"Tenders error: {e}")

    print("\nChecking bids table...")
    try:
        res = supabase.table('bids').select('*').limit(1).execute()
        print("Bids table exists.")
    except Exception as e:
        print(f"Bids table error: {e}")

if __name__ == "__main__":
    check_db()
