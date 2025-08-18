"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import React from "react";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto py-12 md:py-20 text-center">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
                <CheckCircle2 className="w-24 h-24 text-green-500" />
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Thank You for Your Order!</h1>
                <p className="text-lg text-muted-foreground">
                    Your order has been placed successfully. A confirmation email has been sent to your registered email address.
                </p>
                {orderId && (
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-base">
                            Your Order ID is: <strong className="font-mono">{orderId}</strong>
                        </p>
                    </div>
                )}
                <div className="flex gap-4 mt-6">
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/account?tab=orders">View Orders</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
