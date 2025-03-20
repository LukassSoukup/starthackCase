import fastapi
import uvicorn
from gemini import recommendation_system
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow only specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/risks")
def get_risks(lat: float, lon: float, crop: str):
    return {
        "daytime_heat_stress": 3,
        "nighttime_heat_stress": 4,
        "frost_stress": 9,
        "drought_index": 0,
    }


@app.get("/recommendations")
def get_recommendations(lat: float, lon: float, crop: str):
    return recommendation_system(crop, lat, lon)


@app.get("/results")
def get_results(lat: float, lon: float, crop: str):
    return {}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
