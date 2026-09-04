import cv2
import numpy as np
import random
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI App
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load OpenCV Face Detector safely
cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(cascade_path)

# In-memory storage for OTP verification
otp_storage = {}

# --- Pydantic Data Models ---
class EmailRequest(BaseModel):
    email: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class KitchenRegistration(BaseModel):
    kitchenName: str
    ownerName: str
    email: str
    password: str
    fssaiNumber: str
    address: str
    specialties: List[str]


# --- Endpoints ---

@app.post("/api/detect-face")
async def detect_face(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))

    if len(faces) > 0:
        return {"success": True, "message": "Face detected successfully!"}
    else:
        return {"success": False, "message": "No human face detected. Please try a well-lit portrait."}


@app.post("/api/send-otp")
async def send_otp(data: EmailRequest):
    generated_otp = str(random.randint(1000, 9999))
    otp_storage[data.email] = generated_otp
    
    print(f"\n========================================")
    print(f" [OTP SERVICE] Email: {data.email}")
    print(f" [OTP SERVICE] Code:  {generated_otp}")
    print(f"========================================\n")
    
    return {"success": True, "message": "OTP generated and printed to backend terminal."}


@app.post("/api/verify-otp")
async def verify_otp(data: VerifyOtpRequest):
    stored_otp = otp_storage.get(data.email)
    
    if not stored_otp:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")
    
    if stored_otp == data.otp:
        del otp_storage[data.email]
        return {"success": True, "message": "Email verified successfully!"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")


@app.post("/api/register-kitchen")
async def register_kitchen(data: KitchenRegistration):
    print(f"\n[REGISTER KITCHEN RECEIVED]")
    print(f"Kitchen: {data.kitchenName}")
    print(f"Owner: {data.ownerName}")
    print(f"Email: {data.email}")
    print(f"FSSAI: {data.fssaiNumber}")
    print(f"Specialties: {data.specialties}\n")
    
    return {
        "success": True, 
        "message": f"Kitchen '{data.kitchenName}' registered successfully!"
    }