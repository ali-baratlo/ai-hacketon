import { Sparkles, Clock } from "lucide-react";

interface AISummaryCardProps {
  summary: {
    short: string;
  };
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 shadow-sm border border-purple-100 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-purple-500 rounded-full p-2">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-purple-900">خلاصه نظر مشتری‌ها (با هوش مصنوعی)</h3>
      </div>
      <p className="text-gray-700 leading-relaxed mb-3">
        {summary.short}
      </p>
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <Clock className="w-4 h-4" />
        <span>بروزرسانی: 2 ساعت پیش</span>
      </div>
    </div>
  );
}
