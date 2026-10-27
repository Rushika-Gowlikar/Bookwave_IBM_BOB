import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { BOOKS, ADDRESSES, ORDER_HISTORY } from '../data/books';

const StoreContext = createContext(null);

const savedTheme = localStorage.getItem('bookwave_theme') || 'light';

const initialState = {
  theme: savedTheme,
  user: null,
  books: BOOKS,
  cart: [],
  wishlist: [],
  orderHistory: ORDER_HISTORY,
  addresses: ADDRESSES,
  giftPoints: 250,
  currentOrder: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('bookwave_theme', newTheme);
      return { ...state, theme: newTheme };
    }
    case 'SET_THEME': {
      localStorage.setItem('bookwave_theme', action.payload);
      return { ...state, theme: action.payload };
    }

    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, cart: [], wishlist: [] };

    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.bookId === action.payload.bookId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.bookId === action.payload.bookId
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { bookId: action.payload.bookId, quantity: action.payload.quantity || 1 }]
      };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.bookId !== action.payload) };

    case 'UPDATE_CART_QTY':
      return {
        ...state,
        cart: state.cart.map(i =>
          i.bookId === action.payload.bookId ? { ...i, quantity: action.payload.quantity } : i
        )
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'TOGGLE_WISHLIST': {
      const inWishlist = state.wishlist.includes(action.payload);
      return {
        ...state,
        wishlist: inWishlist
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload]
      };
    }

    case 'PLACE_ORDER': {
      const newOrder = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Confirmed',
        total: action.payload.total,
        items: state.cart.map(i => ({ bookId: i.bookId, quantity: i.quantity, price: BOOKS.find(b => b.id === i.bookId)?.price || 0 })),
        address: action.payload.address,
        paymentMethod: action.payload.paymentMethod,
      };
      return {
        ...state,
        currentOrder: newOrder,
        orderHistory: [newOrder, ...state.orderHistory],
        cart: [],
      };
    }

    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, { ...action.payload, id: Date.now() }] };

    case 'REDEEM_POINTS': {
      const discount = Math.min(state.giftPoints, action.payload);
      return { ...state, giftPoints: state.giftPoints - discount };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
