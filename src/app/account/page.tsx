
"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Home, Loader2, PlusCircle, Trash2, Truck, RefreshCw, AlertCircle, Clock } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Order, Address, Product, UserProfile } from "@/lib/types";
import { useAddress } from "@/hooks/use-address";
import { getProducts, getOrders } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/use-profile";


export default function AccountPage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { wishlistedItems, removeFromWishlist } = useWishlist();
    const { addItem } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addresses, addAddress, removeAddress, updateAddress, setAsDefault } = useAddress();
    const { profile: initialProfile, updateProfile, isLoaded: profileLoaded } = useProfile();
    
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    
    const initialNewAddress: Omit<Address, 'id' | 'isDefault'> = { type: '', name: '', address: '', phone: '' };
    const [newAddress, setNewAddress] = useState(initialNewAddress);

    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/sign-in');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if(initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoadingOrders(true);
        try {
            const userOrders = await getOrders(user.uid);
            setOrders(userOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast({ title: "Error", description: "Could not fetch your orders.", variant: "destructive" });
        } finally {
            setLoadingOrders(false);
        }
    }, [user, toast]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setAllProducts(products);
        }
        fetchProducts();
        if(user) {
          fetchOrders();
        }
    }, [fetchOrders, user]);

    useEffect(() => {
        if(allProducts.length > 0) {
            setWishlistedProducts(allProducts.filter(p => wishlistedItems.includes(p.id)));
        }
    }, [wishlistedItems, allProducts]);

    const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (profile) {
            setProfile({ ...profile, [e.target.id]: e.target.value });
        }
    }, [profile]);

    const handleSaveChanges = useCallback(async () => {
        if (profile) {
            await updateProfile(profile);
            toast({
                title: "Profile Updated",
                description: "Your personal information has been successfully updated."
            })
        }
    }, [profile, updateProfile, toast]);
    
    const handleMoveToCart = useCallback((product: Product) => {
      const defaultSize = product.sizes[0];
      if (defaultSize) {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size: defaultSize,
        });
        removeFromWishlist(product.id);
        toast({
          title: "Moved to Cart",
          description: `${product.name} has been moved to your cart.`
        });
      }
    }, [addItem, removeFromWishlist, toast]);
    
    const handleWhatsAppRedirect = useCallback((message: string) => {
        const whatsappNumber = "919332309632";
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }, []);
    
    const handleSetDefault = useCallback((addressId: string) => {
        setAsDefault(addressId);
        toast({
            title: "Default Address Updated",
            description: "Your default shipping address has been changed."
        });
    }, [setAsDefault, toast]);
    
    const handleEditAddress = useCallback((address: Address) => {
        setEditingAddress({ ...address });
    }, []);

    const handleAddressFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingAddress) {
            setEditingAddress({ ...editingAddress, [e.target.id]: e.target.value });
        }
    }, [editingAddress]);

    const handleNewAddressFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddress({ ...newAddress, [e.target.id]: e.target.value });
    }, [newAddress]);
    
    const handleUpdateAddress = useCallback(() => {
        if (editingAddress) {
            updateAddress(editingAddress.id, editingAddress);
            toast({
                title: "Address Updated",
                description: "Your address has been successfully updated."
            });
            setEditingAddress(null);
        }
    }, [editingAddress, updateAddress, toast]);

    const handleAddNewAddress = useCallback(async () => {
        if (newAddress.name && newAddress.address && newAddress.type && newAddress.phone) {
            await addAddress(newAddress);
            toast({
                title: "Address Added",
                description: "Your new address has been successfully saved."
            });
            setNewAddress(initialNewAddress);
            setIsAddingAddress(false);
        } else {
             toast({
                title: "Missing Information",
                description: "Please fill out all fields to add a new address.",
                variant: "destructive"
            });
        }
    }, [addAddress, newAddress, toast, initialNewAddress]);

    const defaultTab = searchParams.get('tab') || "profile";

    if (authLoading || !user) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      );
    }


  return (
    <>
    <div className="container mx-auto py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">My Account</h1>
      </div>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
             {!profileLoaded ? (
                 <CardContent>
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </CardContent>
             ) : profile && (
            <>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={profile.firstName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={profile.lastName} onChange={handleProfileChange} />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} readOnly disabled />
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={profile.phone} onChange={handleProfileChange} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
            </>
            )}
          </Card>
        </TabsContent>
         <TabsContent value="addresses" className="mt-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your shipping addresses.</CardDescription>
                    </div>
                     <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                        <DialogTrigger asChild>
                             <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Add New Address</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Address</DialogTitle>
                                 <DialogDescription>
                                    Enter the details for your new shipping address.
                                </DialogDescription>
                            </DialogHeader>
                             <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Address Type</Label>
                                    <Input id="type" value={newAddress.type} onChange={handleNewAddressFormChange} placeholder="e.g. Home, Work" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={newAddress.name} onChange={handleNewAddressFormChange} placeholder="Full Name" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" value={newAddress.phone} onChange={handleNewAddressFormChange} type="tel" placeholder="+91 98765 43210" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" value={newAddress.address} onChange={handleNewAddressFormChange} placeholder="Full Address" required/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={() => setNewAddress(initialNewAddress)}>Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleAddNewAddress}>Add Address</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <Card key={address.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4 pb-4">
                                <Home className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <p className="font-semibold">{address.type} {address.isDefault && <span className="text-xs text-muted-foreground">(Default)</span>}</p>
                                    <p className="text-sm font-medium">{address.name}</p>
                                     <p className="text-sm text-muted-foreground">{address.phone}</p>
                                    <p className="text-sm text-muted-foreground">{address.address}</p>
                                </div>
                            </CardHeader>
                             <CardFooter className="mt-auto pt-4 flex flex-wrap gap-2">
                                 <Dialog open={!!editingAddress && editingAddress.id === address.id} onOpenChange={(isOpen) => !isOpen && setEditingAddress(null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)}>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Address</DialogTitle>
                                            <DialogDescription>
                                                Update your shipping address details.
                                            </DialogDescription>
                                        </DialogHeader>
                                        {editingAddress && (
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="type">Address Type</Label>
                                                    <Input id="type" value={editingAddress.type} onChange={handleAddressFormChange} placeholder="e.g. Home, Work" required/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input id="name" value={editingAddress.name} onChange={handleAddressFormChange} required/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <Input id="phone" value={editingAddress.phone} onChange={handleAddressFormChange} type="tel" required/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="address">Address</Label>
                                                    <Input id="address" value={editingAddress.address} onChange={handleAddressFormChange} required/>
                                                </div>
                                            </div>
                                        )}
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleUpdateAddress}>Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" size="sm" onClick={() => removeAddress(address.id)}>Remove</Button>
                                {!address.isDefault && <Button variant="secondary" size="sm" onClick={() => handleSetDefault(address.id)}>Set as Default</Button>}
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="orders" className="mt-8">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>View your past orders and their status.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchOrders} disabled={loadingOrders}>
                        <RefreshCw className={`h-4 w-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {loadingOrders ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl font-semibold">No orders yet.</p>
                            <p className="text-lg text-muted-foreground mt-2">
                                You haven't placed any orders with us.
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {orders.map((order) => {
                                const orderDate = new Date(order.date);
                                const status = order.status.trim();
                                const isProcessing = status === "Processing";
                                const isShipped = status === "Shipped";
                                const isOutForDelivery = status === "Out for Delivery";
                                const isDelivered = status === "Delivered";

                                const now = new Date();
                                const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
                                const isReturnPeriodActive = isDelivered && orderDate.getTime() > sevenDaysAgo.getTime();
                                
                                return (
                                <React.Fragment key={order.id}>
                                    <TableRow>
                                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                        <TableCell>{orderDate.toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === "Delivered" ? "default" : "secondary"} 
                                                   className={order.status === "Processing" ? "bg-blue-100 text-blue-800" : order.status.startsWith("Payment Pending") ? "bg-yellow-100 text-yellow-800" : ""}>
                                              {order.status.split(',')[0]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {order.items.length}
                                        </TableCell>
                                        <TableCell className="text-right">₹{order.total.toLocaleString()}</TableCell>
                                        <TableCell className="text-right space-y-2">
                                            {isProcessing && (
                                                 <Button variant="destructive" size="sm" onClick={() => handleWhatsAppRedirect(`Hi, I'd like to cancel my order: ${order.id}`)}>
                                                    Cancel Order
                                                </Button>
                                            )}
                                            {(isShipped || isOutForDelivery) && (
                                                <div className="text-xs text-muted-foreground text-right">
                                                    Order cannot be cancelled. <br />
                                                    Contact customer support for help.
                                                </div>
                                            )}
                                            {order.trackingId && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`https://www.google.com/search?q=${order.trackingProvider}+tracking+${order.trackingId}`} target="_blank" rel="noopener noreferrer">Track Order</a>
                                                </Button>
                                            )}
                                            {isReturnPeriodActive && !order.returnRequest && (
                                                <Button variant="outline" size="sm" onClick={() => handleWhatsAppRedirect(`Hi, I'd like to request a return/exchange for my order: ${order.id}`)}>
                                                    Return/Exchange
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {order.status.startsWith('Payment Pending') && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-0">
                                            <div className="bg-yellow-50 p-3 m-2 rounded-md flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                                <div>
                                                    <p className="font-semibold text-sm text-yellow-800">Payment Confirmation Pending</p>
                                                    <p className="text-sm text-yellow-700">Our customer care team will contact you shortly to confirm your payment.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    )}
                                    {order.returnRequest && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-0">
                                            <div className="bg-secondary/50 p-3 m-2 rounded-md flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-semibold text-sm">Return Request Status: <span className="font-bold text-primary">{order.returnRequest.status}</span></p>
                                                    <p className="text-sm text-muted-foreground">Reason: {order.returnRequest.reason}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    )}
                                </React.Fragment>
                           )})}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="wishlist" className="mt-8">
           <Card>
            <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
                <CardDescription>Your favorite items, all in one place.</CardDescription>
            </CardHeader>
            <CardContent>
                {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {wishlistedProducts.map((product) => (
                            <div key={product.id} className="relative group">
                                <ProductCard product={product} />
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                     <Button size="sm" onClick={() => handleMoveToCart(product)}>Add to Cart</Button>
                                    <Button size="sm" variant="destructive" onClick={() => removeFromWishlist(product.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl font-semibold">Your wishlist is empty.</p>
                        <p className="text-lg text-muted-foreground mt-2">
                            Explore our collections and add your favorite items.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}
