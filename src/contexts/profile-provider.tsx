
"use client";

import type { UserProfile } from "@/lib/types";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

interface ProfileContextType {
  profile: UserProfile | null;
  updateProfile: (updatedProfile: UserProfile) => Promise<void>;
  isLoaded: boolean;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoaded(false);
      const docRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            // Ensure profile data exists before setting it
            if (data && data.profile) {
                setProfile(data.profile);
            } else {
                // Profile doesn't exist yet, this can happen for new users.
                // It will be created on sign-up. For existing users,
                // we'll wait for it.
                setProfile(null); 
            }
        } else {
           // User document doesn't exist at all.
           setProfile(null);
        }
        setIsLoaded(true);
      });
      return () => unsubscribe();
    } else {
      setProfile(null);
      setIsLoaded(true);
    }
  }, [user]);

  const updateProfile = useCallback(async (updatedProfile: UserProfile) => {
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, "users", user.uid);
    // Use merge: true to avoid overwriting the entire document
    await setDoc(docRef, { profile: updatedProfile }, { merge: true });
  }, [user]);
  
  const value = {
    profile,
    updateProfile,
    isLoaded
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
