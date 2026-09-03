import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("https://atntotxztoytouvovgct.supabase.co")
SUPABASE_KEY = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bnRvdHh6dG95dG91dm92Z2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzIyNzksImV4cCI6MjEwMzg0ODI3OX0.Wy7v0Bctjix1UGI-KRG1ElCWuzCEXkseTQsoUQHWTuA")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
