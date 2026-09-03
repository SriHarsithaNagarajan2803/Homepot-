import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta

app = FastAPI()

# Temporary in-memory database simulation (replace with MongoDB, PostgreSQL, etc.)
otp_database = {}  # Format: { "user@email.com": { "otp": "1234", "expires_at": datetime } }
verified_emails = set()

class EmailSchema(BaseModel):
    email: str

class OtpVerifySchema(BaseModel):
    email: str
    otp: str

@app.post("/api/send-otp")
def send_otp(data: EmailSchema):
    # 1. Generate a 4-digit OTP
    code = str(random.randint(1000, 9999))
    
    # 2. Store OTP in database with a 5-minute expiration window
    expires = datetime.now() + timedelta(minutes=5)
    otp_database[data.email] = {
        "otp": code,
        "expires_at": expires
    }
    
    # 3. Trigger email service here (e.g., SendGrid, SMTP, AWS SES)
    print(f"DEBUG: OTP for {data.email} is {code}")
    
    return {"message": "OTP sent successfully to your email"}

@app.post("/api/verify-otp")
def verify_otp(data: OtpVerifySchema):
    record = otp_database.get(data.email)
    
    if not record:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")
    
    if datetime.now() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    if record["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")
    
    # Mark email as verified for the final registration step
    verified_emails.add(data.email)
    
    return {"message": "Email verified successfully"}