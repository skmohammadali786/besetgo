
"use client";

import type { Address } from "@/lib/types";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, onSnapshot, addDoc } from "firebase/firestore";

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>, silent?: boolean) => Promise<string>;
  removeAddress: (addressId: string) => Promise<void>;
  updateAddress: (addressId: string, updatedAddress: Omit<Address, 'id'>) => Promise<void>;
  setAsDefault: (addressId: string) => Promise<void>;
  isLoaded: boolean;
}

export const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoaded(false);
      const collRef = collection(db, "users", user.uid, "addresses");
      const unsubscribe = onSnapshot(collRef, (snapshot) => {
        const loadedAddresses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
        setAddresses(loadedAddresses);
        setIsLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setAddresses([]);
      setIsLoaded(true);
    }
  }, [user]);

  const addAddress = useCallback(async (address: Omit<Address, 'id' | 'isDefault'>) => {
    if (!user) throw new Error("User not authenticated");
    const collRef = collection(db, "users", user.uid, "addresses");
    const docRef = await addDoc(collRef, { ...address, isDefault: addresses.length === 0 });
    return docRef.id;
  }, [user, addresses.length]);

  const removeAddress = useCallback(async (addressId: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "addresses", addressId);
    await writeBatch(db).delete(docRef).commit();
  }, [user]);

  const updateAddress = useCallback(async (addressId: string, updatedAddress: Omit<Address, 'id'>) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "addresses", addressId);
    await writeBatch(db).update(docRef, updatedAddress).commit();
  }, [user]);

  const setAsDefault = useCallback(async (addressId: string) => {
    if (!user) return;
    const collRef = collection(db, "users", user.uid, "addresses");
    const batch = writeBatch(db);
    
    addresses.forEach(addr => {
        if (addr.id !== addressId && addr.isDefault) {
            batch.update(doc(collRef, addr.id), { isDefault: false });
        }
    });

    batch.update(doc(collRef, addressId), { isDefault: true });

    await batch.commit();
  }, [user, addresses]);
  

  const value = {
    addresses,
    addAddress,
    removeAddress,
    updateAddress,
    setAsDefault,
    isLoaded,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}
