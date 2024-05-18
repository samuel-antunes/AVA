from flask import Flask, request, jsonify, send_file, after_this_request
import os
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS
import tempfile

# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")

# Instantiate OpenAI client
client = OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
            file_path = tmp_file.name
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

        return send_file(file_path, as_attachment=True, download_name="output.mp3", mimetype="audio/mpeg")
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error removing file: {e}")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
            file.save(tmp_file.name)
            file_path = tmp_file.name
        
        with open(file_path, 'rb') as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        
        os.remove(file_path)
        
        # Check if the transcription object has the expected structure
        return jsonify({'transcription': transcription})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
