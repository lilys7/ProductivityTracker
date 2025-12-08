from datetime import datetime
from fastapi import FastAPI, HTTPException
import uvicorn
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from dotenv import load_dotenv


from database import connect_db, close_db, get_db
load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:5173",
    # add url here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@app.on_event("startup")
async def on_startup():
    await connect_db()


@app.on_event("shutdown")
async def on_shutdown():
    await close_db()


@app.get("/")
def root():
    return {"Hello": "backend running"}


@app.post("/auth/login")
async def login(payload: LoginRequest):
    db = get_db()

    existing = await db.users.find_one({"email": payload.email})
    if existing:
        return {
            "id": str(existing["_id"]),
            "email": existing["email"],
            "created_at": existing.get("created_at"),
        }

    doc = {
        "email": payload.email,
        "password": payload.password,  # TODO: hash in real app
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await db.users.insert_one(doc)

    return {
        "id": str(result.inserted_id),
        "email": doc["email"],
        "created_at": doc["created_at"],
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
