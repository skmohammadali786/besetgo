
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface WishlistContextType {
  wishlistedItems: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isLoaded: boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

   useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (user) {
      setIsLoaded(false);
      const docRef = doc(db, "users", user.uid);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWishlistedItems(data.wishlist || []);
        } else {
          // If user doc doesn't exist, create it. This can happen for users created before this feature.
           setDoc(docRef, { wishlist: [] }, { merge: true });
           setWishlistedItems([]);
        }
        setIsLoaded(true);
      });
    } else {
      // Clear wishlist for logged-out users
      setWishlistedItems([]);
      setIsLoaded(true);
    }
    return () => unsubscribe();
  }, [user]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ title: "Please sign in", description: "You must be logged in to add to your wishlist.", variant: "destructive" });
        return;
    };
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
        wishlist: arrayUnion(productId)
    }, { merge: true });
    toast({
      title: "Added to Wishlist",
      description: "The item has been added to your wishlist.",
    });
  }, [user, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
     if (!user) return;
     const docRef = doc(db, "users", user.uid);
     await updateDoc(docRef, {
        wishlist: arrayRemove(productId)
    });
    toast({
      title: "Removed from Wishlist",
      description: "The item has been removed from your wishlist.",
    });
  }, [user, toast]);

  const value = {
    wishlistedItems,
    addToWishlist,
    removeFromWishlist,
    isLoaded,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
