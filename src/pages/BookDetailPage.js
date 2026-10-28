import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import BookCover from '../components/BookCover';
import { BOOKS } from '../data/books';
import { StarRating } from '../components/BookCard';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const book = BOOKS.find(b => b.id === parseInt(id));

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState(book?.reviews || []);

  if (!book) {
    return (
      <div className="min-h-screen bg-dark-bg pt-24 flex flex-col items-center justify-center text-center p-6">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-ink mb-2">Book Not Found</h2>
        <p className="text-sm text-mutedtext mb-6">The book you are looking for does not exist or has been moved.</p>
        <Link to="/catalogue" className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const related = book.relatedIds?.map(rid => BOOKS.find(b => b.id === rid)).filter(Boolean) || [];
  const inCart = state.cart.some(i => i.bookId === book.id);
  const inWishlist = state.wishlist.includes(book.id);
  const discountPercent = Math.round((1 - book.price / book.originalPrice) * 100);

  function addToCart() {
    dispatch({ type: 'ADD_TO_CART', payload: { bookId: book.id } });
  }

  function buyNow() {
    dispatch({ type: 'ADD_TO_CART', payload: { bookId: book.id } });
    navigate('/cart');
  }

  function toggleWishlist() {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: book.id });
  }

  function submitReview(e) {
    e.preventDefault();
    if (!reviewText.trim() || reviewRating === 0) return;
    setReviews(prev => [
      ...prev,
      {
        name: state.user?.name || 'Reader',
        rating: reviewRating,
        text: reviewText.trim(),
      }
    ]);
    setReviewText('');
    setReviewRating(0);
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-16 transition-colors duration-200">
      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-mutedtext bg-dark-surface border-b border-dark-border overflow-x-auto">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 whitespace-nowrap">Home</Link>
        <span>/</span>
        <Link to="/catalogue" className="hover:text-brand-600 dark:hover:text-brand-400 whitespace-nowrap">Catalogue</Link>
        <span>/</span>
        <Link to={`/catalogue?category=${encodeURIComponent(book.category)}`} className="hover:text-brand-600 dark:hover:text-brand-400 whitespace-nowrap">
          {book.category}
        </Link>
        <span>/</span>
        <span className="text-ink font-bold truncate max-w-xs">{book.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Book Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 bg-dark-card border border-dark-border p-6 rounded-3xl shadow-sm">
            {/* Book Cover Jacket with 3D spine & readable title */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <BookCover book={book} className="w-48 sm:w-56 shadow-2xl" />
            </div>

            {/* Book Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-md">
                    {book.category}
                  </span>
                  <span className="text-xs text-mutedtext font-medium">
                    Published by <strong className="text-ink">{book.brand}</strong>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight mb-1.5">
                  {book.title}
                </h1>
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-3">
                  Author: <span className="underline cursor-pointer hover:opacity-80">{book.author}</span>
                </p>

                {/* Rating & Sold count */}
                <div className="flex items-center gap-2 mb-4 bg-dark-bg p-2.5 rounded-xl border border-dark-border w-fit">
                  <StarRating rating={book.rating} />
                  <span className="text-xs font-bold text-ink">{book.rating}</span>
                  <span className="text-xs text-mutedtext">({book.ratingCount || 120} ratings)</span>
                  <span className="text-xs text-mutedtext">·</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{book.soldCount}</span>
                </div>

                <p className="text-subtext text-xs sm:text-sm leading-relaxed mb-4">
                  {book.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-ink">₹{book.price}</span>
                  {book.originalPrice > book.price && (
                    <>
                      <span className="text-sm text-mutedtext line-through">₹{book.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-5 flex items-center gap-1">
                  <span>🚚</span>
                  <span>Guaranteed Delivery: {book.deliveryDate} ({book.tentativeDelivery})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-dark-border">
                <button
                  onClick={addToCart}
                  className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    inCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/25'
                  }`}
                >
                  {inCart ? '✓ In Your Cart' : '🛒 Add to Cart'}
                </button>

                <button
                  onClick={buyNow}
                  className="flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm"
                >
                  ⚡ Buy Now
                </button>

                <button
                  onClick={toggleWishlist}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${
                    inWishlist
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : 'border-dark-border bg-dark-card hover:border-brand-500/50 text-subtext'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* About Author Section */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✍️ About the Author</span>
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-md">
                {book.author[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink mb-1">{book.author}</h4>
                <p className="text-xs text-subtext leading-relaxed">{book.authorBio}</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Form */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider flex items-center gap-2">
                <span>💬 Reader Reviews</span>
              </h3>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Leave a Review Form */}
            <form onSubmit={submitReview} className="bg-dark-bg border border-dark-border p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Rate this Book:</span>
                <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value.slice(0, 200))}
                placeholder="Share your thoughts about this book (up to 200 characters)..."
                rows={3}
                className="w-full bg-dark-card border border-dark-border rounded-xl p-3 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 resize-none font-medium"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-mutedtext">{reviewText.length}/200 characters</span>
                <button
                  type="submit"
                  disabled={!reviewText.trim() || reviewRating === 0}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>

            {/* Review List */}
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="bg-dark-surface border border-dark-border p-4 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">{r.name}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-xs text-subtext leading-relaxed">{r.text}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-xs text-mutedtext text-center py-4">No reviews yet. Be the first reader to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Related Reads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-dark-border">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">
              Related Reads
            </h3>
            <Link to="/catalogue" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
              More →
            </Link>
          </div>

          <div className="space-y-3">
            {related.map(b => (
              <Link
                key={b.id}
                to={`/book/${b.id}`}
                className="flex gap-3 bg-dark-card border border-dark-border rounded-2xl p-3 hover:border-brand-500/50 hover:shadow-md transition-all group"
              >
                <BookCover book={b} showText={false} className="w-16 flex-shrink-0 shadow-md" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-ink truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium truncate">By {b.author}</p>
                    <p className="text-[10px] text-mutedtext">{b.category} · {b.format}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-extrabold text-ink">₹{b.price}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      🚚 {b.deliveryDate}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
