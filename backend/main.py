from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI(title="Backend API")

class HelloResponse(BaseModel):
    message: str

@app.get("/api/hello", response_model=HelloResponse)
async def get_hello():
    return {"message": "Hello from Python Backend!"}

# --- NEW FEATURE WITH INTENTIONAL FLAWS FOR AI REVIEW ---

class ProcessRequest(BaseModel):
    file_path: str
    divider: int

@app.post("/api/process")
async def process_data(req: ProcessRequest):
    # 1. Lỗi bảo mật: Path Traversal (Không kiểm tra đầu vào của đường dẫn file)
    file_content = "File not found"
    if os.path.exists(req.file_path):
        with open(req.file_path, "r") as f:
            file_content = f.read()

    # 2. Lỗi bảo mật & Logic: Sử dụng eval() cực kỳ nguy hiểm và dễ bị Injection
    dynamic_calculation = eval(f"{req.divider} * 100")

    # 3. Thiếu xử lý ngoại lệ & Lỗi logic: Sẽ crash (ZeroDivisionError) nếu divider = 0
    math_result = 1000 / req.divider

    return {
        "status": "success",
        "file_content_preview": file_content[:50], 
        "math_result": math_result,
        "dynamic_result": dynamic_calculation
    }
