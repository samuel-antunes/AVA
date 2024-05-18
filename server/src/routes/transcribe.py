from flask import Blueprint, request, jsonify
from utils import client
import tempfile
import os

transcribe_bp = Blueprint('transcribe', __name__)

@transcribe_bp.route('/transcribe', methods=['POST'])
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
        
        return jsonify({'transcription': transcription})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
