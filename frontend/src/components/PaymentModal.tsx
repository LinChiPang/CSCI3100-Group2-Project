import { useState } from "react";
import { X, CreditCard, CheckCircle } from "lucide-react";
import { mockCheckout } from "../services/api";
import { formatDollars } from "../utils/format";

interface PaymentModalProps {
  itemTitle: string;
  price: number; // numeric HKD
  /** When set, checkout is attributed to this listing's community (same as buyer's community). */
  itemId?: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentModal({ itemTitle, price, itemId, onSuccess, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handlePay() {
    try {
      setLoading(true);
      setError(null);
      await mockCheckout(itemTitle, price, itemId);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleSuccessDone() {
    onSuccess();
    onClose();
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* Modal card — stop click propagation so backdrop click doesn't close while inside */}
      <div
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle size={48} className="text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Successful!</h2>
            <p className="text-sm text-gray-600">
              Mock Stripe checkout completed for <strong>{itemTitle}</strong>.
            </p>
            <button
              onClick={handleSuccessDone}
              className="mt-2 rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Mock Stripe Checkout</h2>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Item</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">{itemTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold text-gray-900">{formatDollars(price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span className="text-gray-400 italic">Stripe (mock)</span>
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-5 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
            >
              {loading ? "Processing…" : `Pay ${formatDollars(price)}`}
            </button>

            <p className="mt-2 text-center text-xs text-gray-400">
              This is a simulated payment — no real charge is made.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
