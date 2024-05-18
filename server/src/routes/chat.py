from flask import Blueprint, request, jsonify
from utils import client

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
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
