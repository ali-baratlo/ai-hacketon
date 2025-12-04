import json
import pandas as pd
from hazm import Normalizer, word_tokenize
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
import arabic_reshaper
from bidi.algorithm import get_display
import re

# ----------------- Configuration -----------------

INPUT_FILE = 'data/restaurants.json'
OUTPUT_FILE = 'data/output.json'

SENTIMENT_MODEL = "HooshvareLab/bert-fa-base-uncased-sentiment-deepsentipers-binary"
SUMMARIZATION_MODEL = "persiannlp/mt5-small-parsinlu-squad-reading-comprehension"

ASPECT_KEYWORDS = {
    "taste": ["طعم", "مزه", "خوشمزه", "بدمزه", "بی‌مزه", "شور", "شیرین", "ترش"],
    "delivery": ["پیک", "ارسال", "رسیدن", "دیر", "زود", "سریع", "تاخیر", "داغ", "سرد"],
    "packaging": ["بسته‌بندی", "جعبه", "ظرف", "بسته", "پلمپ", "شیک", "تمیز", "کثیف"],
    "price": ["قیمت", "گران", "ارزان", "منصفانه", "تخفیف"],
    "portion": ["حجم", "مقدار", "کم", "زیاد", "کافی", "سیر"],
    "service": ["سرویس", "پشتیبانی", "پاسخگویی", "برخورد", "مودب", "بداخلاق"]
}

PERSIAN_STOPWORDS = [
    "و", "در", "به", "از", "که", "این", "را", "با", "است", "برای", "آن", "یک", "تا", "هم", "نیز",
    "من", "تو", "او", "ما", "شما", "ایشان", "هر", "همه", "هیچ", "چه", "چرا", "کجا", "چگونه",
    "چنین", "دیگر", "کسی", "چیزی", "جایی", "همین", "همان", "پیش", "پس", "روی", "زیر", "بر",
    "کنار", "میان", "بالای", "پایین", "قبل", "بعد", "دور", "نزدیک", "بسیار", "کم", "زیاد",
    "باید", "نباید", "شاید", "هرگز", "گاهی", "اغلب", "همیشه", "اکنون", "آنگاه", "سپس", "اما",
    "ولی", "اگر", "چون", "تا", "وقتی", "که", "نه", "یا", "یعنی", "فقط", "حتی", "مثل", "مانند"
]

# ----------------- Helper Functions -----------------

def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def preprocess_text(text):
    normalizer = Normalizer()
    text = normalizer.normalize(text)
    return ' '.join(word_tokenize(text))

def analyze_sentiment(reviews, sentiment_pipeline):
    results = sentiment_pipeline(reviews)
    label_map = {
        "positive": "positive", "very_positive": "positive",
        "negative": "negative", "very_negative": "negative",
        "neutral": "neutral", "other": "neutral"
    }
    return [label_map.get(res['label'].lower(), 'neutral') for res in results]

def analyze_aspects(reviews, sentiments, keywords):
    aspect_sentiments = {aspect: {'positive': 0, 'negative': 0, 'total': 0} for aspect in keywords}
    for i, review in enumerate(reviews):
        sentiment = sentiments[i]
        for aspect, kw_list in keywords.items():
            if any(re.search(r'\b' + kw + r'\b', review) for kw in kw_list):
                aspect_sentiments[aspect]['total'] += 1
                if sentiment == 'positive':
                    aspect_sentiments[aspect]['positive'] += 1
                elif sentiment == 'negative':
                    aspect_sentiments[aspect]['negative'] += 1
    aspect_scores = {}
    for aspect, counts in aspect_sentiments.items():
        if counts['total'] > 0:
            aspect_scores[aspect] = round(counts['positive'] / counts['total'], 2)
        else:
            aspect_scores[aspect] = 0.5
    return aspect_scores

def extract_themes(reviews_df, sentiment_label, top_n=3):
    sentiment_reviews = reviews_df[reviews_df['sentiment'] == sentiment_label]['processed_text']
    if sentiment_reviews.empty:
        return []
    vectorizer = TfidfVectorizer(max_features=100, stop_words=PERSIAN_STOPWORDS)
    try:
        tfidf_matrix = vectorizer.fit_transform(sentiment_reviews)
        feature_names = vectorizer.get_feature_names_out()
        top_indices = tfidf_matrix.sum(axis=0).argsort()[0, ::-1].tolist()[0]
        top_features = [feature_names[i] for i in top_indices[:top_n]]
        return top_features
    except ValueError:
        return []

def get_time_trends(reviews_df):
    df = reviews_df.copy()
    df['date'] = pd.to_datetime(df['created_at']).dt.date
    trends = df.groupby(['date', 'sentiment']).size().unstack(fill_value=0)
    if 'positive' not in trends:
        trends['positive'] = 0
    if 'negative' not in trends:
        trends['negative'] = 0
    trends = trends.reset_index()
    output_trends = []
    for _, row in trends.iterrows():
        output_trends.append({
            "date": row['date'].strftime('%Y-%m-%d'),
            "positive": int(row['positive']),
            "negative": int(row['negative'])
        })
    return sorted(output_trends, key=lambda x: x['date'])

