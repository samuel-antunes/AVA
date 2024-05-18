from flask import Flask
from flask_cors import CORS
from routes import chat_bp, tts_bp, transcribe_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(tts_bp, url_prefix='/api')
app.register_blueprint(transcribe_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
