from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

# Setup password hashing context (using bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Enable CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all frontend origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
async def login_user(data: LoginRequest):
    # 1. Query your database for the user with data.email
    # Example for MongoDB:
    # user = db.users.find_one({"email": data.email})
    
    # --- TEMPORARY MOCK USER FOR TESTING ---
    # Replace this block once your database is connected
    mock_user_email = "chef@homepot.com"
    # This is a hashed version of "password123"
    mock_hashed_password = pwd_context.hash("password123") 
    
    user = None
    if data.email == mock_user_email:
        user = {
            "email": mock_user_email,
            "hashed_password": mock_hashed_password
        }
    # --------------------------------------
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 2. Verify password against the stored database hash
    is_valid = pwd_context.verify(data.password, user["hashed_password"])
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    return {"message": "Login successful", "email": user.get("email")}