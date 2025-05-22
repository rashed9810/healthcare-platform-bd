import React from "react";
import { Loader2 } from "lucide-react";

interface PaymentProcessingLoaderProps {
  onCancel?: () => void;
}

function PaymentProcessingLoader({ onCancel }: PaymentProcessingLoaderProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground mb-4">Processing your payment...</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentProcessingLoader;
