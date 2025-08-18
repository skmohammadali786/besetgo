
'use server';
/**
 * @fileOverview A flow to handle contact form submissions.
 *
 * - handleContact - Saves contact form data to Firestore.
 * - ContactFormInput - The input type for the handleContact function.
 */

import { ai } from '@/ai/genkit';
import { ContactFormInputSchema, type ContactFormInput } from '@/lib/types';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


export async function handleContact(input: ContactFormInput): Promise<{ success: boolean }> {
  return handleContactFlow(input);
}

const handleContactFlow = ai.defineFlow(
  {
    name: 'handleContactFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    try {
      await addDoc(collection(db, 'contacts'), {
        ...input,
        submittedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to save contact form submission:', error);
      return { success: false };
    }
  }
);
