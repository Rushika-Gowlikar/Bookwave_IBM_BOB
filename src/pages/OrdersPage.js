import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import BookCover from '../components/BookCover';

const STATUS_COLORS = {
  Delivered: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
  Confirmed: 'text-blue-700 dark:text-blue-300 bg-blue-500/15 border-blue-500/30',
  Processing: 'text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30',
  Cancelled: 'text-rose-700 dark:text-rose-300 bg-rose-500/15 border-rose-500/30',
};

export default function OrdersPage() {
  const { state, dispatch } = useStore();

  function buyAgain(items) {
    items.forEach(item => {
      dispatch({ type: 'ADD_TO_CART', payload: { bookId: item.bookId, quantity: item.quantity || 1 } });
    });
  }

  if (state.orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg pt-24 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4 animate-float">📦</div>
        <h2 className="text-2xl font-extrabold text-ink mb-2">No Orders Yet</h2>
        <p className="text-subtext text-sm mb-6 max-w-sm">
          You haven't placed any book orders yet. Start exploring our shelves today!
        </p>
        <Link
          to="/catalogue"
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-all"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-16 transition-colors duration-200">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">My Order History</h1>
            <p className="text-xs text-mutedtext mt-1">{state.orderHistory.length} total orders recorded</p>
          </div>
          <Link
            to="/catalogue"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 px-3.5 py-2 rounded-xl transition-colors"
          >
            + New Order
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {state.orderHistory.map(order => {
          const items = order.items.map(i => ({
            ...i,
            book: state.books.find(b => b.id === i.bookId)
          })).filter(i => i.book);

          return (
            <div
              key={order.orderId}
              className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-sm hover:border-brand-500/40 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-dark-surface/50 border-b border-dark-border text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg">
                    {order.orderId}
                  </span>
                  <span className="text-mutedtext font-medium">{order.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status] || STATUS_COLORS.Confirmed}`}>
                    ● {order.status}
                  </span>
                  <span className="text-base font-black text-ink">₹{order.total}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 space-y-4">
                {items.map(({ book, quantity, price }) => (
                  <div key={book.id} className="flex items-center gap-4">
                    <Link to={`/book/${book.id}`} className="flex-shrink-0">
                      <BookCover book={book} showText={false} className="w-14 shadow-md" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/book/${book.id}`}
                        className="text-sm font-bold text-ink hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate block"
                      >
                        {book.title}
                      </Link>
                      <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">By {book.author}</div>
                      <div className="text-[11px] text-mutedtext mt-0.5">
                        {book.format} · Qty: {quantity} · ₹{price} each
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-ink">₹{price * quantity}</span>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        🚚 {book.deliveryDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="flex items-center justify-between px-6 py-3.5 bg-dark-bg/60 border-t border-dark-border">
                <button
                  onClick={() => buyAgain(order.items)}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  <span>Re-order These Books</span>
                </button>

                {items[0] && (
                  <Link
                    to={`/book/${items[0].book.id}`}
                    className="text-xs font-semibold text-mutedtext hover:text-ink transition-colors"
                  >
                    View Product Details →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
