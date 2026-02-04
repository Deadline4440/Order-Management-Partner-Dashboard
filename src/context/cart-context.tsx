'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { products as allProducts, type Product } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartScheme = {
    title: string;
    description: string;
    discount: number;
}

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  appliedSchemes: CartScheme[];
  total: number;
  totalWeightKg: number; // total weight of items in cart (kg)
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type ToastInfo = {
  type: 'add' | 'remove' | 'error';
  productName?: string;
  message?: string;
};


export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);

  useEffect(() => {
    if (toastInfo) {
      switch (toastInfo.type) {
        case 'add':
          toast({ title: `Added to cart`, description: `${toastInfo.productName} has been added.` });
          break;
        case 'remove':
          toast({ title: `Removed from cart`, variant: 'destructive' });
          break;
        case 'error':
          toast({ title: "Error", description: toastInfo.message, variant: 'destructive' });
          break;
      }
      setToastInfo(null); 
    }
  }, [toastInfo, toast]);


  const addToCart = (productId: string, quantity: number = 1) => {
    const productToAdd = allProducts.find(p => p.id === productId);
    if (!productToAdd) {
        setToastInfo({ type: 'error', message: 'Product not found.' });
        return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product: productToAdd, quantity }];
      }
    });
    setToastInfo({ type: 'add', productName: productToAdd.name });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
        const itemToRemove = prevCart.find(item => item.product.id === productId);
        if (itemToRemove) {
            setToastInfo({ type: 'remove', productName: itemToRemove.product.name });
        }
        return prevCart.filter(item => item.product.id !== productId)
    });
  };

  const updateQuantity = (productId:string, quantity:number) => {
      if(quantity <= 0) {
          removeFromCart(productId);
          return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
  }

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0),[cart]);
  
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const totalWeightKg = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = item.product as any;
      if (p.soldBy === 'bag' && typeof p.bagWeightKg === 'number') {
        return sum + p.bagWeightKg * item.quantity;
      }
      const w = typeof p.weightKg === 'number' ? p.weightKg : 0;
      return sum + w * item.quantity;
    }, 0);
  }, [cart]);

  const { appliedSchemes, total } = useMemo(() => {
    const newAppliedSchemes: CartScheme[] = [];
    let discount = 0;

    // Bulk Purchase Offer: 5% instant discount on orders above ₹20,000.
    if (subtotal > 20000) {
      const schemeDiscount = subtotal * 0.05;
      discount += schemeDiscount;
      newAppliedSchemes.push({
        title: "Bulk Purchase Offer",
        description: "5% off on orders > ₹20,000",
        discount: schemeDiscount,
      });
    }

    // Monsoon Bonanza: 10% extra on all detergent purchases above ₹5,000.
    const detergentTotal = cart
      .filter(item => item.product.name.toLowerCase().includes('detergent'))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (detergentTotal > 5000) {
      const schemeDiscount = detergentTotal * 0.10;
      discount += schemeDiscount;
       newAppliedSchemes.push({
        title: "Monsoon Bonanza",
        description: "10% off on detergents > ₹5,000",
        discount: schemeDiscount,
      });
    }

    // New Product Launch: Buy 10 units of Multi-Surface Cleaner and get 1 free.
    const multiSurfaceCleaner = cart.find(item => item.product.sku === 'DYL-MUL-400');
    if (multiSurfaceCleaner && multiSurfaceCleaner.quantity >= 10) {
        const freeUnits = Math.floor(multiSurfaceCleaner.quantity / 10);
        const schemeDiscount = freeUnits * multiSurfaceCleaner.product.price;
        discount += schemeDiscount;
        newAppliedSchemes.push({
            title: "New Product Launch",
            description: `Get ${freeUnits} Multi-Surface Cleaner free`,
            discount: schemeDiscount
        });
    }

    return { appliedSchemes: newAppliedSchemes, total: subtotal - discount };
  }, [subtotal, cart]);


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal, appliedSchemes, total, totalWeightKg }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
