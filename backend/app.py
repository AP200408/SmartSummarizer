# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Ensure the src directory is in the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from summarizer import TextSummarizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

summarizer = TextSummarizer()

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    text = data.get('text', '')
    if text:
        summary, points = summarizer.summarize(text)
        return jsonify({'summary': summary, 'points': points})
    return jsonify({'error': 'No text provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
