from google import genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
response = client.models.generate_content(
    model="gemini-2.0-flash-lite", contents="Explain how AI works"
)
print(response.text)
