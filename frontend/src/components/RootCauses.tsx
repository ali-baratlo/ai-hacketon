import { AlertCircle } from "lucide-react";

interface Cause {
  text: string;
  confidence: number;
}

interface RootCausesProps {
  causes: Cause[];
}

export function RootCauses({ causes }: RootCausesProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm slide-in-right">
      <h3 className="mb-4">علل احتمالی</h3>
      
      <div className="space-y-3">
        {causes.map((cause, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-700 mb-2">{cause.text}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${cause.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round(cause.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
