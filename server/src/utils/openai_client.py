from openai import OpenAI
from src.config import Config

client = OpenAI(api_key=Config.OPENAI_API_KEY)
