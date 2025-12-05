import { useState } from "react";
import { DishHeader } from "./components/DishHeader";
import { AISummaryCard } from "./components/AISummaryCard";
import { Highlights } from "./components/Highlights";
import { Trends } from "./components/Trends";
import { RootCauses } from "./components/RootCauses";
import { Recommendations } from "./components/Recommendations";
import { Benchmark } from "./components/Benchmark";
import { Reviews } from "./components/Reviews";

const mockData = {
  product: {
    name: "Karamelizer Burger",
    image: "https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjQ4OTE2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.3,
    price: "251,250 تومان"
  },
  summary: {
    short: "غذا طعم خوبی دارد اما چندین گزارش از سرد رسیدن و تاخیر آخر هفته ثبت شده است.",
    strengths: ["طعم عالی", "بسته‌بندی خوب"],
    issues: ["غذا سرد رسید", "تاخیر در تحویل"],
    trends: { temperature_issues: "+32%", weekend_delay: "+18%" },
    causes: [
      { text: "مسیرهای تحویل طولانی", confidence: 0.86 },
      { text: "بسته‌بندی حرارتی ناکافی", confidence: 0.72 }
    ],
    recommendations: [
      "استفاده از بسته‌بندی حرارتی",
      "افزایش پیک در روزهای شلوغ"
    ],
    benchmark: "زمان تحویل 25% کندتر از میانگین"
  },
  reviews: [
    { text: "کیفیت خوب بود و راضی بودم", rating: 5 },
    { text: "غذا سرد رسید ولی خوشمزه بود", rating: 4 },
    { text: "برگر خیلی خوشمزه بود، بسته‌بندی هم عالی", rating: 5 },
    { text: "متاسفانه با تاخیر زیادی رسید", rating: 3 },
    { text: "طعم برگر فوق‌العاده بود اما سرد رسید", rating: 4 },
    { text: "یکی از بهترین برگرهایی که خوردم", rating: 5 }
  ]
};

export default function App() {
  const [filterActive, setFilterActive] = useState<string | null>(null);

  const handleIssueClick = (issue: string) => {
    setFilterActive(issue);
  };

  const handleClearFilter = () => {
    setFilterActive(null);
  };

  // Filter reviews based on active filter
  const filteredReviews = filterActive
    ? mockData.reviews.filter(review => 
        (filterActive === "غذا سرد رسید" && review.text.includes("سرد")) ||
        (filterActive === "تاخیر در تحویل" && review.text.includes("تاخیر"))
      )
    : mockData.reviews;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Dish Header */}
        <DishHeader product={mockData.product} />

        {/* AI Summary Card */}
        <AISummaryCard summary={mockData.summary} />

        {/* Highlights */}
        <Highlights 
          strengths={mockData.summary.strengths}
          issues={mockData.summary.issues}
          onIssueClick={handleIssueClick}
        />

        {/* Trends */}
        <Trends trends={mockData.summary.trends} />

        {/* Root Causes */}
        <RootCauses causes={mockData.summary.causes} />

        {/* Recommendations */}
        <Recommendations recommendations={mockData.summary.recommendations} />

        {/* Benchmark */}
        <Benchmark benchmark={mockData.summary.benchmark} />

        {/* Reviews */}
        <Reviews 
          reviews={filteredReviews}
          filterActive={filterActive}
          onClearFilter={handleClearFilter}
        />
      </div>
    </div>
  );
}
