import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { BOOKS } from '../data/books';
import { BookCard } from '../components/BookCard';

export default function CartPage() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const cartItems = state.cart.map(i => ({
    ...i,
    book: BOOKS.find(b => b.id === i.bookId)
  })).filter(i => i.book);

  const subtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const deliveryCharge = subtotal > 500 ? 0 : 49;
  const total = subtotal + tax + deliveryCharge;

  // Recommendations based on cart items
  const cartCats = [...new Set(cartItems.map(i => i.book.category))];
  const recommendations = BOOKS.filter(b =>
    cartCats.includes(b.category) && !state.cart.some(c => c.bookId === b.id)
  ).slice(0, 4);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg pt-24 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4 animate-float">🛒</div>
        <h2 className="text-2xl font-extrabold text-ink mb-2">Your Cart is Empty</h2>
        <p className="text-subtext text-sm mb-6 max-w-sm">
          Looks like you haven't added any books to your cart yet. Explore our catalogue to find your next great read!
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
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 py-3 text-xs text-mutedtext bg-dark-surface border-b border-dark-border flex gap-2">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 font-medium">Home</Link>
        <span>/</span>
        <span className="text-ink font-bold">Shopping Cart</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-dark-border">
            <h1 className="text-xl font-extrabold text-ink">
              Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </h1>
            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-3">
            {cartItems.map(({ book, quantity, bookId }) => (
              <div
                key={bookId}
                className="bg-dark-card border border-dark-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 shadow-sm hover:border-brand-500/40 transition-colors"
              >
                {/* Mini Book Cover */}
                <Link to={`/book/${book.id}`} className="flex-shrink-0 self-center sm:self-start">
                  <div
                    className="w-20 h-28 rounded-xl flex items-center justify-center p-1.5 text-center shadow-md relative overflow-hidden select-none"
                    style={{ background: `linear-gradient(135deg, ${book.coverColor}, ${book.coverAccent})` }}
                  >
                    <span className="text-white font-black text-[9px] drop-shadow-md line-clamp-3">
                      {book.title}
                    </span>
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/book/${book.id}`}
                        className="text-sm font-bold text-ink hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1"
                      >
                        {book.title}
                      </Link>
                      <span className="text-sm font-black text-ink whitespace-nowrap">
                        ₹{book.price * quantity}
                      </span>
                    </div>

                    <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">By {book.author}</p>
                    <p className="text-[11px] text-mutedtext mt-0.5">
                      {book.format} · <span className="font-medium text-ink">{book.brand}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-dark-border">
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-dark-bg border border-dark-border px-2 py-1 rounded-xl">
                      <button
                        onClick={() => {
                          if (quantity <= 1) dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
                          else dispatch({ type: 'UPDATE_CART_QTY', payload: { bookId, quantity: quantity - 1 } });
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-dark-card text-ink font-bold hover:bg-dark-hover transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-ink w-5 text-center">{quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { bookId, quantity: quantity + 1 } })}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-dark-card text-ink font-bold hover:bg-dark-hover transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>🚚</span>
                      <span>Delivery: {book.deliveryDate}</span>
                    </div>

                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: bookId })}
                      className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations below cart */}
          {recommendations.length > 0 && (
            <div className="mt-8 pt-4">
              <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider mb-3">
                Readers Also Bought
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recommendations.map(b => (
                  <BookCard key={b.id} book={b} size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Column */}
        <div>
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="text-base font-extrabold text-ink uppercase tracking-wider pb-3 border-b border-dark-border">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-subtext">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-ink">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Tax (18% GST)</span>
                <span className="font-bold text-ink">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Shipping</span>
                <span className={`font-bold ${deliveryCharge === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink'}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <div className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg">
                  💡 Add ₹{501 - subtotal} more to qualify for <strong>FREE Delivery</strong>!
                </div>
              )}

              <div className="border-t border-dark-border pt-3 flex justify-between text-base font-extrabold text-ink">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <div className="text-[11px] text-mutedtext text-center flex items-center justify-center gap-1.5 pt-1">
              <span>🔒</span>
              <span>Encrypted & Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
