from flask import Blueprint, request, jsonify, send_file
from utils import client
import tempfile
import os

tts_bp = Blueprint('tts', __name__)

@tts_bp.route('/tts', methods=['POST'])
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
