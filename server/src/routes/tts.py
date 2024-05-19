from flask import Blueprint, request, jsonify, send_file
from src.utils.openai_client import client
import tempfile
import os
from pydub import AudioSegment
import json

tts_bp = Blueprint('tts', __name__)

def split_text_by_language(text):
    system_message = {
        "role": "system",
        "content": 
        """You are an expert language assistant. Your task is to analyze the provided text and accurately split it 
        into segments based on the language being spoken in each part. The result should be a list of 
        [language, content] pairs, maintaining the original order and meaning of the text. Ensure no part of 
        the text is omitted or incorrectly attributed to a language.

        Example:
        Input: 'Sure, "a casa vermelha" translates to "das rote Haus" in German.'
        Output: [["English", "Sure, "], ["Portuguese", "a casa vermelha"], ["English", " translates to "], ["German", "das rote Haus"], ["English", " in German."]].

        Make sure:
        - Each segment accurately reflects the language spoken.
        - The content of the original text is fully preserved in the segments.
        """
    }

    user_message = {"role": "user", "content": text}

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[system_message, user_message]
    )

    result = response.choices[0].message.content.strip()

    segments = eval(result)
    return segments

def create_tts_segment(text, voice):
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            response_format="mp3"
        )
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        with open(temp_file.name, 'wb') as audio_file:
            for chunk in response.iter_bytes():
                if chunk:
                    audio_file.write(chunk)
        return temp_file.name
    except Exception as e:
        print(f"Error creating TTS segment: {e}")
        return None

@tts_bp.route('/tts', methods=['POST'])
def tts():
    text = request.json.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    combined_file = None

    try:
        segments = split_text_by_language(text)
        audio_files = []

        for language, segment_text in segments:
           
            audio_file_path = create_tts_segment(segment_text, "alloy")
            if audio_file_path:
                audio_files.append(audio_file_path)
        
        combined = AudioSegment.empty()
        for file_path in audio_files:
            with open(file_path, 'rb') as audio_file:
                audio_segment = AudioSegment.from_mp3(audio_file)
                combined += audio_segment
            os.remove(file_path)  # Clean up individual segment file
        
        combined_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        combined.export(combined_file.name, format="mp3")
        
        return send_file(combined_file.name, as_attachment=True, download_name="output.mp3", mimetype="audio/mpeg")
    except Exception as e:
        
        return jsonify({'error': str(e)}), 500
    finally:
        if combined_file and os.path.exists(combined_file.name):
            try:
                os.remove(combined_file.name)
            except Exception as e:
                print(f"Error removing file: {e}")
