import { Lightbulb } from "lucide-react";

interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 shadow-sm border border-amber-100 slide-in-right">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h3 className="text-amber-900">پیشنهادات بهبود</h3>
      </div>
      
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3"
          >
            <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
              {index + 1}
            </div>
            <p className="text-gray-700 flex-1">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
