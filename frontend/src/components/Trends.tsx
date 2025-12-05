import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendsProps {
  trends: {
    temperature_issues: string;
    weekend_delay: string;
  };
}

export function Trends({ trends }: TrendsProps) {
  const trendItems = [
    {
      label: "افزایش گزارش غذای سرد",
      value: trends.temperature_issues,
      type: "up" as const
    },
    {
      label: "افزایش تاخیر آخر هفته",
      value: trends.weekend_delay,
      type: "up" as const
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm slide-in-right">
      <h3 className="mb-4">روندها</h3>
      
      <div className="space-y-3">
        {trendItems.map((trend, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {trend.type === "up" ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500" />
              )}
              <span className="text-gray-700">{trend.label}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              trend.type === "up" 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {trend.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
