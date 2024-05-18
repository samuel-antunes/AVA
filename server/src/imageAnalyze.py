import base64
import os
from dotenv import load_dotenv
from flask import Flask, app, request, jsonify, send_file
from openai import OpenAI
from flask_cors import CORS

# OpenAI API Key
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app) 

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/imageAnalyze', methods=['POST'])
def imageAnalyze():
  image_path = "apple.jpg"
  print("hello")
  
  base64_image = encode_image(image_path)
  
  headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
    }
  
  payload = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "What is in this image?"
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }
  
  response = request.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
  
  if response.status_code == 200:
        return jsonify(response.json())
  else:
        return jsonify({"error": "Error analyzing image"}), response.status_code


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
