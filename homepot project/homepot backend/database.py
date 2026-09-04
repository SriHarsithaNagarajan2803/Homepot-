import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from a .env file if present
load_dotenv()

# Use credentials provided directly, falling back to environment variables if needed
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://atntotxztoytouvovgct.supabase.co")
SUPABASE_KEY = os.getenv(
    "SUPABASE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bnRvdHh6dG95dG91dm92Z2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzIyNzksImV4cCI6MjEwMzg0ODI3OX0.Wy7v0Bctjix1UGI-KRG1ElCWuzCEXkseTQsoUQHWTuA"
)

# Initialize and export the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)