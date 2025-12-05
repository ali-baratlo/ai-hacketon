import { Check, X } from "lucide-react";

interface HighlightsProps {
  strengths: string[];
  issues: string[];
  onIssueClick: (issue: string) => void;
}

export function Highlights({ strengths, issues, onIssueClick }: HighlightsProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm slide-in-right">
      <h3 className="mb-4">نقاط قوت و ضعف</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">نقاط قوت</p>
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength, index) => (
              <div 
                key={index}
                className="bg-green-50 text-green-700 px-3 py-2 rounded-lg flex items-center gap-1.5 border border-green-200"
              >
                <Check className="w-4 h-4" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">مشکلات گزارش شده</p>
          <div className="flex flex-wrap gap-2">
            {issues.map((issue, index) => (
              <button
                key={index}
                onClick={() => onIssueClick(issue)}
                className="bg-red-50 text-red-700 px-3 py-2 rounded-lg flex items-center gap-1.5 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{issue}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
