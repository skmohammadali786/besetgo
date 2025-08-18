
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Twitter, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { handleNewsletterSubscription } from "@/ai/flows/newsletter-flow";


function FooterComponent() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscription = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      try {
        const result = await handleNewsletterSubscription({ email });
        if (result.success) {
          toast({
            title: "Subscribed successfully!",
            description: `Thank you for subscribing with ${email}.`,
          });
          setEmail("");
        } else {
           throw new Error(result.error || "Failed to subscribe.");
        }
      } catch(error) {
         toast({
            title: "Subscription failed",
            description: error instanceof Error ? error.message : "Could not subscribe. Please try again.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  }, [email, toast]);


  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
                <h3 className="font-headline text-2xl font-bold">SHILPIK.</h3>
                <p className="text-sm max-w-sm">
                    Elegant ethnic fashion that blends tradition with contemporary style. Handcrafted with love.
                </p>
                 <div className="flex items-center space-x-4 pt-2">
                    <Link href="#"><Instagram className="h-6 w-6 hover:text-primary" /></Link>
                    <Link href="#"><Facebook className="h-6 w-6 hover:text-primary" /></Link>
                    <Link href="#"><Twitter className="h-6 w-6 hover:text-primary" /></Link>
                </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-semibold mb-4">Shop</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
                        <li><Link href="/latest-arrivals" className="hover:text-primary">Latest Arrivals</Link></li>
                        <li><Link href="/trending" className="hover:text-primary">Trending</Link></li>
                        <li><Link href="/sale" className="hover:text-primary">Sale</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">About</h4>
                     <ul className="space-y-3 text-sm">
                        <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                        <li><Link href="/sustainability" className="hover:text-primary">Sustainability</Link></li>
                        <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/account" className="hover:text-primary">My Account</Link></li>
                        <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                        <li><Link href="/size-guide" className="hover:text-primary">Size Guide</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        <li><Link href="/returns" className="hover:text-primary">Returns Policy</Link></li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div>
                    <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
                    <p className="text-sm mb-4">Be the first to know about new collections and exclusive offers.</p>
                 </div>
                 <form className="flex w-full max-w-md items-center space-x-2" onSubmit={handleSubscription}>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-background"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Subscribe
                    </Button>
                </form>
            </div>
        </div>
      </div>
      <div className="bg-background/50">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SHILPIK.. All Rights Reserved. </p>
        </div>
      </div>
    </footer>
  );
}

export const Footer = React.memo(FooterComponent);
