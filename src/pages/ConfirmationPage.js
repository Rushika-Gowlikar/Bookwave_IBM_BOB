import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import BookCover from '../components/BookCover';

export default function ConfirmationPage() {
  const { state } = useStore();
  const navigate = useNavigate();
  const order = state.currentOrder;

  const purchasedItems = order
    ? order.items.map(i => ({ ...i, book: state.books.find(b => b.id === i.bookId) })).filter(i => i.book)
    : [];

  return (
    <div className="min-h-screen bg-dark-bg pt-16 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl space-y-6">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 bg-emerald-500/15 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto animate-scale-up shadow-lg shadow-emerald-500/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed!
          </span>
          <h1 className="text-2xl font-extrabold text-ink mt-2 mb-1">Thank You for Your Order</h1>
          <p className="text-xs text-subtext">
            Your reading treasures are being carefully packed and will be delivered soon!
          </p>
        </div>

        {/* Purchased Books Preview */}
        {purchasedItems.length > 0 && (
          <div className="bg-dark-bg border border-dark-border rounded-2xl p-4 text-left space-y-3">
            <span className="text-[11px] font-bold text-mutedtext uppercase tracking-wider block">
              Purchased Titles
            </span>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {purchasedItems.map(({ book, price, quantity }) => (
                <div key={book.id} className="flex items-center gap-3">
                  <BookCover book={book} showText={false} className="w-10 flex-shrink-0 shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-ink truncate">{book.title}</div>
                    <div className="text-[10px] text-mutedtext">By {book.author} · Qty: {quantity}</div>
                  </div>
                  <span className="text-xs font-extrabold text-ink">₹{price * quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Metadata */}
        {order && (
          <div className="grid grid-cols-2 gap-3 text-left bg-dark-bg border border-dark-border p-3.5 rounded-2xl text-xs">
            <div>
              <span className="text-[10px] font-bold text-mutedtext uppercase block">Order ID</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{order.orderId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-mutedtext uppercase block">Payment Method</span>
              <span className="font-bold text-ink">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-mutedtext uppercase block">Order Date</span>
              <span className="font-medium text-ink">{order.date}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-mutedtext uppercase block">Total Paid</span>
              <span className="font-black text-ink">₹{order.total}</span>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => navigate('/catalogue')}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <Link
            to="/orders"
            className="block text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline pt-1"
          >
            View All Orders in Order History →
          </Link>
        </div>
      </div>
    </div>
  );
}
