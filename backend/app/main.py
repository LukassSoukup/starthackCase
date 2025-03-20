import fastapi
import uvicorn

app = fastapi.FastAPI()


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
    return [
        {
            "text": "Good product for you",
            "product": "Product A",
        },
        {
            "text": "This product is not recommended",
            "product": "Product B",
        },
        {
            "text": "This is the best product for you",
            "product": "Product C",
        },
    ]


@app.get("/results")
def get_results(lat: float, lon: float, crop: str):
    return {}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
