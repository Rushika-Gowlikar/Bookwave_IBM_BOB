import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export function BookCard({ book, size = 'md' }) {
  const { state, dispatch } = useStore();
  const inWishlist = state.wishlist.includes(book.id);
  const inCart = state.cart.some(i => i.bookId === book.id);

  function addToCart(e) {
    e.preventDefault();
    dispatch({ type: 'ADD_TO_CART', payload: { bookId: book.id } });
  }

  function toggleWishlist(e) {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: book.id });
  }

  const isSmall = size === 'sm';

  const discountPercent = Math.round((1 - book.price / book.originalPrice) * 100);

  return (
    <Link to={`/book/${book.id}`} className="group block h-full">
      <div className="book-card bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/10 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
        {/* Book Jacket Cover */}
        <div
          className={`book-cover relative ${isSmall ? 'h-36' : 'h-52'} flex flex-col justify-between p-3 select-none`}
          style={{
            background: `linear-gradient(145deg, ${book.coverColor || '#4f46e5'}, ${book.coverAccent || '#312e81'})`
          }}
        >
          {/* Top badges bar */}
          <div className="relative z-10 flex items-start justify-between w-full">
            {book.tag ? (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-md flex items-center gap-1 ${
                book.tag === 'Bestseller'
                  ? 'bg-amber-500/90 text-white'
                  : book.tag === 'New Launch'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-indigo-600/90 text-white'
              }`}>
                {book.tag === 'Bestseller' && '⭐'}
                {book.tag === 'New Launch' && '✨'}
                {book.tag === 'Recommended' && '🔥'}
                <span>{book.tag}</span>
              </span>
            ) : <span />}

            <button
              onClick={toggleWishlist}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-transform active:scale-90 shadow-sm"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={inWishlist ? '#f43f5e' : 'none'}
                stroke={inWishlist ? '#f43f5e' : 'white'}
                strokeWidth="2.2"
                className="transition-colors"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Center Book Title & Category - ALWAYS HIGH CONTRAST & READABLE */}
          <div className="relative z-10 text-center px-2 py-1 my-auto">
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-amber-200/90 mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {book.category}
            </div>
            <div
              className={`font-black text-white leading-tight drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] line-clamp-2 ${
                isSmall ? 'text-xs' : 'text-sm md:text-base'
              }`}
              style={{ letterSpacing: '-0.02em' }}
            >
              {book.title}
            </div>
            {!isSmall && (
              <div className="text-[11px] font-medium text-amber-100/90 mt-1 italic drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] line-clamp-1">
                by {book.author}
              </div>
            )}
          </div>

          {/* Bottom ornamental bar */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-semibold text-white/70 px-1">
            <span className="uppercase tracking-wider">{book.format}</span>
            <span className="opacity-80">BookWave</span>
          </div>
        </div>

        {/* Info Area below cover */}
        <div className="p-3.5 flex flex-col flex-1 justify-between bg-dark-card">
          <div>
            {!isSmall && (
              <div className="flex items-center justify-between text-[11px] text-mutedtext mb-1">
                <span className="font-medium">{book.format}</span>
                <span className="truncate max-w-[110px]" title={book.brand}>
                  {book.brand?.split(' ')[0]}
                </span>
              </div>
            )}

            <h3
              className={`font-bold text-ink leading-snug line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors ${
                isSmall ? 'text-xs' : 'text-sm'
              }`}
              title={book.title}
            >
              {book.title}
            </h3>

            <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mb-1.5 truncate">
              By {book.author}
            </p>

            {/* Rating */}
            {!isSmall && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg
                      key={s}
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill={s <= Math.round(book.rating) ? 'currentColor' : '#cbd5e1'}
                      className="dark:fill-slate-600"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-ink">{book.rating}</span>
                <span className="text-[10px] text-mutedtext">({book.ratingCount || 120})</span>
              </div>
            )}
          </div>

          <div>
            {/* Price section */}
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`font-extrabold text-ink ${isSmall ? 'text-sm' : 'text-base'}`}>
                ₹{book.price}
              </span>
              {book.originalPrice > book.price && (
                <>
                  <span className="text-[11px] text-mutedtext line-through">
                    ₹{book.originalPrice}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>

            {!isSmall && (
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>🚚</span>
                <span>Delivery by {book.deliveryDate}</span>
              </div>
            )}

            {!isSmall && (
              <button
                onClick={addToCart}
                className={`mt-2.5 w-full text-xs py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  inCart
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white hover:shadow-brand-500/25'
                }`}
              >
                {inCart ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StarRating({ rating, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => interactive && onRate && onRate(s)}
          className={interactive ? 'cursor-pointer transform hover:scale-125 transition-transform' : 'cursor-default'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={s <= rating ? '#f59e0b' : '#cbd5e1'}
            className="transition-colors"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}
