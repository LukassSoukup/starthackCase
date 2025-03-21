from google import genai
import json
from pydantic import BaseModel
from dotenv import load_dotenv
from api import get_forecast_data
import os
from typing import Literal

class Recommendation(BaseModel):
    product: Literal["Stress Buster","Yield Booster"]
    simple_description: str
    detailed_description: str

# Load environment variables
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def recommendation_system(crop: str, lat: float, lon: float): 

    # Compute API data
    api_data = get_forecast_data(lat, lon, crop)

    # Products Catalog
    with open("./docs/syngenta_products.md", "r", encoding="utf-8") as fp:
        syngenta_products = fp.read()

    # Algorithms
    with open("./docs/syngenta_algorithms.md", "r", encoding="utf-8") as fp:
        syngenta_algorithms = fp.read()

    prompt = f"""
    You are an intelligent agricultural recommender system for farmers in India. 
    Nutrient Booster is not used in India.
    Your goal is to analyze the weather and soil conditions for the next 30 days and provide precise recommendations on Syngenta products that can optimize crop growth and yield. 
    You will also consider various algorithms to compute the crop stress index based on the provided data.

    ### **Inputs:**  
    - **Products Catalog:**  
    {syngenta_products}
    - **Algorithms:**  
    {syngenta_algorithms}  

    - **Farm Location:**  
    - Latitude: {lat}  
    - Longitude: {lon}  

    - **Crop:** {crop}  

    - **30-Day Weather and Soil Data (Averages):**
    Below is the average weather and soil data for the next 30 days. Analyze this to determine the conditions that will affect crop growth and suggest products accordingly.
    
    - **Weather Conditions:**
        - **Temperature (Min/Max/Average):** {api_data['TempAir_DailyMin (C)']}°C, {api_data['TempAir_DailyMax (C)']}°C, {api_data['TempAir_DailyAvg (C)']}°C
        - **Precipitation (Total):** {api_data['Precip_DailySum (mm)']} mm  
        - **Precipitation Probability:** {api_data['PrecipProbability_Daily (pct)']}%  
        - **Shower Probability (Max):** {api_data['ShowerProbability_DailyMax (pct)']}%  
        - **Thunderstorm Probability (Max):** {api_data['ThunderstormProbability_DailyMax (pct)']}%  
        - **Humidity (Min/Max/Average):** {api_data['HumidityRel_DailyMin (pct)']}%, {api_data['HumidityRel_DailyMax (pct)']}%, {api_data['HumidityRel_DailyAvg (pct)']}%
        - **Wind Speed (Avg/Min/Max):** {api_data['WindSpeed_DailyAvg (m/s)']} m/s, {api_data['WindSpeed_DailyMin (m/s)']} m/s, {api_data['WindSpeed_DailyMax (m/s)']} m/s
        - **Wind Gust (Max):** {api_data['WindGust_DailyMax (m/s)']} m/s  
        - **Wind Direction (Avg):** {api_data['WindDirection_DailyAvg (Deg)']}°  
        - **Snow Fraction (Daily):** {api_data['SnowFraction_Daily (pct)']}%

    - **Soil Conditions:**
        - **Soil Moisture (Max/Avg/Min):** {api_data['Soilmoisture_0to10cm_DailyMax (vol%)']}%, {api_data['Soilmoisture_0to10cm_DailyAvg (vol%)']}%, {api_data['Soilmoisture_0to10cm_DailyMin (vol%)']}%
        - **Soil Temperature (Max/Avg/Min):** {api_data['Soiltemperature_0to10cm_DailyMax (C)']}°C, {api_data['Soiltemperature_0to10cm_DailyAvg (C)']}°C, {api_data['Soiltemperature_0to10cm_DailyMin (C)']}°C

    - **Evapotranspiration (Total):** {api_data['Referenceevapotranspiration_DailySum (mm)']} mm

    ### **Task:**  
    1. Analyze the provided weather and soil conditions for the next 30 days.
    2. Use the algorithms to compute the crop stress index (if applicable).
    3. Based on the analysis, determine which Syngenta products are needed to optimize crop health or yield, if required.
    4. If the conditions are already optimal, return **"No products recommended"** instead of unnecessary suggestions.
    5. If recommendations are made, provide a brief explanation for each product suggestion.

    ### **Output Format:**  
    - **Recommended Products:** List of product names.
    - **Small Description:** A short explanation of why each product is recommended based on the 30-day weather and soil conditions.
    - **Detailed Description:** A detailed explanation of why each product is recommended based on the 30-day weather and soil conditions, explaining the reasoning process.
    
    Now, based on the given data, what are the best product recommendations?
    """


    response = client.models.generate_content(
        model="gemini-2.0-flash-lite", 
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[Recommendation],
            'temperature': 0.2  # Lower temperature for consistency
        },
    )

    return json.loads(response.text)
