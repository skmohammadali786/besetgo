
"use client";

import type { CartItem } from "@/lib/types";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, writeBatch, deleteDoc, getDocs } from "firebase/firestore";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { quantity?: number }) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: (silent?: boolean) => Promise<void>;
  subtotal: number;
  itemCount: number;
  isLoaded: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (user) {
      setIsLoaded(false);
      const collRef = collection(db, "users", user.uid, "cart");
      unsubscribe = onSnapshot(collRef, (snapshot) => {
        const cartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
        setItems(cartItems);
        setIsLoaded(true);
      });
    } else {
      // Clear cart for logged-out users
      setItems([]);
      setIsLoaded(true);
    }
    return () => unsubscribe();
  }, [user]);

  const addItem = useCallback(async (item: Omit<CartItem, "quantity" | "id"> & { quantity?: number }) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to add items to your cart.", variant: "destructive" });
      return;
    }
    
    // Unique ID for a cart item is productId + size
    const cartItemId = `${item.productId}-${item.size}`;

    const docRef = doc(db, "users", user.uid, "cart", cartItemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingItem = docSnap.data() as CartItem;
      await setDoc(docRef, { ...existingItem, quantity: existingItem.quantity + (item.quantity || 1) }, { merge: true });
    } else {
      const newCartItem = {
        ...item,
        quantity: item.quantity || 1,
      }
      await setDoc(docRef, newCartItem);
    }
  }, [user, toast]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "cart", itemId);
    await deleteDoc(docRef);
  }, [user]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) return;
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }
    const docRef = doc(db, "users", user.uid, "cart", itemId);
    await setDoc(docRef, { quantity }, { merge: true });
  }, [user, removeItem]);

  const clearCart = useCallback(async (silent = false) => {
    if (!user) return;
    const collRef = collection(db, "users", user.uid, "cart");
    const querySnapshot = await getDocs(collRef);
    const batch = writeBatch(db);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    if (!silent) {
        toast({
          title: "Cart cleared",
          description: "Your cart is now empty.",
        });
    }
  }, [user, toast]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    isLoaded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
