import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  CreditCard, 
  QrCode, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { Order } from '../types';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onBackToCart, 
  onOrderSuccess 
}) => {
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    cartWaitEstimate, 
    currentUser, 
    placeOrder 
  } = useCafe();

  const [customerName, setCustomerName] = useState(currentUser.name !== 'Student Guest' ? currentUser.name : 'Chaitanya');
  const [rollNumber, setRollNumber] = useState(currentUser.rollNumber || 'CS23B104');
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_counter' | 'upi'>('pay_at_counter');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!termsAgreed) {
      setErrorMessage('Please agree to the café ordering terms to continue.');
      return;
    }
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

  setTimeout(async () => {
      try {
        const order = await placeOrder(
          customerName || 'Guest Student', 
          rollNumber || 'CAMPUS-GUEST', 
          paymentMethod
        );
        setIsSubmitting(false);
        onOrderSuccess(order);
      } catch (err: any) {
        setIsSubmitting(false);
        setErrorMessage(err.message || 'Failed to place order. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* 1. Stepper matching Reference Screen 6 */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
          <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>1. Cart</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-sky-300" />
        <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
          <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
            2
          </div>
          <span>2. Details</span>
        </div>
        <div className="w-8 sm:w-12 h-0.5 bg-slate-200" />
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500">
            3
          </div>
          <span>3. Confirm</span>
        </div>
      </div>

      <button
        onClick={onBackToCart}
        className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Cart</span>
      </button>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        
        {/* 2. Pickup Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Pickup Identification Details</span>
          </h2>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
              Name / Roll Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Chaitanya"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Needed only for counter pickup identification when calling your order number.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
              Roll / College ID
            </label>
            <input
              type="text"
              placeholder="e.g. CS23B104"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>

        {/* 3. Payment Method Card matching Reference Screen 6 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Payment Method</h2>

          <div className="space-y-3">
            {/* Pay at Counter (Recommended) */}
            <label
              onClick={() => setPaymentMethod('pay_at_counter')}
              className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'pay_at_counter'
                  ? 'bg-sky-50 border-sky-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'pay_at_counter'}
                  onChange={() => setPaymentMethod('pay_at_counter')}
                  className="mt-1 accent-sky-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Pay at Counter</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay via cash, card or UPI when you collect your order.
                  </p>
                </div>
              </div>
              <CreditCard className="w-5 h-5 text-sky-600 shrink-0 mt-1" />
            </label>

            {/* UPI (Optional) */}
            <label
              onClick={() => setPaymentMethod('upi')}
              className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-sky-50 border-sky-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-1 accent-sky-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-900 text-sm">UPI (Optional)</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan dynamic QR code at the counter pickup screen.
                  </p>
                </div>
              </div>
              <QrCode className="w-5 h-5 text-sky-600 shrink-0 mt-1" />
            </label>
          </div>
        </div>

        {/* 4. Order Summary Card matching Reference Screen 6 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="flex justify-between text-sm text-slate-600">
            <span>Items ({cartItemCount}):</span>
            <span className="font-bold text-slate-900">₹{cartTotal}</span>
          </div>

          <div className="flex justify-between text-sm text-slate-600 items-center">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Estimated Wait Time:
            </span>
            <span className="font-bold text-sky-700">
              {cartWaitEstimate.minMinutes} – {cartWaitEstimate.maxMinutes} mins
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-lg font-bold text-slate-900">
            <span>Total Amount:</span>
            <span className="text-2xl font-serif-luxury text-sky-700">
              ₹{cartTotal}
            </span>
          </div>
        </div>

        {/* 5. Terms Agreement Checkbox matching Reference Screen 6 */}
        <div className="flex items-start gap-3 p-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            className="mt-0.5 accent-sky-600 w-4 h-4 cursor-pointer rounded"
          />
          <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer select-none">
            I agree to the café ordering terms and understand wait times may vary slightly during rush hour.
          </label>
        </div>

        {/* 6. Place Order Button */}
        <button
          type="submit"
          disabled={isSubmitting || !termsAgreed}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all ${
            isSubmitting || !termsAgreed
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25 active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Placing Order...</span>
            </div>
          ) : (
            <span>Place Order • ₹{cartTotal}</span>
          )}
        </button>

      </form>

    </div>
  );
};
