
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 5000 ? 0 : 500;
  const discountAmount = subtotal * discount;
  const totalCost = subtotal - discountAmount + shippingCost;
  
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
    <div className="container mx-auto py-8 md:py-12">
        <h1 className="font-headline text-4xl font-bold mb-8">Shopping Cart</h1>
        {itemCount > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={125}
                          className="rounded-md object-cover"
                          data-ai-hint="fashion product"
                        />
                        <div className="flex-1 space-y-1">
                          <h2 className="font-semibold text-lg">{item.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size}
                          </p>
                          <p className="text-lg font-bold">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-24 p-6 border rounded-lg space-y-4 bg-secondary">
                        <h2 className="text-xl font-bold">Order Summary</h2>
                         <div className="flex justify-between text-base">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span>Shipping</span>
                          <span>{shippingCost > 0 ? `₹${shippingCost.toLocaleString()}` : "Free"}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-base text-green-600">
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
                            <Button variant="outline" className="bg-background" onClick={handleApplyCoupon}>Apply</Button>
                          </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-xl">
                          <span>Total</span>
                          <span>₹{totalCost.toLocaleString()}</span>
                        </div>
                        <Button size="lg" className="w-full" asChild>
                          <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                         <Button variant="outline" className="w-full bg-background" onClick={clearCart}>
                            Clear Cart
                          </Button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-24 text-center">
                <ShoppingCart className="h-32 w-32 text-muted-foreground/30" strokeWidth={1} />
                <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
                <p className="text-muted-foreground max-w-md">Looks like you haven't added anything to your cart yet. Explore our collections to find something you love.</p>
                <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        )}
    </div>
  )
}
