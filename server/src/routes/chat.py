from flask import Blueprint, request, jsonify
from src.utils.openai_client import client
import tempfile
import os
import base64
import requests
import json
from PyPDF2 import PdfReader

chat_bp = Blueprint('chat', __name__)

def analyze_image(image, messages):
    print(image)
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

        user_prompt = messages[-1]['content']
        # full_content = f"User prompt: {user_prompt}\n The user has uploaded an image, the base64 encoded image is: {base64_image}"
        print()
        payload = {
            "model": "gpt-4o",
            "messages": [messages[0]] + [
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


        # response = {}
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

def analyze_pdf(pdf, messages):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            pdf.save(tmp_file.name)
            file_path = tmp_file.name

        with open(file_path, "rb") as pdf_file:
            reader = PdfReader(pdf_file)
            num_pages = len(reader.pages)
            text = ""
            for i in range(num_pages):
                page = reader.pages[i]
                text += page.extract_text()

        user_prompt = messages[-1]['content']
        full_content = f"User prompt: {user_prompt}\n The user has uploaded a PDF file, the content is: {text}"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
        }

        payload = {
            "model": "gpt-4o",
            "messages": [messages[0]] + [
                {
                    "role": "user",
                    "content": full_content,
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
    favorite_languages = request.form.get('favoriteLanguages')
    image = request.files.get('image')
    pdf = request.files.get('pdf')

    if not messages:
        return jsonify({'error': 'No messages provided'}), 400

    messages = json.loads(messages)
    favorite_languages = json.loads(favorite_languages) if favorite_languages else []
    system_message = {
        "role": "system",
        "content": f"""
        You are the Artificial Verbal Assistant, AVA for short, which is a translator assistant.
        You should respond to users using the language they are also using in their last request.
        Also make sure to translate anything they ask, but make sure to only
        speak in the requested translation language when asked to translate something.
        Do not use the requested translation language outside of a translation.
        If an image is given, please focus on the translation, rather than the description of the image.
        User's favorite languages are: {', '.join(favorite_languages)}.
        """
    }
    messages.insert(0, system_message)
    
    try:
        if image:
            image_description, error = analyze_image(image, messages)
            if error:
                return jsonify({'error': error}), 500
            reply = image_description
        elif pdf:
            pdf_translation, error = analyze_pdf(pdf, messages)
            if error:
                return jsonify({'error': error}), 500
            reply = pdf_translation
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            reply = response.choices[0].message.content.strip()

        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
