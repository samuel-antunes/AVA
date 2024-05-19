from openai import OpenAI
from config import Config

client = OpenAI(api_key=Config.OPENAI_API_KEY)
