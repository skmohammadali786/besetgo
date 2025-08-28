import { z } from "zod";
import { createFlow } from "ai-workflows";

// Define the output type
type RequestReturnOutput = {
  success: boolean;
  error?: string;
};

// Mock business logic (replace with your real DB/API call)
async function processReturn(
  orderId: string,
  reason: string,
  userId: string
): Promise<RequestReturnOutput> {
  // Example: pretend the return is always successful
  return { success: true };
}

export const requestReturnFlow = createFlow<
  { orderId: string; reason: string }, // Input schema type
  RequestReturnOutput // Output schema type
>(
  {
    id: "request-return-flow",
    inputSchema: z.object({
      orderId: z.string(),
      reason: z.string(),
    }),
  },
  async (input, sideChannel) => {
    const { orderId, reason } = input;
    const auth = (sideChannel as any)?.auth; // Access auth safely

    // Ensure authentication
    if (!auth || !auth.userId) {
      return { success: false, error: "User not authenticated." };
    }

    try {
      // Call your return-processing logic
      const result = await processReturn(orderId, reason, auth.userId);

      // Normalize to always match RequestReturnOutput
      return {
        success: result.success,
        error: result.error,
      };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message ?? "Unknown error",
      };
    }
  }
);
