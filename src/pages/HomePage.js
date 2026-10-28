import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import BookCover from '../components/BookCover';
import { BookCard } from '../components/BookCard';

export default function HomePage() {
  const { state } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const recommended = state.books.filter(b => b.featured || b.tag === 'Recommended').slice(0, 5);
  const bestsellers = state.books.filter(b => b.isBestseller).slice(0, 5);
  const newLaunches = state.books.filter(b => b.isNew).slice(0, 5);

  // Personalized recommendations
  const orderedCats = state.orderHistory.flatMap(o =>
    o.items.map(i => state.books.find(b => b.id === i.bookId)?.category)
  ).filter(Boolean);
  const uniqueCats = [...new Set(orderedCats)];
  const personalized = uniqueCats.length
    ? state.books.filter(b => uniqueCats.includes(b.category)).slice(0, 5)
    : recommended;

  const filtered = searchQuery.trim()
    ? state.books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-dark-bg pt-16 transition-colors duration-200">
      {/* Hero Banner with Modern Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-900/15 via-dark-surface to-brand-800/10 dark:from-brand-950/70 dark:via-dark-surface dark:to-purple-950/40 border-b border-dark-border px-4 sm:px-6 py-12 md:py-16">
        {/* Decorative blur spots */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 mb-3 border border-brand-500/20">
              ✨ Over 35+ Bestsellers & Classics Available
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-tight tracking-tight mb-3">
              Discover Your Next <br />
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Great Adventure
              </span>
            </h1>
            <p className="text-subtext text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
              Explore our curated library spanning thrillers, timeless literature, science, self-growth, and fantasy. Same-day delivery on select titles.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/catalogue"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Browse All Books</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                to="/catalogue?filter=bestseller"
                className="bg-dark-card border border-dark-border hover:border-brand-500/50 text-ink font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm"
              >
                ⭐ Bestsellers
              </Link>
            </div>
          </div>

          {/* Search box on right */}
          <div className="w-full max-w-md">
            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-xl shadow-brand-900/5 relative">
              <label className="text-xs font-bold text-ink mb-2 block">
                Quick Search Library
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedtext"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, or genres..."
                  className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all font-medium"
                />
              </div>

              {/* Instant Search Dropdown Results */}
              {searchQuery && (
                <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-dark-surface border border-dark-border rounded-2xl shadow-2xl max-h-72 overflow-y-auto p-2 space-y-1">
                  {filtered?.length === 0 ? (
                    <p className="text-xs text-mutedtext p-4 text-center">No matching books found.</p>
                  ) : (
                    filtered?.slice(0, 6).map(b => (
                      <Link
                        key={b.id}
                        to={`/book/${b.id}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-hover transition-colors"
                      >
                        <BookCover book={b} showText={false} className="w-9 flex-shrink-0 shadow-sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-ink truncate">{b.title}</div>
                          <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium truncate">
                            {b.author} · <span className="text-mutedtext">{b.category}</span>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-ink ml-2">₹{b.price}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Recommended for You */}
        <HomeSection
          title="Recommended For You"
          subtitle="Top picks curated for your reading journey"
          link="/catalogue"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {personalized.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </HomeSection>

        {/* Bestsellers This Month */}
        <HomeSection
          title="Bestsellers This Month"
          subtitle="Most loved and trending across all categories"
          link="/catalogue?filter=bestseller"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bestsellers.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </HomeSection>

        {/* New Launches */}
        <HomeSection
          title="New Launches"
          subtitle="Fresh additions just released to our shelves"
          link="/catalogue?filter=new"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newLaunches.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </HomeSection>

        {/* Browse by Category Quick Grid */}
        <HomeSection
          title="Explore Genres"
          subtitle="Find your favorite world or discipline"
          link="/catalogue"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { cat: 'Self-help', emoji: '🧠', desc: 'Mindset & Habits' },
              { cat: 'Mystery', emoji: '🔍', desc: 'Clues & Riddles' },
              { cat: 'Thriller', emoji: '🕵️', desc: 'Edge of Your Seat' },
              { cat: 'Science Fiction', emoji: '🚀', desc: 'Cosmos & AI' },
              { cat: 'Memoir', emoji: '📖', desc: 'Real Lives' },
              { cat: 'Fantasy', emoji: '⚔️', desc: 'Magic & Lore' },
              { cat: 'Psychology', emoji: '💡', desc: 'How We Think' },
              { cat: 'Business', emoji: '📈', desc: 'Money & Startups' },
              { cat: 'Science', emoji: '🔭', desc: 'Universe & Life' },
              { cat: 'Historical Fiction', emoji: '🏛️', desc: 'Past, Retold' },
              { cat: 'Young Adult', emoji: '⚡', desc: 'Teen Favourites' },
              { cat: 'Classic', emoji: '🪶', desc: 'Timeless Reads' },
            ].map(item => (
              <Link
                key={item.cat}
                to={`/catalogue?category=${encodeURIComponent(item.cat)}`}
                className="bg-dark-card border border-dark-border rounded-2xl p-4 text-center hover:border-brand-500/50 hover:shadow-lg transition-all transform hover:-translate-y-1 group flex flex-col items-center justify-center"
              >
                <div className="text-3xl mb-1.5 transform group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <div className="text-xs font-bold text-ink group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {item.cat}
                </div>
                <div className="text-[10px] text-mutedtext mt-0.5">{item.desc}</div>
              </Link>
            ))}
          </div>
        </HomeSection>
      </div>
    </div>
  );
}

function HomeSection({ title, subtitle, link, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between pb-2 border-b border-dark-border">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-mutedtext mt-0.5">{subtitle}</p>}
        </div>
        {link && (
          <Link
            to={link}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
