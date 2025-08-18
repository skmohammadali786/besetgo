
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function CartSheet() {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();

  const shippingCost = subtotal > 5000 ? 0 : 500;
  const discountAmount = subtotal * discount;
  const totalCost = subtotal - discountAmount + shippingCost;
  
  const handleCheckout = () => {
    router.push('/checkout');
  }

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SALE20") {
      setDiscount(0.20); // 20% discount
      toast({
        title: "Coupon Applied",
        description: "Successfully applied 20% discount!"
      });
    } else {
      setDiscount(0);
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive"
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M5 9C5 7.89543 5.89543 7 7 7H17C18.1046 7 19 7.89543 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" />
            <path d="M9 7C9 4.79086 10.7909 3 13 3H11C10.7909 3 9 4.79086 9 7Z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
          <SheetDescription>
            Review your items before checkout.
          </SheetDescription>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="my-4 px-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 py-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={100}
                      className="rounded-md object-cover"
                      data-ai-hint="fashion product"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size}
                      </p>
                      <p className="text-sm font-medium">
                        ₹{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="bg-secondary p-6">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost > 0 ? `₹${shippingCost.toLocaleString()}` : "Free"}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                      <span>Discount (20%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                 <div className="flex items-center space-x-2">
                    <Input 
                      id="coupon" 
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{totalCost.toLocaleString()}</span>
                </div>
                <SheetTrigger asChild>
                    <Button size="lg" className="w-full" onClick={handleCheckout}>
                        Proceed to Checkout
                    </Button>
                </SheetTrigger>
                 <Button variant="outline" className="w-full" onClick={clearCart}>
                    Clear Cart
                  </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <ShoppingCart className="h-24 w-24 text-muted-foreground/30" strokeWidth={1} />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <SheetTrigger asChild>
                <Button variant="outline" asChild>
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
