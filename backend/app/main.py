from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

origins = [
    "http://localhost:5173",
    #add url here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Hello" : "World this app is working"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)