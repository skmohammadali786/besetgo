'use server';
/**
 * @fileOverview A flow to handle return requests for an order.
 *
 * - requestReturn - Updates an order to include a return request.
 * - ReturnRequestInput - The input type for the requestReturn function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReturnRequestInputSchema, type ReturnRequestInput } from '@/lib/types';

// ✅ Fix: merge auth into input instead of passing separately
export async function requestReturn(
  input: ReturnRequestInput & { auth: { uid: string } }
): Promise<{ success: boolean; error?: string }> {
  const result = await requestReturnFlow.run({ ...input }); 
  return result.output ?? { success: false, error: "Unknown error" };
}

const requestReturnFlow = ai.defineFlow(
  {
    name: 'requestReturnFlow',
    inputSchema: ReturnRequestInputSchema.extend({
      auth: z.object({
        uid: z.string(),
      }),
    }),
    outputSchema: z.object({ success: z.boolean(), error: z.string().optional() }),
    auth: {
      required: true,
    }
  },
  async (input) => {
    if (!input.auth) {
      return { success: false, error: 'User not authenticated.' };
    }

    const orderRef = doc(db, 'orders', input.orderId);

    try {
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        return { success: false, error: 'Order not found.' };
      }

      const orderData = orderSnap.data();
      if (orderData.userId !== input.auth.uid) {
        return { success: false, error: 'User is not authorized to modify this order.' };
      }

      await updateDoc(orderRef, {
        status: "Return Requested",
        returnRequest: {
          reason: input.reason,
          comments: input.comments || "",
          requestDate: serverTimestamp(),
          status: "Pending",
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to process return request:', error);
      return { success: false, error: 'Failed to update order in the database.' };
    }
  }
);66666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
