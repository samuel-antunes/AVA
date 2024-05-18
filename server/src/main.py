from flask import Flask, request, jsonify, send_file
import os
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS
import uuid
import time

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app)  

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # specify the model here
            messages=[{"role": "user", "content": user_input}]
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tts', methods=['POST'])
def tts():
    text = request.json.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        unique_filename = f"{uuid.uuid4()}.mp3"
        file_path = os.path.join(os.getcwd(), unique_filename)
        with open(file_path, 'wb') as audio_file:
            response = client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text,
                response_format="mp3"
            )
            for chunk in response.iter_bytes():
                if chunk: 
                    audio_file.write(chunk)
        
        time.sleep(1)

        return send_file(file_path, as_attachment=True, download_name="output.mp3", mimetype="audio/mpeg")
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
