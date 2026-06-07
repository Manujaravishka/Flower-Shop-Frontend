import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '@/lib/api';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  colour: string;
  size: string;
  category: string[];
  imageUrl?: string;
  isCustom?: boolean;
  customPrompt?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadLocalCart(): CartItem[] {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]): void {
  localStorage.setItem('cart', JSON.stringify(items));
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(loadLocalCart);

  // Sync from backend when user authenticates
  useEffect(() => {
    if (!isAuthenticated) return;
    const local = loadLocalCart();
    if (local.length > 0) {
      // Local cart exists; push to backend, then fetch merged result
      const syncCart = async () => {
        try {
          for (const item of local) {
            await cartApi.add({ productId: item._id, quantity: item.quantity }).catch(() => {});
          }
          const serverCart = await cartApi.get().catch(() => null);
          if (serverCart && Array.isArray(serverCart)) {
            setItems(serverCart);
          }
          localStorage.removeItem('cart');
        } catch {
          // Fallback to local
        }
      };
      syncCart();
    } else {
      // Fetch server cart
      cartApi.get().then((serverCart) => {
        if (serverCart && Array.isArray(serverCart)) {
          setItems(serverCart);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  // Persist to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(items);
    }
  }, [items, isAuthenticated]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === item._id && !item.isCustom);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
