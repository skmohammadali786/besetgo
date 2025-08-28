'use server';
/**
 * @fileOverview A flow to handle return requests for an order.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReturnRequestInputSchema, type ReturnRequestInput } from '@/lib/types';

const requestReturnFlow = ai.defineFlow(
  {
    name: 'requestReturnFlow',
    inputSchema: ReturnRequestInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      error: z.string().optional(),
    }),
  },
  async (input, { auth }) => {
    //Ensure authentication is present
    if (!auth) {
      return { success: false, error: 'User not authenticated.' };
    }

    const orderRef = doc(db, 'orders', input.orderId);

    try {
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return { success: false, error: 'Order not found.' };
      }

      const orderData = orderSnap.data();
      if (orderData.userId !== auth.uid) {
        return {
          success: false,
          error: 'User is not authorized to modify this order.',
        };
      }

      await updateDoc(orderRef, {
        status: 'Return Requested',
        returnRequest: {
          reason: input.reason,
          comments: input.comments || '',
          requestDate: serverTimestamp(),
          status: 'Pending',
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to process return request:', error);
      return {
        success: false,
        error: 'Failed to update order in the database.',
      };
    }
  }
);

export async function requestReturn(
  input: ReturnRequestInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Genkit flows return the output directly, not wrapped in `.output`
    const result = await requestReturnFlow.run(input);

    if (result) {
      return result; // guaranteed to match { success: boolean; error?: string }
    }

    return { success: false, error: 'No output returned from flow' };
  } catch (err) {
    console.error('Flow execution failed:', err);
    return {
      success: false,
      error: 'Unknown error running return request flow.',
    };
  }
}
