
import { z } from 'zod';

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
  aiHint: string;
  href: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  description: string;
  sizes: string[];
  stock: number;
  aiHint: string;
  isTrending?: boolean;
};

export type CartItem = {
  id: string; 
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  productId: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

export type ReturnRequest = {
    reason: string;
    comments: string;
    requestDate: string | Date; // Firestore Timestamp
    status: 'Pending' | 'Approved' | 'Rejected' | 'Processing';
};

export type Order = {
    id: string;
    userId: string;
    date: any; // Firestore Timestamp
    status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Payment Pending, we will contact you soon about payment confirmation';
    total: number;
    shippingAddress: Address;
    paymentMethod: string;
    items: OrderItem[];
    
    // Optional post-purchase fields
    trackingProvider?: string;
    trackingId?: string;
    returnRequest?: ReturnRequest;
};

export type Address = {
    id: string;
    type: string;
    name: string;
    address: string;
    phone: string;
    isDefault: boolean;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type ReturnExchange = {
    orderId: string;
    item: string;
    requestDate: string;
    type: 'Return' | 'Exchange';
    status: 'Pending Pickup' | 'Shipped' | 'Processing' | 'Completed' | 'Cancelled';
    trackingId: string | null;
};

export type Review = {
    id: string;
    author: string;
    authorImage?: string;
    rating: number;
    date: any; // Firestore Timestamp
    comment: string;
    userId: string;
    reviewImageUrls?: string[];
}

export type Promotion = {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  aiHint: string;
}


// Schemas for Genkit Flows

export const ContactFormInputSchema = z.object({
  name: z.string().describe('The full name of the person submitting the form.'),
  email: z.string().email().describe('The email address of the person.'),
  subject: z.string().describe('The subject of the message.'),
  message: z.string().describe('The content of the message.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

export const NewsletterSubscriptionInputSchema = z.object({
  email: z.string().email().describe('The email address of the person subscribing.'),
});
export type NewsletterSubscriptionInput = z.infer<typeof NewsletterSubscriptionInputSchema>;

export const ReturnRequestInputSchema = z.object({
  orderId: z.string().describe('The ID of the order to return.'),
  reason: z.string().min(10).describe('The reason for the return request.'),
  comments: z.string().optional().describe('Any additional comments from the user.'),
});
export type ReturnRequestInput = z.infer<typeof ReturnRequestInputSchema>;

export const CancellationRequestInputSchema = z.object({
  orderId: z.string().describe('The ID of the order to cancel.'),
});
export type CancellationRequestInput = z.infer<typeof CancellationRequestInputSchema>;
