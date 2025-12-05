import { Star, MessageSquare, X } from "lucide-react";

interface Review {
  text: string;
  rating: number;
}

interface ReviewsProps {
  reviews: Review[];
  filterActive: string | null;
  onClearFilter: () => void;
}

export function Reviews({ reviews, filterActive, onClearFilter }: ReviewsProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm slide-in-right">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h3>نظرات مشتریان</h3>
        </div>
        {filterActive && (
          <button
            onClick={onClearFilter}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>پاک کردن فیلتر</span>
          </button>
        )}
      </div>

      {filterActive && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            فیلتر شده بر اساس: <span className="font-semibold">{filterActive}</span>
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">2 روز پیش</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
