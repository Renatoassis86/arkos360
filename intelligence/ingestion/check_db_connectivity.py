import os
from supabase import create_client

def check():
    url = "https://fhvexkhqwudxxkbahxbt.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodmV4a2hxd3VkeHhrYmFoeGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY3MzI5NCwiZXhwIjoyMDkxMjQ5Mjk0fQ.god6rwZ-wirdP5lfqy4Fa6uPDItz8Vd_Dt-NAWrXl0g"
    
    supabase = create_client(url, key)
    
    print(f"Connecting to {url}...")
    try:
        # We need to know if the table exists. 
        # Since I'm using the service_role key, I can bypass RLS.
        response = supabase.table("students").select("id").limit(1).execute()
        print("✅ Success: Table 'students' exists.")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nPossible cause: Table 'students' does not exist in the 'public' schema or the project is unreachable.")

if __name__ == "__main__":
    check()
