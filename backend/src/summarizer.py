# backend/src/summarizer.py
from transformers import BartForConditionalGeneration, BartTokenizer

class TextSummarizer:
    def __init__(self, model_name='facebook/bart-large-cnn'):
        self.tokenizer = BartTokenizer.from_pretrained(model_name)
        self.model = BartForConditionalGeneration.from_pretrained(model_name)

    def summarize(self, text, do_sample=False):
        inputs = self.tokenizer([text], max_length=1024, return_tensors='pt', truncation=True)

        text_length = len(text.split())
        max_length = min(512, max(50, text_length // 2))
        min_length = min(200, max(30, text_length // 4))
        
        summary_ids = self.model.generate(
            inputs['input_ids'], 
            num_beams=4, 
            max_length=max_length, 
            min_length=min_length, 
            length_penalty=2.0, 
            early_stopping=True
        )
        summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)

        points = self.extract_points(summary)
        
        return summary, points

    def extract_points(self, summary):
        sentences = summary.split('. ')
        points = [sentence.strip() + '.' for sentence in sentences if len(sentence) > 0]
        return points
