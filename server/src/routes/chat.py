from flask import Blueprint, request, jsonify
from utils.openai_client import client
import tempfile
import os
import base64
import requests
import json

chat_bp = Blueprint('chat', __name__)

def analyze_image(image, messages):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            image.save(tmp_file.name)
            file_path = tmp_file.name
        
        with open(file_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
        }

        payload = {
            "model": "gpt-4o",
            "messages": messages[:-1] + [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": messages[-1]['content']},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ],
                }
            ],
            "max_tokens": 300
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        response_json = response.json()
        if response.status_code != 200:
            return None, response_json
        reply = response_json['choices'][0]['message']['content'].strip()
        
        os.remove(file_path) 
        
        return reply, None
    except Exception as e:
        print(e)
        return None, str(e)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    messages = request.form.get('messages')
    image = request.files.get('image')

    if not messages:
        return jsonify({'error': 'No messages provided'}), 400

    messages = json.loads(messages)
    system_message = {
        "role": "system",
        "content": """You are a translator assistant. You should respond to users
        using the language they are also using in their last request.
        Also make sure to translate anything they ask, but make sure to only
        speak in the requested translation language when asked to translate something.
        Do not use the requested translation language outside of a translation.
        If an image is given, please focus on the translation, rather than the description of the image."""
    }
    messages.insert(0, system_message)
    
    try:
        if image:
            last_message = messages[-1]
            image_description, error = analyze_image(image, messages)
            if error:
                return jsonify({'error': error}), 500
            reply = image_description
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            reply = response.choices[0].message.content.strip()

        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
