from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import supabase

app = FastAPI(title="HomePot Chef API", version="1.0")

# Enable CORS for React Frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models for Request Validation
class ChefRegister(BaseModel):
    kitchen_name: str
    owner_full_name: str
    fssai_number: str
    kitchen_address: str
    cuisines: list[str]

class DishCreate(BaseModel):
    chef_id: str
    dish_name: str
    price_per_plate: float
    category: str
    available_portions: int


@app.get("/")
def read_root():
    return {"message": "Welcome to HomePot Chef API!"}


# FSSAI Verification Endpoint
@app.post("/api/verify-fssai")
def verify_fssai(data: ChefRegister):
    # Check if FSSAI number is exactly 14 digits
    if len(data.fssai_number) != 14 or not data.fssai_number.isdigit():
        raise HTTPException(status_code=400, detail="Invalid FSSAI number. Must be a 14-digit code.")
    
    try:
        # Insert chef into Supabase and mark as verified
        response = supabase.table("chefs").insert({
            "kitchen_name": data.kitchen_name,
            "owner_full_name": data.owner_full_name,
            "fssai_number": data.fssai_number,
            "kitchen_address": data.kitchen_address,
            "cuisines": data.cuisines,
            "verification_status": True
        }).execute()
        
        return {"status": "success", "message": "FSSAI Verified & Kitchen Registered Successfully!", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Add or Update Daily Dish Endpoint
@app.post("/api/dishes")
def add_dish(dish: DishCreate):
    try:
        response = supabase.table("dishes").insert({
            "chef_id": dish.chef_id,
            "dish_name": dish.dish_name,
            "price_per_plate": dish.price_per_plate,
            "category": dish.category,
            "available_portions": dish.available_portions,
            "is_available": True
        }).execute()
        
        return {"status": "success", "message": "Dish added to menu!", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get Menu for a Specific Chef
@app.get("/api/dishes/{chef_id}")
def get_chef_menu(chef_id: str):
    try:
        response = supabase.table("dishes").select("*").eq("chef_id", chef_id).execute()
        return {"status": "success", "menu": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))