from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
import os

class Recommendation(BaseModel):
    product: str
    text: str

# Load environment variables
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def recommendation_system(crop: str, lat: float, lon: float): 
    with open("./docs/syngenta_products.md", "r") as fp:
        syngenta_products = fp.read()

    prompt = f"""
    You are an intelligent agricultural recommender system for farmers in India. Your goal is to analyze soil and weather conditions and provide precise recommendations on Syngenta products that can optimize crop growth and yield. 

    ### **Inputs:**  
    - **Products Catalog:**  
    {syngenta_products}  
    - **Farm Location:**  
    - Latitude: {lat}  
    - Longitude: {lon}  
    - **Crop:** {crop}  
    - **Sensor Data:** (Simulated)  
    - **Weather:** Temperature, precipitation, wind speed  
    - **Soil:** Nutrient levels, temperature, moisture content  

    ### **Task:**  
    1. Analyze the provided weather and soil conditions.  
    2. Determine if any products from the catalog are needed to improve crop health or yield.  
    3. If the conditions are already optimal, return **"No products recommended"** instead of unnecessary suggestions.  
    4. If recommendations are made, provide a brief explanation for each product suggestion.  

    ### **Output Format:**  
    - **Recommended Products:** List of product names  
    - **Reasoning:** Explanation of why each product is recommended based on the soil and weather conditions  

    Now, based on the given data, what are the best product recommendations?
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite", 
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[Recommendation],
        },
    )

    return response.text
