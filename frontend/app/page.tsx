import { redirect } from "next/navigation"

const restaurantData = {
  restaurant_id: 1,
  restaurant_name: "پیتزا شب تهران شعبه ونک",
  category: "Pizza",
  location: "ونک",
  avg_rating: 4.3,
  price_range: "$$",
  sentiment_analysis: {
    total_reviews: 30,
    positive_count: 19,
    negative_count: 11,
    positive_percentage: 63.3,
    negative_percentage: 36.7,
  },
  main_positive_topics: ["داغ", "با کیفیت", "خوش طعم"],
  main_negative_topics: ["سرد بودن", "تاخیر در تحویل"],
  aspect_based_analysis: {
    taste: 0.67,
    delivery: 0.67,
    packaging: 0.67,
    price: 0.0,
    portion: 0.5,
    service: 0.75,
  },
  ai_summary:
    'رستوران "پیتزا شب تهران شعبه ونک" با پیتزاهای خوش‌طعم و خمیر عالی، نظر برخی مشتریان را به خود جلب کرده است، اما مشکلاتی مانند تأخیر در تحویل و بسته‌بندی نامناسب نیز گزارش شده است. پیک سریع و مودب و طعم‌های بی‌نظیر در کنار نوسانات کیفیت خدمات، تجربه‌ای متفاوت برای مشتریان ایجاد می‌کند.',
  smart_alerts: ["قیمت بالا نسبت به کیفیت"],
  health_score: 32,
}

export default function Home() {
  redirect("/restaurant/1")
}
