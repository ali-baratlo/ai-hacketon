import { BarChart3 } from "lucide-react";

interface BenchmarkProps {
  benchmark: string;
}

export function Benchmark({ benchmark }: BenchmarkProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 slide-in-right">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3>مقایسه با رقبا</h3>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-gray-700">{benchmark}</p>
      </div>
    </div>
  );
}
