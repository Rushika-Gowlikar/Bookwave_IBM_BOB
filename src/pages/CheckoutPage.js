import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import BookCover from '../components/BookCover';

export default function CheckoutPage() {
  const { state } = useStore();
  const navigate = useNavigate();

  const cartItems = state.cart.map(i => ({
    ...i,
    book: state.books.find(b => b.id === i.bookId)
  })).filter(i => i.book);

  const subtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const deliveryCharge = subtotal > 500 ? 0 : 49;

  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    state: '',
    country: 'India',
    email: state.user?.email || '',
    phone: '+91 '
  });

  const savedAddress = state.addresses[0];
  const pointsDiscount = redeemPoints ? Math.min(state.giftPoints, 100) : 0;
  const couponDiscount = couponApplied ? 50 : 0;
  const finalTotal = Math.max(0, subtotal + tax + deliveryCharge - pointsDiscount - couponDiscount);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === 'BOOKWAVE50' || coupon.trim().toUpperCase() === 'WELCOME') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid code. Try "BOOKWAVE50" or "WELCOME"');
    }
  }

  function handleProceedToPayment() {
    const addr = useSavedAddress ? savedAddress : address;
    navigate('/payment', {
      state: {
        address: addr,
        subtotal,
        tax,
        deliveryCharge,
        giftDiscount: pointsDiscount,
        couponDiscount,
        coupon: couponApplied ? coupon : '',
        total: finalTotal,
      }
    });
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-16 transition-colors duration-200">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 py-3 text-xs text-mutedtext bg-dark-surface border-b border-dark-border flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 font-medium">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-brand-600 dark:hover:text-brand-400 font-medium">Shopping Cart</Link>
        <span>/</span>
        <span className="text-ink font-bold">Checkout</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink mb-1">Secure Checkout</h1>
          <p className="text-xs text-mutedtext">Review your items, address, and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Items & Shipping Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Summary Row */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-ink uppercase tracking-wider">
                Order Items ({cartItems.length})
              </h2>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {cartItems.map(({ book, quantity }) => (
                  <div
                    key={book.id}
                    className="flex-shrink-0 flex items-center gap-3 bg-dark-bg border border-dark-border rounded-2xl p-3 min-w-[220px]"
                  >
                    <BookCover book={book} showText={false} className="w-12 flex-shrink-0 shadow-md" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-ink truncate max-w-[130px]">{book.title}</div>
                      <div className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Qty: {quantity}</div>
                      <div className="text-xs font-extrabold text-ink mt-0.5">₹{book.price * quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-ink uppercase tracking-wider">
                Shipping Address
              </h2>

              {savedAddress && (
                <div className="bg-dark-bg border border-dark-border rounded-2xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useSavedAddress}
                      onChange={e => setUseSavedAddress(e.target.checked)}
                      className="accent-brand-600 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-ink block">
                        Use Default Saved Address ({savedAddress.label})
                      </span>
                      <p className="text-xs text-subtext mt-1 leading-relaxed">
                        <strong>{savedAddress.firstName} {savedAddress.lastName}</strong><br />
                        {savedAddress.address}, {savedAddress.city}, {savedAddress.state} – {savedAddress.zip}<br />
                        Phone: {savedAddress.phone} · Email: {savedAddress.email}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {!useSavedAddress && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <FormField label="First Name" value={address.firstName} onChange={v => setAddress({...address, firstName: v})} placeholder="First Name" />
                  <FormField label="Last Name" value={address.lastName} onChange={v => setAddress({...address, lastName: v})} placeholder="Last Name" />
                  <FormField label="Street Address" value={address.address} onChange={v => setAddress({...address, address: v})} placeholder="House / Flat / Street" span={2} />
                  <FormField label="City" value={address.city} onChange={v => setAddress({...address, city: v})} placeholder="City" />
                  <FormField label="Postal ZIP Code" value={address.zip} onChange={v => setAddress({...address, zip: v})} placeholder="PIN Code" />
                  <FormField label="State" value={address.state} onChange={v => setAddress({...address, state: v})} placeholder="State / Province" />
                  <FormField label="Phone Number" value={address.phone} onChange={v => setAddress({...address, phone: v})} placeholder="+91 98765 43210" />
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Summary & Payment Trigger */}
          <div>
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
              <h2 className="text-base font-extrabold text-ink uppercase tracking-wider pb-2 border-b border-dark-border">
                Payment Summary
              </h2>

              <div className="space-y-2 text-xs text-subtext">
                <div className="flex justify-between">
                  <span>Items Price</span>
                  <span className="font-bold text-ink">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Tax (18%)</span>
                  <span className="font-bold text-ink">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className={`font-bold ${deliveryCharge === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink'}`}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon ({coupon.toUpperCase()})</span>
                    <span>-₹50</span>
                  </div>
                )}

                {redeemPoints && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                    <span>Points Redeemed</span>
                    <span>-₹{pointsDiscount}</span>
                  </div>
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-ink block mb-1">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={e => {
                      setCoupon(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Enter code: BOOKWAVE50"
                    disabled={couponApplied}
                    className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied || !coupon.trim()}
                    className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    {couponApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-rose-500 font-bold mt-1">{couponError}</p>}
                {couponApplied && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">₹50 promo discount applied!</p>}
              </div>

              {/* Redeem Gift Points */}
              <div className="bg-dark-bg border border-dark-border p-3 rounded-2xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={redeemPoints}
                      onChange={e => setRedeemPoints(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-ink">Redeem Points</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                    🎁 {state.giftPoints} pts
                  </span>
                </label>
              </div>

              <div className="border-t border-dark-border pt-3 flex justify-between text-lg font-black text-ink">
                <span>Final Payable</span>
                <span>₹{finalTotal}</span>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, span = 1 }) {
  return (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <label className="block text-[11px] font-bold text-mutedtext uppercase tracking-wider mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium transition-colors"
      />
    </div>
  );
}
