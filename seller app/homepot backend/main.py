import random
import requests
import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# ---------------------------------------------------------
# 1. SUPABASE CONFIGURATION
# ---------------------------------------------------------
SUPABASE_URL = "https://atntotxztoytouvovgct.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bnRvdHh6dG95dG91dm92Z2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzIyNzksImV4cCI6MjEwMzg0ODI3OX0.Wy7v0Bctjix1UGI-KRG1ElCWuzCEXkseTQsoUQHWTuA"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------------------------------------------------
# 2. FASTAPI APP INITIALIZATION
# ---------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 3. EMAIL OTP ENDPOINTS (via Google Apps Script)
# ---------------------------------------------------------
otp_storage = {}
APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3ebjUS21_hc02QWDpUv2FXsff4MiYOz8PChnhbLBET8oCpsNpXq-KXag4FU-TKnCWmg/exec"

class EmailRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/send-otp")
async def send_otp(data: EmailRequest):
    email = data.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    
    otp = str(random.randint(1000, 9999))
    otp_storage[email] = otp

    payload = {"email": email, "otp": otp}
    try:
        response = requests.post(APPS_SCRIPT_URL, json=payload, timeout=10)
        return {"success": True, "message": "OTP sent successfully to your email!"}
    except Exception as e:
        print(f"Apps Script Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email via Google Apps Script.")

@app.post("/api/verify-otp")
async def verify_otp(data: VerifyRequest):
    email_key = data.email.strip().lower()
    stored_otp = otp_storage.get(email_key)

    if not stored_otp:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")

    if stored_otp == data.otp.strip():
        del otp_storage[email_key]
        return {"success": True, "message": "Email verified successfully!"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please try again.")


# ---------------------------------------------------------
# 4. USER REGISTRATION & LOGIN ENDPOINTS (Supabase)
# ---------------------------------------------------------
@app.post("/api/register")
async def register_user(data: RegisterRequest):
    email_key = data.email.strip().lower()
    
    try:
        # Check if user already exists
        existing = supabase.table("users").select("email").eq("email", email_key).execute()
        if existing.data and len(existing.data) > 0:
            raise HTTPException(status_code=400, detail="Email is already registered.")

        # Insert user into Supabase table
        response = supabase.table("users").insert({
            "name": data.name,
            "email": email_key,
            "phone": data.phone,
            "password": data.password
        }).execute()

        print("Supabase Insert Data Returned:", response.data)
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Supabase accepted the request but returned no data. Check RLS policies.")

        return {"success": True, "message": "Chef registered successfully in Supabase!"}

    except Exception as e:
        print(f"Registration Error Details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
# ---------------------------------------------------------
# 5. OPENCV FACE DETECTION ENDPOINT
# ---------------------------------------------------------
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.post("/api/detect-face")
async def detect_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"success": False, "message": "Could not decode image file."}

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )

        if len(faces) > 0:
            return {"success": True, "message": f"Face verified! ({len(faces)} face detected)"}
        else:
            return {"success": False, "message": "No human face detected. Please upload a clear photo."}

    except Exception as e:
        print(f"Face Detection Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during face detection.")