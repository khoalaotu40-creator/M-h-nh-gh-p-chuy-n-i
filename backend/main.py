from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Backend API")

class HelloResponse(BaseModel):
    message: str

@app.get("/api/hello", response_model=HelloResponse)
async def get_hello():
    return {"message": "Hello from Python Backend!"}
