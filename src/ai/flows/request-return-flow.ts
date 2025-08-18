
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
import { db, auth } from '@/lib/firebase';
import { ReturnRequestInputSchema, type ReturnRequestInput } from '@/lib/types';


export async function requestReturn(input: ReturnRequestInput): Promise<{ success: boolean; error?: string }> {
  return requestReturnFlow.run(input, { auth });
}

const requestReturnFlow = ai.defineFlow(
  {
    name: 'requestReturnFlow',
    inputSchema: ReturnRequestInputSchema,
    outputSchema: z.object({ success: z.boolean(), error: z.string().optional() }),
    auth: {
      required: true,
    }
  },
  async (input, { auth }) => {
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
);
