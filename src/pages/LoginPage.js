import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function LoginPage() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch({
        type: 'LOGIN',
        payload: {
          name: form.name || form.email.split('@')[0],
          email: form.email
        }
      });
      navigate('/');
    }, 700);
  }

  function handleGuest() {
    dispatch({
      type: 'LOGIN',
      payload: { name: 'Guest Reader', email: 'guest@bookwave.com', isGuest: true }
    });
    navigate('/');
  }

  function toggleTheme() {
    dispatch({ type: 'TOGGLE_THEME' });
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-200">
      {/* Theme toggle on login screen */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="w-10 h-10 rounded-2xl border border-dark-border bg-dark-card text-ink hover:border-brand-500/50 hover:bg-dark-hover flex items-center justify-center transition-all shadow-md"
        >
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Decorative gradient blur backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 mb-3 shadow-xl shadow-brand-500/25">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight">BookWave</h1>
          <p className="text-xs text-mutedtext mt-0.5">Your personal online literary sanctuary</p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-ink">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-mutedtext mt-0.5">
              {isRegister
                ? 'Join thousands of passionate book lovers'
                : 'Enter your credentials to access your library'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-mutedtext uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-mutedtext uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="reader@bookwave.com"
                required
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-mutedtext uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-ink placeholder:text-mutedtext focus:outline-none focus:border-brand-500 font-medium transition-colors"
              />
            </div>

            {error && (
              <p className="text-rose-500 text-xs font-bold bg-rose-500/10 p-2.5 rounded-xl text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="31" strokeDashoffset="10"/>
                  </svg>
                  <span>Verifying Account...</span>
                </>
              ) : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-dark-border" />
            <span className="text-[10px] font-bold text-mutedtext uppercase">or</span>
            <div className="flex-1 h-px bg-dark-border" />
          </div>

          <button
            onClick={handleGuest}
            className="w-full border border-dark-border hover:border-brand-500/50 bg-dark-bg hover:bg-dark-hover text-ink font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>👤</span>
            <span>Explore Directly as Guest</span>
          </button>

          <p className="text-center text-xs text-mutedtext pt-1">
            {isRegister ? 'Already registered?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              {isRegister ? 'Sign In' : 'Create Free Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
