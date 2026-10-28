import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { BookCard } from '../components/BookCard';

export default function WishlistPage() {
  const { state } = useStore();
  const wishlistBooks = state.wishlist.map(id => state.books.find(b => b.id === id)).filter(Boolean);

  if (wishlistBooks.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg pt-24 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4 animate-float">❤️</div>
        <h2 className="text-2xl font-extrabold text-ink mb-2">Your Wishlist is Empty</h2>
        <p className="text-subtext text-sm mb-6 max-w-sm">
          Save books you love by tapping the heart icon on any book card to review and buy them later.
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
      <div className="bg-dark-surface border-b border-dark-border px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">My Wishlist</h1>
            <p className="text-xs text-mutedtext mt-1">{wishlistBooks.length} saved titles ready for your shelf</p>
          </div>
          <Link
            to="/catalogue"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 px-3.5 py-2 rounded-xl transition-colors"
          >
            + Add More Books
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistBooks.map(b => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
