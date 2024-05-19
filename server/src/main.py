from flask import Flask
from flask_cors import CORS
from src.routes import chat_bp, tts_bp, transcribe_bp, image_analysis_bp
import os

app = Flask(__name__)
CORS(app)  

app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(tts_bp, url_prefix='/api')
app.register_blueprint(transcribe_bp, url_prefix='/api')
app.register_blueprint(image_analysis_bp, url_prefix='/api')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4000))
    app.run(host="0.0.0.0", port=port, debug=False)
    
