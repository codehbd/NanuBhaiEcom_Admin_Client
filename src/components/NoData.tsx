import { AlertCircle } from "lucide-react";

interface NoDataProps {
  message?: string;
}

export default function NoData({ message = "No data found" }: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <AlertCircle className="w-10 h-10 mb-3 text-gray-400" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
