'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('ai-cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Unable to load cart', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('ai-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Unable to save cart', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((current) => current.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCartItems((current) =>
      current.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
