
'use server';
/**
 * @fileOverview A flow to handle newsletter subscriptions.
 *
 * - handleNewsletterSubscription - Saves subscriber's email to Firestore.
 * - NewsletterSubscriptionInput - The input type for the handleNewsletterSubscription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsletterSubscriptionInputSchema, type NewsletterSubscriptionInput } from '@/lib/types';

export async function handleNewsletterSubscription(input: NewsletterSubscriptionInput): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await handleNewsletterSubscriptionFlow(input);
    return { success: true, ...result };
  } catch (error: any) {
    console.error('Flow failed', error.stack);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

const handleNewsletterSubscriptionFlow = ai.defineFlow(
  {
    name: 'handleNewsletterSubscriptionFlow',
    inputSchema: NewsletterSubscriptionInputSchema,
    outputSchema: z.object({ success: z.boolean(), error: z.string().optional() }),
  },
  async (input) => {
    
    const subscriptionsRef = collection(db, 'newsletter_subscriptions');
    
    // Check if the email is already subscribed
    const q = query(subscriptionsRef, where("email", "==", input.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // This is a user-facing error, not a system error, so we throw to stop execution and inform the client.
      throw new Error('This email is already subscribed.');
    }

    // This can still fail due to Firestore rules, network issues, etc.
    // Genkit will catch these errors and reject the promise, which our wrapper handles.
    await addDoc(subscriptionsRef, {
      email: input.email,
      subscribedAt: new Date(),
    });

    return { success: true };
  }
);
