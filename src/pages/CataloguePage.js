import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { BOOKS, CATEGORIES, BRANDS } from '../data/books';

const FORMATS = ['All Formats', 'Paperback', 'Hardcover', 'eBook'];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹200', min: 0, max: 200 },
  { label: '₹200 – ₹400', min: 200, max: 400 },
  { label: '₹400 – ₹600', min: 400, max: 600 },
  { label: 'Above ₹600', min: 600, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating: High to Low' },
];

const COLLECTIONS = [
  { id: 'all', label: 'All Books', icon: '📚' },
  { id: 'recommended', label: 'Recommended', icon: '🔥' },
  { id: 'bestseller', label: 'Bestsellers', icon: '⭐' },
  { id: 'new', label: 'New Launches', icon: '✨' },
];

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';
  const initFilter = searchParams.get('filter') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [selectedCollection, setSelectedCollection] = useState(initFilter);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: BOOKS.length };
    CATEGORIES.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = BOOKS.filter(b => b.category.toLowerCase() === cat.toLowerCase()).length;
      }
    });
    return counts;
  }, []);

  // Collection counts
  const collectionCounts = useMemo(() => {
    return {
      all: BOOKS.length,
      recommended: BOOKS.filter(b => b.featured || b.tag === 'Recommended').length,
      bestseller: BOOKS.filter(b => b.isBestseller || b.tag === 'Bestseller').length,
      new: BOOKS.filter(b => b.isNew || b.tag === 'New Launch').length,
    };
  }, []);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedCollection !== 'all' ||
    selectedBrand !== 'All' ||
    selectedFormat !== 'All Formats' ||
    selectedPriceIdx !== 0 ||
    sortBy !== 'relevance' ||
    search.trim() !== '';

  function handleResetFilters() {
    setSelectedCategory('All');
    setSelectedCollection('all');
    setSelectedBrand('All');
    setSelectedFormat('All Formats');
    setSelectedPriceIdx(0);
    setSortBy('relevance');
    setSearch('');
    setSearchParams({});
  }

  const filtered = useMemo(() => {
    let list = [...BOOKS];

    // Collection filter (New Launches, Bestsellers, Recommended)
    if (selectedCollection === 'bestseller') {
      list = list.filter(b => b.isBestseller || b.tag === 'Bestseller');
    } else if (selectedCollection === 'new') {
      list = list.filter(b => b.isNew || b.tag === 'New Launch');
    } else if (selectedCollection === 'recommended') {
      list = list.filter(b => b.featured || b.tag === 'Recommended');
    }

    if (selectedCategory !== 'All') {
      list = list.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedBrand !== 'All') {
      list = list.filter(b => b.brand === selectedBrand);
    }

    if (selectedFormat !== 'All Formats') {
      list = list.filter(b => b.format === selectedFormat);
    }

    const pr = PRICE_RANGES[selectedPriceIdx];
    list = list.filter(b => b.price >= pr.min && b.price <= pr.max);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, selectedCollection, selectedBrand, selectedFormat, selectedPriceIdx, sortBy, search]);

  return (
    <div className="min-h-screen bg-dark-bg pt-16 flex flex-col md:flex-row transition-colors duration-200">
      {/* Desktop Category Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        } hidden md:block flex-shrink-0 bg-dark-surface border-r border-dark-border transition-all duration-300 select-none`}
      >
        <div className="p-4 space-y-4 w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between pb-2 border-b border-dark-border">
            <span className="text-xs font-extrabold text-ink uppercase tracking-wider">
              Browse Categories
            </span>
            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
              {BOOKS.length} Books
            </span>
          </div>

          <div className="space-y-1">
            {CATEGORIES.map(cat => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center justify-between font-semibold ${
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-subtext hover:text-brand-600 dark:hover:text-brand-400 hover:bg-dark-hover'
                  }`}
                >
                  <span className="truncate mr-2">{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      active ? 'bg-white/25 text-white' : 'bg-dark-card border border-dark-border text-mutedtext'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Mobile Category Modal / Drawer */}
      {mobileCategoryOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start animate-fade-in">
          <div className="w-4/5 max-w-xs bg-dark-surface h-full p-4 overflow-y-auto border-r border-dark-border shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-sm font-bold text-ink">Select Category</span>
              <button
                onClick={() => setMobileCategoryOpen(false)}
                className="w-8 h-8 rounded-lg bg-dark-card text-ink flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {CATEGORIES.map(cat => {
                const active = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileCategoryOpen(false);
                    }}
                    className={`w-full text-left text-xs px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between font-semibold ${
                      active
                        ? 'bg-brand-600 text-white font-bold'
                        : 'text-subtext hover:bg-dark-hover'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-75">({categoryCounts[cat] || 0})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Sticky Filter & Search Toolbar */}
        <div className="sticky top-16 z-30 bg-dark-surface border-b border-dark-border px-4 sm:px-6 py-3.5 space-y-3 shadow-md">
          {/* Row 1: Sidebar Toggle, Search Input, Mobile Category Picker, Results Count */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Desktop toggle sidebar button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Hide Categories Sidebar" : "Show Categories Sidebar"}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl border border-dark-border bg-dark-card text-ink hover:border-brand-500/50 hover:bg-dark-hover transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Mobile category picker button */}
            <button
              onClick={() => setMobileCategoryOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-sm"
            >
              <span>📂</span>
              <span>{selectedCategory === 'All' ? 'Categories' : selectedCategory}</span>
            </button>

            {/* Search Input Field */}
            <div className="relative flex-1 min-w-[200px]">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedtext"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, author, genre, publisher..."
                className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-8 py-2 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mutedtext hover:text-ink text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Count & Reset button */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-bold text-ink whitespace-nowrap bg-dark-card border border-dark-border px-3 py-1.5 rounded-xl shadow-sm">
                {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline bg-red-500/10 px-2.5 py-1.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Collection Pills (All Books, Recommended, Bestsellers, New Launches) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            <span className="text-[11px] font-extrabold text-mutedtext uppercase tracking-wider whitespace-nowrap mr-1">
              Collection:
            </span>
            {COLLECTIONS.map(col => {
              const active = selectedCollection === col.id;
              const count = collectionCounts[col.id] || 0;
              return (
                <button
                  key={col.id}
                  onClick={() => {
                    setSelectedCollection(col.id);
                    setSearchParams(col.id === 'all' ? {} : { filter: col.id });
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-sm border ${
                    active
                      ? 'bg-brand-600 border-brand-600 text-white shadow-brand-500/25 scale-[1.02]'
                      : 'bg-dark-card border-dark-border text-subtext hover:border-brand-500/50 hover:bg-dark-hover'
                  }`}
                >
                  <span>{col.icon}</span>
                  <span>{col.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      active ? 'bg-white/25 text-white' : 'bg-dark-bg text-mutedtext'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 3: Dropdown filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* Format Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-mutedtext uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>📖 Format</span>
              </label>
              <select
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className="bg-dark-card border border-dark-border text-xs text-ink font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm transition-colors"
              >
                {FORMATS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Publisher Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-mutedtext uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>🏢 Publisher</span>
              </label>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="bg-dark-card border border-dark-border text-xs text-ink font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm transition-colors"
              >
                <option value="All">All Publishers</option>
                {BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-mutedtext uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>🏷️ Price Range</span>
              </label>
              <select
                value={selectedPriceIdx}
                onChange={e => setSelectedPriceIdx(Number(e.target.value))}
                className="bg-dark-card border border-dark-border text-xs text-ink font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm transition-colors"
              >
                {PRICE_RANGES.map((pr, idx) => (
                  <option key={pr.label} value={idx}>{pr.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-mutedtext uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>⚡ Sort By</span>
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-dark-card border border-dark-border text-xs text-ink font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm transition-colors"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clean Breadcrumb & Active Filter Badges */}
        <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-dark-border/60 bg-dark-bg">
          <div className="flex items-center gap-2 font-medium text-mutedtext">
            <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">Home</Link>
            <span>/</span>
            <span className="text-ink font-bold">Catalogue</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-brand-600 dark:text-brand-400 font-bold">{selectedCategory}</span>
              </>
            )}
            {selectedCollection !== 'all' && (
              <>
                <span>/</span>
                <span className="text-brand-600 dark:text-brand-400 font-bold capitalize">
                  {selectedCollection === 'bestseller' ? 'Bestsellers' : selectedCollection === 'new' ? 'New Launches' : 'Recommended'}
                </span>
              </>
            )}
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedCollection !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                Collection: {selectedCollection === 'bestseller' ? 'Bestsellers' : selectedCollection === 'new' ? 'New Launches' : 'Recommended'}
                <button onClick={() => setSelectedCollection('all')} className="hover:text-red-500 ml-0.5">✕</button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-red-500 ml-0.5">✕</button>
              </span>
            )}
            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                Publisher: {selectedBrand}
                <button onClick={() => setSelectedBrand('All')} className="hover:text-red-500 ml-0.5">✕</button>
              </span>
            )}
            {selectedFormat !== 'All Formats' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                Format: {selectedFormat}
                <button onClick={() => setSelectedFormat('All Formats')} className="hover:text-red-500 ml-0.5">✕</button>
              </span>
            )}
            {selectedPriceIdx !== 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                Price: {PRICE_RANGES[selectedPriceIdx].label}
                <button onClick={() => setSelectedPriceIdx(0)} className="hover:text-red-500 ml-0.5">✕</button>
              </span>
            )}
          </div>
        </div>

        {/* Book Grid */}
        <div className="px-4 sm:px-6 py-6 pb-20 space-y-10">
          {/* Main Book Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-ink uppercase tracking-wide flex items-center gap-2">
                  <span>
                    {selectedCollection === 'bestseller'
                      ? '⭐ Bestsellers Collection'
                      : selectedCollection === 'new'
                      ? '✨ New Launches'
                      : selectedCollection === 'recommended'
                      ? '🔥 Recommended For You'
                      : selectedCategory !== 'All'
                      ? `${selectedCategory} Books`
                      : 'All Books Collection'}
                  </span>
                </h2>
                <p className="text-xs text-mutedtext mt-0.5">
                  Showing {filtered.length} {filtered.length === 1 ? 'book' : 'books'} matching your selection
                </p>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-dark-card border border-dashed border-dark-border rounded-2xl max-w-md mx-auto my-6 p-8">
                <div className="text-5xl mb-3 animate-float">📚</div>
                <h3 className="text-base font-bold text-ink mb-1">No books found</h3>
                <p className="text-xs text-mutedtext mb-4">
                  We couldn't find any books matching your selected filters or search terms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map(b => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
