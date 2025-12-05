import Image from "next/image"
import { Star, MapPin, ThumbsUp, ThumbsDown, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Restaurant {
  restaurant_id: number
  restaurant_name: string
  category: string
  location: string
  avg_rating: number
  price_range: string
  sentiment_analysis: {
    total_reviews: number
    positive_count: number
    negative_count: number
    positive_percentage: number
    negative_percentage: number
  }
  main_positive_topics: string[]
  main_negative_topics: string[]
  aspect_based_analysis: {
    taste: number
    delivery: number
    packaging: number
    price: number
    portion: number
    service: number
  }
  ai_summary: string
  smart_alerts: string[]
  health_score: number
}

const aspectLabels: Record<string, string> = {
  taste: "طعم",
  delivery: "ارسال",
  packaging: "بسته‌بندی",
  price: "قیمت",
  portion: "حجم",
  service: "خدمات",
}

export function RestaurantDetails({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Image */}
      <Card className="overflow-hidden">
        <div className="relative h-64 w-full">
          <Image src="/delicious-pizza-restaurant-with-warm-lighting.jpg" alt={restaurant.restaurant_name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-amber-500 text-white">
                {restaurant.category}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {restaurant.price_range}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{restaurant.restaurant_name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{restaurant.avg_rating}</span>
                <span className="text-white/70">({restaurant.sentiment_analysis.total_reviews} نظر)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            خلاصه نظرات (هوش مصنوعی)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{restaurant.ai_summary}</p>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Positive Topics */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <ThumbsUp className="h-5 w-5" />
              نقاط قوت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {restaurant.main_positive_topics.slice(0, 3).map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                {restaurant.sentiment_analysis.positive_percentage}% نظرات مثبت
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Negative Topics */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <ThumbsDown className="h-5 w-5" />
              نقاط ضعف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {restaurant.main_negative_topics.slice(0, 3).map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm px-3 py-1"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-400">
                {restaurant.sentiment_analysis.negative_percentage}% نظرات منفی
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aspect Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>تحلیل جنبه‌های مختلف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(restaurant.aspect_based_analysis).map(([aspect, score]) => (
              <div key={aspect} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{aspectLabels[aspect]}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(score * 100)}%</span>
                </div>
                <Progress value={score * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Alerts & Health Score */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Smart Alerts */}
        {restaurant.smart_alerts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                هشدارهای هوشمند
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {restaurant.smart_alerts.map((alert, index) => (
                  <li key={index} className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {alert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Health Score */}
        <Card>
          <CardHeader>
            <CardTitle>امتیاز سلامت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(restaurant.health_score / 100) * 251.2} 251.2`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{restaurant.health_score}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  امتیاز سلامت بر اساس تحلیل نظرات، روند رضایت مشتریان و کیفیت خدمات محاسبه می‌شود.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">{restaurant.sentiment_analysis.total_reviews}</p>
              <p className="text-sm text-muted-foreground">تعداد نظرات</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-600">{restaurant.sentiment_analysis.positive_count}</p>
              <p className="text-sm text-muted-foreground">نظرات مثبت</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-red-600">{restaurant.sentiment_analysis.negative_count}</p>
              <p className="text-sm text-muted-foreground">نظرات منفی</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-amber-500">{restaurant.avg_rating}</p>
              <p className="text-sm text-muted-foreground">میانگین امتیاز</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
