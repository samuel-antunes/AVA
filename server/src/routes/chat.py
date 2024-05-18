from flask import Blueprint, request, jsonify
from utils.openai_client import client

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    conversation = request.json.get('conversation')
    if not conversation:
        return jsonify({'error': 'No conversation provided'}), 400

    system_message = {"role": "system",
     "content": 
     """You are a translator assistant. You should respond to users
     using the language they are also using in their last request.
     Also make sure to translate anything they ask, but make sure to only
     speak in the requested  translation language when asked to translate something.
     Do not use the requested translation language outside of a translation.
    """}
    conversation.insert(0, system_message)

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversation
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
