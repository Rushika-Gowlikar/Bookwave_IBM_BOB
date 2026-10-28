import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = state.wishlist.length;
  const isDark = state.theme === 'dark';

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
    setMobileMenuOpen(false);
  }

  function toggleTheme() {
    dispatch({ type: 'TOGGLE_THEME' });
  }

  const navLinks = [
    { name: 'My Books', path: '/' },
    { name: 'Catalogue', path: '/catalogue' },
    { name: 'My Wishlist', path: '/wishlist', badge: wishlistCount },
    { name: 'My Orders', path: '/orders', badge: state.orderHistory.length },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-surface/95 backdrop-blur-md border-b border-dark-border h-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-ink text-base tracking-tight leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                BookWave
              </span>
              <span className="text-[10px] text-mutedtext tracking-wider uppercase font-semibold">
                Online Bookstore
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-subtext hover:text-brand-600 dark:hover:text-brand-400 hover:bg-dark-hover'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge > 0 && (
                    <span className="text-[10px] bg-brand-500/20 text-brand-700 dark:text-brand-300 px-1.5 py-0.2 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 rounded-xl border border-dark-border bg-dark-card text-ink hover:border-brand-500/50 hover:bg-dark-hover flex items-center justify-center transition-all shadow-sm"
          >
            {isDark ? (
              <span className="text-amber-400 text-base transform hover:rotate-45 transition-transform" role="img" aria-label="Sun">
                ☀️
              </span>
            ) : (
              <span className="text-indigo-600 text-base transform hover:-rotate-12 transition-transform" role="img" aria-label="Moon">
                🌙
              </span>
            )}
          </button>

          {/* Gift Points */}
          {state.user && (
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl text-xs text-amber-700 dark:text-amber-300 font-bold shadow-sm">
              <span>🎁</span>
              <span>{state.giftPoints} pts</span>
            </div>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            title="Shopping Cart"
            className="relative w-9 h-9 rounded-xl border border-dark-border bg-dark-card text-ink hover:border-brand-500/50 hover:bg-dark-hover flex items-center justify-center transition-all shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-md animate-pop">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Logout */}
          {state.user ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-dark-border">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {state.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-ink leading-none">
                  {state.user.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-mutedtext hover:text-red-500 dark:hover:text-red-400 font-semibold text-left transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs bg-brand-600 hover:bg-brand-700 text-white font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-9 h-9 rounded-xl border border-dark-border bg-dark-card text-ink hover:bg-dark-hover flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-b border-dark-border px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          {state.user && (
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-sm font-bold text-white">
                  {state.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{state.user.name || 'User'}</div>
                  <div className="text-xs text-mutedtext">{state.user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300">
                <span>🎁</span>
                <span>{state.giftPoints} pts</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-between border ${
                    active
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-dark-card border-dark-border text-ink hover:bg-dark-hover'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-brand-500/20 text-brand-600 dark:text-brand-400'}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {state.user ? (
            <button
              onClick={handleLogout}
              className="w-full text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 py-2.5 rounded-xl transition-colors"
            >
              Logout of BookWave
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-xs font-bold bg-brand-600 text-white py-2.5 rounded-xl"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
