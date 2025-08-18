

import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, serverTimestamp, Timestamp, deleteDoc } from "firebase/firestore";
import type { Product, Category, Promotion, Order, Review } from "./types";

// A helper function to convert Firestore Timestamps to serializable dates
const convertTimestamps = (data: any) => {
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            convertTimestamps(data[key]); // Recurse for nested objects
        }
    }
    return data;
}


export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, "products");
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
}

export async function getProduct(id: string): Promise<Product | null> {
    const productDocRef = doc(db, "products", id);
    const productSnap = await getDoc(productDocRef);

    if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
    } else {
        return null;
    }
}

export async function getCategories(): Promise<Category[]> {
    const categoriesCol = collection(db, "categories");
    const snapshot = await getDocs(categoriesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function getPromotions(): Promise<Promotion[]> {
    const promotionsCol = collection(db, "promotions");
    const snapshot = await getDocs(query(promotionsCol, orderBy("title")));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
}

export async function getOrders(userId: string): Promise<Order[]> {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, where("userId", "==", userId), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    
    // Convert Timestamps to ISO strings for serialization
    const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        const orderData = { id: doc.id, ...data };
        // Firestore Timestamps are not serializable, so we convert them
        if (orderData.date) {
            orderData.date = (orderData.date as Timestamp).toDate();
        }
        if (orderData.returnRequest?.requestDate) {
            orderData.returnRequest.requestDate = (orderData.returnRequest.requestDate as Timestamp).toDate();
        }
        return orderData as Order;
    });

    return orders;
}

export async function addOrder(order: Omit<Order, 'id' | 'date'>): Promise<string> {
    const ordersCol = collection(db, "orders");
    const docRef = await addDoc(ordersCol, {
        ...order,
        date: serverTimestamp() 
    });
    return docRef.id;
}

export async function getReviews(productId: string): Promise<Review[]> {
    const reviewsCol = collection(db, "products", productId, "reviews");
    const q = query(reviewsCol, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
     return snapshot.docs.map(doc => {
        const data = doc.data();
        const reviewData = { id: doc.id, ...data };
        if (reviewData.date) {
            reviewData.date = (reviewData.date as Timestamp).toDate();
        }
        return reviewData as Review;
    });
}

export async function addReview(productId: string, review: Omit<Review, 'id' | 'date'>): Promise<string> {
    const reviewsCol = collection(db, "products", productId, "reviews");
    const docRef = await addDoc(reviewsCol, {
        ...review,
        date: serverTimestamp()
    });
    return docRef.id;
}

export async function deleteReview(productId: string, reviewId: string): Promise<void> {
    const reviewDocRef = doc(db, "products", productId, "reviews", reviewId);
    await deleteDoc(reviewDocRef);
}
