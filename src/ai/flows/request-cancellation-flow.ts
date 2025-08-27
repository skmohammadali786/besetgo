
'use server';
/**
 * @fileOverview A flow to handle cancellation requests for an order.
 *
 * - requestCancellation - Updates an order to include a cancellation request.
 * - CancellationRequestInput - The input type for the requestCancellation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { CancellationRequestInputSchema, type CancellationRequestInput } from '@/lib/types';


export async function requestCancellation(input: CancellationRequestInput): Promise<{ success: boolean; error?: string }> {
  // Note: The Genkit Firebase plugin automatically populates the auth object
  // when a valid Firebase App Check token is passed in the request headers.
  // The client-side logic must ensure this header is sent.
  const result = await requestCancellationFlow(input);
  return result;
}


const requestCancellationFlow = ai.defineFlow(
  {
    name: 'requestCancellationFlow',
    inputSchema: CancellationRequestInputSchema,
    outputSchema: z.object({ success: z.boolean(), error: z.string().optional() }),
    auth: {
      required: true,
    }
  },
  async (input, { auth }) => {
    // The auth object is guaranteed to be present because of the auth policy.
    if (!auth) {
        // This check is redundant due to the auth policy, but good for type safety.
        return { success: false, error: 'User not authenticated.' };
    }

    const orderRef = doc(db, 'orders', input.orderId);
    
    try {
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        return { success: false, error: 'Order not found.' };
      }

      const orderData = orderSnap.data();
      
      // Use auth.uid which corresponds to the Firebase Auth UID.
      if (orderData.userId !== auth.uid) {
        return { success: false, error: 'User is not authorized to modify this order.' };
      }
      
      const cancellableStatuses = ["Processing", "Shipped"];
      if(!cancellableStatuses.includes(orderData.status)) {
        return { success: false, error: 'This order cannot be cancelled at its current stage.' };
      }

      await updateDoc(orderRef, {
        status: "Cancellation Requested",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to process cancellation request:', error);
      return { success: false, error: 'Failed to update order in the database.' };
    }
  }
);