def generate_alerts(reviews_df, daily_trends):
    alerts = []
    if daily_trends:
        neg_counts = [day['negative'] for day in daily_trends]
        if len(neg_counts) > 1:
            mean_neg = sum(neg_counts) / len(neg_counts)
            std_dev_neg = (sum([(x - mean_neg) ** 2 for x in neg_counts]) / len(neg_counts)) ** 0.5
            for day in daily_trends:
                if day['negative'] > mean_neg + 2 * std_dev_neg and day['negative'] > 3:
                    alerts.append({
                        "type": "negative_spike",
                        "message": f"Negative reviews on {day['date']} are unusually high ({day['negative']})."
                    })
    negative_reviews = reviews_df[reviews_df['sentiment'] == 'negative']['processed_text']
    if not negative_reviews.empty:
        all_neg_text = ' '.join(negative_reviews)
        for aspect, keywords in ASPECT_KEYWORDS.items():
            for kw in keywords:
                count = len(re.findall(r'\b' + kw + r'\b', all_neg_text))
                if count > 2:
                    alerts.append({
                        "type": "repeated_issue",
                        "message": f"The issue '{kw}' appeared in {count} negative reviews."
                    })
    return alerts

def generate_wordcloud_data(reviews, top_n=10):
    all_text = ' '.join(reviews)
    custom_stopwords = ["که", "از", "به", "در", "با", "و", "بود", "خیلی", "هم"]
    stop_words = PERSIAN_STOPWORDS + custom_stopwords
    word_tokens = word_tokenize(all_text)
    filtered_words = [w for w in word_tokens if w not in stop_words and len(w) > 1]
    word_freq = pd.Series(filtered_words).value_counts()
    return [{"word": k, "count": int(v)} for k, v in word_freq.head(top_n).items()]

def calculate_health_score(sentiment_summary, avg_rating, aspect_scores):
    positive_score = sentiment_summary.get('positive_percent', 0)
    rating_score = (avg_rating / 5.0) * 100
    delivery_health = aspect_scores.get('delivery', 0.5) * 100
    health_score = (positive_score * 0.5) + (rating_score * 0.3) + (delivery_health * 0.2)
    return min(100, int(health_score))

def generate_ai_summary(themes, alerts, trends, summarization_pipeline):
    context = "خلاصه تحلیل نظرات مشتریان:\n"
    if themes.get('top_positive_themes'):
        context += f"- نکات مثبت اصلی: {', '.join(themes['top_positive_themes'])}\n"
    if themes.get('top_negative_themes'):
        context += f"- نکات منفی اصلی: {', '.join(themes['top_negative_themes'])}\n"
    if alerts:
        alert_messages = [a['message'] for a in alerts[:2]]
        context += f"- هشدارهای مهم: {'; '.join(alert_messages)}\n"
    if trends:
        recent_trend = trends[-1]
        context += f"- روند اخیر ({recent_trend['date']}): {recent_trend['positive']} نظر مثبت در مقابل {recent_trend['negative']} نظر منفی.\n"

    # تغییر: استفاده از text2text-generation
    input_text = f"خلاصه کن: {context}"
    summary = summarization_pipeline(input_text, max_length=200, do_sample=False)[0]['generated_text']
    return summary

def main():
    print("Starting AI pipeline...")
    data = load_data(INPUT_FILE)
    print("Data loaded successfully.")
    restaurants = data['restaurants']
    reviews = pd.DataFrame(data['reviews'])

    print("Initializing sentiment analysis pipeline...")
    sentiment_pipeline = pipeline("sentiment-analysis", model=SENTIMENT_MODEL)
    print("Sentiment analysis pipeline initialized.")

    print("Initializing summarization pipeline...")
    summarization_pipeline = pipeline("text2text-generation", model=SUMMARIZATION_MODEL)
    print("Summarization pipeline initialized.")

    all_results = []

    for restaurant in restaurants:
        print(f"Processing restaurant: {restaurant['name']}")
        restaurant_id = restaurant['restaurant_id']
        restaurant_reviews = reviews[reviews['restaurant_id'] == restaurant_id].copy()
        if restaurant_reviews.empty:
            print(f"No reviews for {restaurant['name']}. Skipping.")
            continue

        restaurant_reviews['processed_text'] = restaurant_reviews['comment_text'].apply(preprocess_text)
        processed_reviews = restaurant_reviews['processed_text'].tolist()
        restaurant_reviews['sentiment'] = analyze_sentiment(processed_reviews, sentiment_pipeline)

        sentiment_counts = restaurant_reviews['sentiment'].value_counts()
        total_reviews = len(restaurant_reviews)
        sentiment_summary = {
            "total_reviews": total_reviews,
            "positive_percent": int((sentiment_counts.get('positive', 0) / total_reviews) * 100),
            "negative_percent": int((sentiment_counts.get('negative', 0) / total_reviews) * 100),
            "neutral_percent": int((sentiment_counts.get('neutral', 0) / total_reviews) * 100)
        }

        aspect_scores = analyze_aspects(processed_reviews, restaurant_reviews['sentiment'].tolist(), ASPECT_KEYWORDS)
        top_themes = {
            "top_positive_themes": extract_themes(restaurant_reviews, 'positive'),
            "top_negative_themes": extract_themes(restaurant_reviews, 'negative')
        }
        time_trends = get_time_trends(restaurant_reviews)
        alerts = generate_alerts(restaurant_reviews, time_trends)
        word_cloud_data = generate_wordcloud_data(processed_reviews)
        health_score = calculate_health_score(sentiment_summary, restaurant['rating'], aspect_scores)
        ai_summary = generate_ai_summary(top_themes, alerts, time_trends, summarization_pipeline)

        result = {
            "restaurant_id": restaurant_id,
            "restaurant_name": restaurant['name'],
            "sentiment_summary": sentiment_summary,
            "top_themes": top_themes,
            "aspect_based_sentiment": aspect_scores,
            "ai_summary": ai_summary,
            "time_trends": time_trends,
            "alerts": alerts,
            "word_cloud_data": word_cloud_data,
            "health_score": health_score
        }
        all_results.append(result)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=4)

    print(f"Analysis complete. Results saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
