from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from config.db import db
from schema.boxoffice import UserSchema
from auth import create_access_token
from datetime import timedelta

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/register")
def register(user: UserSchema):
    if db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User already exists")
    db.users.insert_one(user.dict())
    return {"message": "User registered successfully"}


@router.post("/token") 
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.users.find_one({"username": form_data.username})
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(
    data={"sub": user["username"]},
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }