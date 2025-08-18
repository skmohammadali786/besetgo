
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError, updateProfile, getIdToken } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // User is signed in, create a session cookie
        const idToken = await getIdToken(user);
        await fetch('/api/session/login', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${idToken}` },
        });
      } else {
        // User is signed out, clear the session cookie
        await fetch('/api/session/logout', { method: 'POST' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const signIn = async (email: string, pass: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        const authError = error as AuthError;
        if (authError.code === 'auth/invalid-credential') {
            throw new Error("Invalid email or password. Please try again.");
        }
        throw new Error(authError.message || "Failed to sign in.");
    }
  }

   const signUp = async (email: string, pass: string, name: string) => {
     try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const newUser = userCredential.user;
        if (newUser) {
          await updateProfile(newUser, {
            displayName: name,
          });

          // Create user document in Firestore ONLY if it doesn't already exist.
          const userDocRef = doc(db, 'users', newUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (!docSnap.exists()) {
            const profileData = {
              firstName: name.split(' ')[0] || '',
              lastName: name.split(' ').slice(1).join(' ') || '',
              email: newUser.email,
              phone: ''
            };
            
            // This set operation is now safe because it's only called for brand new users.
            await setDoc(userDocRef, {
              profile: profileData,
              wishlist: [],
              createdAt: serverTimestamp()
            });
          }
        }
    } catch (error) {
        const authError = error as AuthError;
        console.error("Sign-up failed:", authError.code, authError.message);
        if (authError.code === 'auth/email-already-in-use') {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        throw new Error(authError.message || "Failed to sign up.");
    }
  }

  const value = { user, loading, signOut, signIn, signUp };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
