import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL: str = "https://beqxeulqxcfsogppblqz.supabase.co"
SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcXhldWxxeGNmc29ncHBibHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4ODY3NTAsImV4cCI6MjEwMzQ2Mjc1MH0.V6PuIJCl__XqEgYXUyshg9dLLZVDJHLfOYdJhwE0toU"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)