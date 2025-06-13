from pydantic import BaseModel, EmailStr

class UserAuth(BaseModel):
    username: str
    password: str

class UserSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
