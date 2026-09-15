from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import h3
import time
import httpx

app = FastAPI(title="Uber H3 Location Service")

@app.get("/api/location/search")
async def search_location(q: str):
    """Proxy for Nominatim to avoid Browser CORS and User-Agent restrictions"""
    if not q:
        return []
    
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "format": "json",
        "q": q,
        "limit": 5
    }
    headers = {
        "User-Agent": "AI-Studio-H3-App/1.0",
        "Accept-Language": "vi,en"
    }
    
    try:
        print(f"[DEBUG] Fetching location: {q} from Nominatim...")
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers, timeout=10.0)
            print(f"[DEBUG] Nominatim response status: {response.status_code}")
            
            response.raise_for_status()
            data = response.json()
            print(f"[DEBUG] Found {len(data)} results for {q}")
            return data
    except httpx.HTTPStatusError as e:
        print(f"[DEBUG] HTTP Status Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=502, detail=f"Nominatim API returned HTTP {e.response.status_code}")
    except httpx.RequestError as e:
        print(f"[DEBUG] Network/Request Error: {str(e)}")
        raise HTTPException(status_code=503, detail="Failed to connect to Nominatim API due to a network error.")
    except Exception as e:
        print(f"[DEBUG] General Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

class LocationRequest(BaseModel):
    lat: float = Field(..., description="Latitude", ge=-90.0, le=90.0)
    lng: float = Field(..., description="Longitude", ge=-180.0, le=180.0)
    resolution: int = Field(8, description="H3 Resolution (0-15)", ge=0, le=15)

class LocationResponse(BaseModel):
    h3_index: str
    processing_time_ms: float

@app.post("/api/location/encode", response_model=LocationResponse)
async def encode_location(req: LocationRequest):
    start_time = time.perf_counter()
    try:
        # h3-py v4+ uses latlng_to_cell
        h3_index = h3.latlng_to_cell(req.lat, req.lng, req.resolution)
        
        # Ensure it's returned as string (h3 v4 returns string ID natively, but just to be safe)
        if isinstance(h3_index, int):
            h3_index = hex(h3_index)[2:]
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"H3 Conversion Error: {str(e)}")
        
    end_time = time.perf_counter()
    processing_time_ms = (end_time - start_time) * 1000
    
    return {
        "h3_index": h3_index,
        "processing_time_ms": round(processing_time_ms, 4)
    }
