import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';

function BooksStatus({ status, error, onRetry }) {
  return (
    <div className="min-h-screen bg-dark-bg pt-24 flex flex-col items-center justify-center text-center p-6">
      {status === 'loading' ? (
        <>
          <div className="text-5xl mb-4 animate-float">📚</div>
          <h2 className="text-lg font-extrabold text-ink">Loading books from the server...</h2>
        </>
      ) : (
        <>
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-extrabold text-ink mb-1">Could not load books</h2>
          <p className="text-xs text-mutedtext mb-1">{error}</p>
          <p className="text-xs text-mutedtext mb-5">Start the API with <code>npm run server</code>, then retry.</p>
          <button
            onClick={onRetry}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { state, reloadBooks } = useStore();
  if (!state.user) return <Navigate to="/login" replace />;
  if (state.booksStatus !== 'ready') {
    return <BooksStatus status={state.booksStatus} error={state.booksError} onRetry={reloadBooks} />;
  }
  return children;
}

function AppRoutes() {
  const { state } = useStore();

  return (
    <>
      {state.user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/catalogue" element={<ProtectedRoute><CataloguePage /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookDetailPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  );
}
