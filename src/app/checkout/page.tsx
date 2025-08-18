
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { CreditCard, Lock, Loader2, PlusCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import type { Order, Address } from "@/lib/types";
import { useState, useEffect } from "react";
import { useAddress } from "@/hooks/use-address";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addOrder } from "@/lib/firestore";

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, itemCount, subtotal, isLoaded: cartIsLoaded, clearCart } = useCart();
    const router = useRouter();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const { addresses, addAddress, isLoaded: addressesLoaded } = useAddress();
    const { toast } = useToast();

    const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
    const [newAddress, setNewAddress] = useState({ name: '', address: '', city: '', state: '', zip: '', phone: '' });
    
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const codCharge = 30;
    
    useEffect(() => {
        if (addressesLoaded && addresses.length > 0) {
            const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
            setSelectedAddressId(defaultAddress.id.toString());
        }
    }, [addresses, addressesLoaded]);


    if (!cartIsLoaded || !addressesLoaded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }
    
    const shippingCost = subtotal > 5000 ? 0 : 500;
    const finalCodCharge = paymentMethod === 'cod' ? codCharge : 0;
    const totalCost = subtotal + shippingCost + finalCodCharge;

    const handlePlaceOrder = async () => {
        if (!user) {
            toast({ title: "Please sign in", description: "You need to be signed in to place an order.", variant: "destructive" });
            return;
        }

        let shippingAddress: Address | undefined = addresses.find(a => a.id === selectedAddressId);

        if (selectedAddressId === 'new') {
            const { name, address, city, state, zip, phone } = newAddress;
            if (!name || !address || !city || !state || !zip || !phone) {
                toast({
                    title: "Missing Address Information",
                    description: "Please fill out all fields for the new address.",
                    variant: "destructive"
                });
                return;
            }
             const newAddr: Omit<Address, 'id' | 'isDefault'> = {
                type: "Shipping",
                name: name,
                phone: phone,
                address: `${address}, ${city}, ${state}, ${zip}`,
            };
            const newId = await addAddress(newAddr, true);
            shippingAddress = { ...newAddr, id: newId, isDefault: true };
        }

        if (!shippingAddress) {
            toast({ title: "No shipping address", description: "Please select or add a shipping address.", variant: "destructive" });
            return;
        }

        setIsPlacingOrder(true);
        
        const newOrder: Omit<Order, 'id' | 'date'> = {
            userId: user.uid,
            status: paymentMethod === 'cod' ? "Processing" : "Payment Pending, we will contact you soon about payment confirmation",
            total: totalCost,
            shippingAddress,
            paymentMethod,
            items: items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                size: item.size,
            }))
        };

        try {
            const orderId = await addOrder(newOrder);
            await clearCart(true); 
            router.push(`/thank-you?orderId=${orderId}`);
        } catch (error) {
            console.error("Failed to place order:", error);
            toast({ title: "Order Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
            setIsPlacingOrder(false);
        }
    }

    if (isPlacingOrder) {
        return (
             <div className="flex flex-col justify-center items-center h-[60vh] text-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h1 className="font-headline text-3xl font-bold">Placing Your Order...</h1>
                <p className="text-muted-foreground">Please wait while we confirm your purchase.</p>
            </div>
        )
    }


    return (
        <div className="container mx-auto py-8 md:py-12">
            <h1 className="font-headline text-4xl font-bold mb-8 text-center">Checkout</h1>
            {items.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">Your cart is empty. Please add items to proceed to checkout.</p>
                     <Button asChild className="mt-4">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4">
                                    {addresses.map(address => (
                                        <Label key={address.id} htmlFor={`addr-${address.id}`} className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer has-[:checked]:bg-secondary has-[:checked]:border-primary">
                                            <RadioGroupItem value={address.id.toString()} id={`addr-${address.id}`} className="mt-1" />
                                            <div>
                                                <p className="font-semibold">{address.name} <span className="text-xs text-muted-foreground">({address.type})</span></p>
                                                <p className="text-sm text-muted-foreground">{address.phone}</p>
                                                <p className="text-sm text-muted-foreground">{address.address}</p>
                                            </div>
                                        </Label>
                                    ))}
                                    <Label htmlFor="addr-new" className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer has-[:checked]:bg-secondary has-[:checked]:border-primary">
                                         <RadioGroupItem value="new" id="addr-new" className="mt-1" />
                                         <div>
                                            <p className="font-semibold flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add a New Address</p>
                                            <p className="text-sm text-muted-foreground">Select this option to enter a new shipping address.</p>
                                         </div>
                                    </Label>
                                </RadioGroup>
                                {selectedAddressId === 'new' && (
                                   <div className="mt-6 space-y-4 pt-6 border-t">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} placeholder="Riya Sharma" required />
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input id="phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} type="tel" placeholder="+91 98765 43210" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea id="address" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} placeholder="123 Fashion Avenue" required/>
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input id="city" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="Jaipur" required/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input id="state" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} placeholder="Rajasthan" required/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="zip">PIN Code</Label>
                                                <Input id="zip" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} placeholder="302001" required/>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                                    <Label htmlFor="cod" className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-secondary has-[:checked]:border-primary">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <div className="flex-1 cursor-pointer">
                                            <p>Cash on Delivery</p>
                                            <p className="text-xs text-muted-foreground">+₹{codCharge} handling fee</p>
                                        </div>
                                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                                    </Label>
                                    <Label htmlFor="customer_care" className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-secondary has-[:checked]:border-primary">
                                        <RadioGroupItem value="customer_care" id="customer_care" />
                                        <div className="flex-1 cursor-pointer">
                                            <p>Pay after Order (via Customer Care)</p>
                                            <p className="text-xs text-muted-foreground">No extra charges. We'll contact you to confirm.</p>
                                        </div>
                                        <Phone className="h-6 w-6 text-muted-foreground" />
                                    </Label>
                            </RadioGroup>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <Image src={item.image} alt={item.name} width={64} height={80} className="rounded-md object-cover" data-ai-hint="fashion product" />
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{shippingCost > 0 ? `₹${shippingCost.toLocaleString()}` : "Free"}</span>
                                    </div>
                                     {paymentMethod === 'cod' && (
                                        <div className="flex justify-between">
                                            <span>COD Charge</span>
                                            <span>₹{codCharge.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{totalCost.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                                    Place Order
                                </Button>
                                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                                    <Lock className="h-3 w-3" /> Secure Checkout
                                </p>
                            </CardContent>
                        </Card>
                        <div className="text-center">
                            <Button variant="link" asChild>
                                <Link href="/cart">Back to Cart</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
