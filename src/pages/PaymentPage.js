import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const PAYMENT_METHODS = [
  { id: 'Credit Card', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, MasterCard, RuPay' },
  { id: 'UPI', name: 'Instant UPI Payment', icon: '⚡', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'Net Banking', name: 'Net Banking', icon: '🏦', desc: 'HDFC, ICICI, SBI, Axis' },
  { id: 'Wallet', name: 'BookWave Wallet', icon: '🎁', desc: 'Use Store Credits' },
  { id: 'COD', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const orderDetails = location.state || {};

  const [method, setMethod] = useState('Credit Card');
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState(state.user?.name || '');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const cartItems = state.cart.map(i => ({
    ...i,
    book: state.books.find(b => b.id === i.bookId)
  })).filter(i => i.book);

  const payable = orderDetails.total ?? cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);

  function handlePay(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({
        type: 'PLACE_ORDER',
        payload: {
          total: payable,
          address: orderDetails.address,
          paymentMethod: method
        }
      });
      navigate('/confirmation');
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-16 transition-colors duration-200">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 py-3 text-xs text-mutedtext bg-dark-surface border-b border-dark-border flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 font-medium">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-brand-600 dark:hover:text-brand-400 font-medium">Cart</Link>
        <span>/</span>
        <Link to="/checkout" className="hover:text-brand-600 dark:hover:text-brand-400 font-medium">Checkout</Link>
        <span>/</span>
        <span className="text-ink font-bold">Payment</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-ink mb-1">Select Payment Method</h1>
          <p className="text-xs text-mutedtext">All transactions are encrypted with 256-bit security</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Payable Total Header */}
          <div className="flex items-center justify-between p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-mutedtext block">Total Amount to Pay</span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-400">₹{payable}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                🔒 Verified Merchant
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-ink uppercase tracking-wider block">
              Payment Options
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAYMENT_METHODS.map(m => {
                const active = method === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      active
                        ? 'border-brand-600 bg-brand-500/10 shadow-sm'
                        : 'border-dark-border bg-dark-bg hover:border-brand-500/40 hover:bg-dark-hover'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-ink">{m.name}</div>
                      <div className="text-[10px] text-mutedtext truncate">{m.desc}</div>
                    </div>
                    <div className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-brand-600 bg-brand-600' : 'border-dark-border'}`}>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Payment Fields */}
          <form onSubmit={handlePay} className="pt-2 space-y-4 border-t border-dark-border">
            {method === 'Credit Card' && (
              <div className="space-y-3 bg-dark-bg border border-dark-border p-4 rounded-2xl">
                <div>
                  <label className="block text-[11px] font-bold text-mutedtext uppercase mb-1">Card Number</label>
                  <input
                    value={cardNum}
                    onChange={e => setCardNum(e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim())}
                    placeholder="4532 •••• •••• 8892"
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-mono font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-mutedtext uppercase mb-1">Name on Card</label>
                    <input
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="Cardholder Name"
                      required
                      className="w-full bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-mutedtext uppercase mb-1">Expiry (MM/YY)</label>
                    <input
                      value={expiry}
                      onChange={e => setExpiry(e.target.value.slice(0, 5))}
                      placeholder="12/28"
                      required
                      className="w-full bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-mutedtext uppercase mb-1">CVV Security Code</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.slice(0, 4))}
                    placeholder="•••"
                    required
                    className="w-28 bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-mono font-medium"
                  />
                </div>
              </div>
            )}

            {method === 'UPI' && (
              <div className="bg-dark-bg border border-dark-border p-4 rounded-2xl space-y-2">
                <label className="block text-[11px] font-bold text-mutedtext uppercase">Virtual UPI ID / VPA</label>
                <input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank or mobile@upi"
                  required
                  className="w-full bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium"
                />
                <p className="text-[10px] text-mutedtext">Enter your UPI ID to receive a payment request on your UPI app.</p>
              </div>
            )}

            {method === 'Wallet' && (
              <div className="bg-dark-bg border border-dark-border p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-ink">BookWave Wallet Balance</div>
                  <div className="text-[11px] text-mutedtext">Available Gift Credits</div>
                </div>
                <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                  ₹{state.giftPoints * 2}
                </div>
              </div>
            )}

            {method === 'COD' && (
              <div className="bg-dark-bg border border-dark-border p-4 rounded-2xl text-xs text-subtext leading-relaxed">
                💵 You can pay with cash or QR scan directly to the delivery partner when your package arrives at your doorstep.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="31" strokeDashoffset="10"/>
                  </svg>
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{payable} Now</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
