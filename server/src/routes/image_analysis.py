from flask import Blueprint, request, jsonify
from src.utils.openai_client import client
import tempfile
import os
import base64

image_analysis_bp = Blueprint('image_analysis', __name__)

@image_analysis_bp.route('/analyze-image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            file.save(tmp_file.name)
            file_path = tmp_file.name
        
        with open(file_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
        }

        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What’s in this image?"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ],
                }
            ],
            "max_tokens": 300
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        response_json = response.json()
        if response.status_code != 200:
            return jsonify({'error': response_json}), response.status_code
        reply = response_json['choices'][0]['message']['content'].strip()
        
        os.remove(file_path)  # Clean up the saved file
        
        return jsonify({'description': reply})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
