import json
import pandas as pd
from hazm import Normalizer, word_tokenize
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from openai import OpenAI
from datetime import datetime

# ----------------- Configuration -----------------
INPUT_FILE = 'data/restaurants2.json'  # فایل ورودی JSON
OUTPUT_FILE = 'output2.json'           # خروجی دقیقاً طبق خواسته تو

SENTIMENT_MODEL = "HooshvareLab/bert-fa-base-uncased-sentiment-deepsentipers-binary"

ASPECT_KEYWORDS = {
    "taste": ["طعم", "مزه", "خوشمزه", "بدمزه", "بی‌مزه", "شور", "ترش", "تازه", "ترد", "آبدار", "سوخته", "خام", "خشک", "چرب"],
    "delivery": ["پیک", "ارسال", "دیر", "زود", "سریع", "تاخیر", "داغ", "سرد", "گرم", "یخ", "به‌موقع"],
    "packaging": ["بسته‌بندی", "جعبه", "ظرف", "پلمپ", "تمیز", "کثیف", "ریخته", "له", "خراب", "شیک"],
    "price": ["قیمت", "گران", "ارزان", "منصفانه", "گرون", "به‌صرفه"],
    "portion": ["حجم", "مقدار", "کم", "زیاد", "کافی", "سیر", "کوچک"],
    "service": ["سرویس", "مودب", "بداخلاق", "محترم", "برخورد", "پیک"]
}

PERSIAN_STOPWORDS = ["و", "در", "به", "از", "که", "این", "را", "با", "است", "برای", "آن", "یک", "تا", "هم"]

# ----------------- Helper Functions -----------------
def load_data():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def preprocess_text(text):
    normalizer = Normalizer()
    text = normalizer.normalize(text)
    return ' '.join(word_tokenize(text))

def analyze_sentiment(texts):
    sentiment_pipeline = pipeline("sentiment-analysis", model=SENTIMENT_MODEL)
    results = sentiment_pipeline(texts)
    mapping = {"positive": "positive", "very_positive": "positive", "negative": "negative", "very_negative": "negative"}
    return [mapping.get(r['label'].lower(), 'neutral') for r in results]

def analyze_aspects(reviews, sentiments):
    scores = {aspect: {"positive": 0, "total": 0} for aspect in ASPECT_KEYWORDS}
    for text, sentiment in zip(reviews, sentiments):
        for aspect, keywords in ASPECT_KEYWORDS.items():
            if any(re.search(r'\b' + kw + r'\b', text) for kw in keywords):
                scores[aspect]["total"] += 1
                if sentiment == "positive":
                    scores[aspect]["positive"] += 1
    return {k: round(v["positive"] / v["total"], 2) if v["total"] > 0 else 0.5 for k, v in scores.items()}

def extract_keywords(df, sentiment, top_n=5):
    texts = df[df['sentiment'] == sentiment]['processed_text']
    if texts.empty:
        return []
    vectorizer = TfidfVectorizer(max_features=50, stop_words=PERSIAN_STOPWORDS)
    try:
        X = vectorizer.fit_transform(texts)
        keywords = vectorizer.get_feature_names_out()
        scores = X.sum(axis=0).A1
        top_idx = scores.argsort()[-top_n:][::-1]
        return [keywords[i] for i in top_idx]
    except:
        return []

def get_time_trends(df):
    df['date'] = pd.to_datetime(df['created_at']).dt.strftime('%Y-%m-%d')
    trends = df.groupby(['date', 'sentiment']).size().unstack(fill_value=0)
    trends = trends.reindex(columns=['positive', 'negative', 'neutral'], fill_value=0)
    return [{"date": idx, "positive": int(row.get('positive', 0)), "negative": int(row.get('negative', 0))} 
            for idx, row in trends.iterrows()]

def generate_ai_summary(restaurant_name, comments):
    client = OpenAI(
        base_url='https://api.gapgpt.app/v1',
        api_key='sk-R2PMlOqxTPoQR74fGogg7ioTuKndV3rQ6GZBT2Sq9Wl8oltS'  
    )
    sample = "\n".join([f"- {c}" for c in comments[:15]])  
    prompt = f"""
    خلاصه زیر را برای رستوران "{restaurant_name}" در 2-3 جمله کوتاه و جذاب به فارسی بنویس:
    تمرکز روی احساس کلی مشتریان، نقاط قوت و ضعف اصلی باشد.

    نظرات:
    {sample}
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"خلاصه تولید نشد: {str(e)}"

def calculate_health_score(pos_percent, rating, delivery_score):
    return min(100, int(pos_percent * 0.6 + (rating / 5 * 100) * 0.3 + delivery_score * 100 * 0.1))

data = load_data()
restaurants = {r['restaurant_id']: r for r in data['restaurants']}
reviews_df = pd.DataFrame(data['reviews'])

print("در حال بارگذاری مدل احساسات...")
sentiment_pipeline = pipeline("sentiment-analysis", model=SENTIMENT_MODEL)

final_output = []

for rid, info in restaurants.items():
    print(f"در حال پردازش: {info['name']}")
    
    df = reviews_df[reviews_df['restaurant_id'] == rid].copy()
    if df.empty:
        continue
        
    df['processed_text'] = df['comment_text'].apply(preprocess_text)
    df['sentiment'] = analyze_sentiment(df['processed_text'].tolist())
    
    total = len(df)
    pos_count = len(df[df['sentiment'] == 'positive'])
    neg_count = len(df[df['sentiment'] == 'negative'])
    
    aspect_scores = analyze_aspects(df['processed_text'], df['sentiment'])
    
    result = {
        "restaurant_id": rid,
        "restaurant_name": info['name'],
        "category": info['category'],
        "location": info['location'],
        "avg_rating": info['rating'],
        "price_range": info['price_range'],
        
        "sentiment_analysis": {
            "total_reviews": total,
            "positive_count": pos_count,
            "negative_count": neg_count,
            "positive_percentage": round(pos_count / total * 100, 1),
            "negative_percentage": round(neg_count / total * 100, 1)
        },
        
        "main_positive_topics": extract_keywords(df, 'positive', 6),
        "main_negative_topics": extract_keywords(df, 'negative', 6),
        
        "aspect_based_analysis": {
            "taste": aspect_scores['taste'],
            "delivery": aspect_scores['delivery'],
            "packaging": aspect_scores['packaging'],
            "price": aspect_scores['price'],
            "portion": aspect_scores['portion'],
            "service": aspect_scores['service']
        },
        
        "ai_summary": generate_ai_summary(info['name'], df['comment_text'].tolist()),
        
        "time_trends": get_time_trends(df),
        
        "smart_alerts": [
            "تاخیر در ارسال" if aspect_scores['delivery'] < 0.4 else None,
            "کیفیت طعم نیاز به بررسی" if aspect_scores['taste'] < 0.5 else None,
            "قیمت بالا نسبت به کیفیت" if aspect_scores['price'] < 0.4 else None
        ],
        
        "word_cloud": extract_keywords(df, 'positive', 15) + extract_keywords(df, 'negative', 10),
        
        "health_score": calculate_health_score(
            pos_count / total,
            info['rating'],
            aspect_scores['delivery']
        )
    }
    
    result["smart_alerts"] = [a for a in result["smart_alerts"] if a]
    
    final_output.append(result)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"\nتحلیل کامل شد! خروجی در فایل {OUTPUT_FILE} ذخیره شد.")
print(f"تعداد رستوران‌های تحلیل‌شده: {len(final_output)}")
