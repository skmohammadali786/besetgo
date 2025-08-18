
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { requestReturn } from "@/ai/flows/request-return-flow";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ReturnExchangePage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !orderId) return;

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const reason = formData.get('reason') as string;
        const comments = formData.get('comments') as string;

        try {
            const result = await requestReturn({ orderId, reason, comments });
            if (result.success) {
                toast({
                    title: "Request Submitted",
                    description: `Your return request for order ${orderId} has been received.`,
                });
                router.push("/account?tab=orders");
            } else {
                throw new Error(result.error || "Flow returned success: false");
            }
        } catch (error) {
            console.error("Return request failed:", error);
            toast({
                title: "Request Failed",
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!orderId) {
        return (
            <div className="container mx-auto py-12 md:py-20 text-center">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Invalid Request</h1>
                <p className="text-lg text-muted-foreground mt-4">No order ID provided. Please go back to your account and try again.</p>
                <Button asChild className="mt-6">
                    <Link href="/account?tab=orders">Go to My Orders</Link>
                </Button>
            </div>
        )
    }

  return (
    <div className="container mx-auto py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Return or Exchange</CardTitle>
                    <CardDescription>
                        Request a return or an exchange for items in order: <strong>{orderId}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                         <div className="space-y-2">
                            <Label htmlFor="reason" className="text-base font-semibold">Reason for Return/Exchange</Label>
                            <Textarea id="reason" name="reason" placeholder="e.g., Size issue, defective product, etc." required rows={4}/>
                        </div>
                        
                         <div className="space-y-2">
                            <Label htmlFor="comments" className="text-base font-semibold">Additional Comments (Optional)</Label>
                            <Textarea id="comments" name="comments" placeholder="Any other details you'd like to share." rows={4}/>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                            Our team will review your request and get back to you within 2 business days with further instructions. Please refer to our <a href="/returns" className="text-primary underline">Return & Refund Policy</a> for more details.
                        </p>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Submit Request
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
