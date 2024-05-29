<<<<<<< HEAD
=======
# backend/app.py
>>>>>>> 2010f9de0ebe0c5351540c920dc74c7fb64dec3d
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from summarizer import TextSummarizer

app = Flask(__name__)
CORS(app)

summarizer = TextSummarizer()

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    text = data.get('text', '')
    if text:
        summary, points = summarizer.summarize(text)
        return jsonify({'summary': summary, 'points': points})
    return jsonify({'error': 'No text provided'}), 400


