
"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Minus, Plus, Star, Truck, UploadCloud, X, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { getProduct, getReviews, addReview, deleteReview } from "@/lib/firestore";
import type { Product, Review } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function ReviewsSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [reviewPreviews, setReviewPreviews] = useState<string[]>([]);
  
  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
        const fetchedReviews = await getReviews(productId);
        setReviews(fetchedReviews);
    } catch (error) {
        console.error("Failed to fetch reviews", error);
    } finally {
        setLoadingReviews(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  
  const handleReviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (reviewFiles.length + newFiles.length > 2) {
                toast({
                    title: "Maximum 2 images allowed",
                    description: "Please remove an existing image to upload a new one.",
                    variant: "destructive"
                });
                return;
            }
            setReviewFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setReviewPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeReviewImage = (index: number) => {
        setReviewFiles(prev => prev.filter((_, i) => i !== index));
        setReviewPreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(reviewPreviews[index]); // Clean up memory
            return newPreviews;
        });
    }
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Please sign in", description: "You must be logged in to write a review.", variant: "destructive" });
        return;
    }
    if (newReviewRating > 0 && newReviewComment.trim() !== "") {
        setIsSubmittingReview(true);
        try {
            const uploadedImageUrls: string[] = [];
            for (const file of reviewFiles) {
                const storageRef = ref(storage, `reviews/${productId}/${user.uid}/${Date.now()}-${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedImageUrls.push(downloadURL);
            }

            const newReviewData: Omit<Review, 'id' | 'date'> = {
                author: user.displayName || "Anonymous",
                rating: newReviewRating,
                comment: newReviewComment,
                userId: user.uid,
                ...(user.photoURL && { authorImage: user.photoURL }),
                ...(uploadedImageUrls.length > 0 && { reviewImageUrls: uploadedImageUrls }),
            };
            
            await addReview(productId, newReviewData);
            
            // Reset form
            setNewReviewRating(0);
            setNewReviewComment("");
            setReviewFiles([]);
            setReviewPreviews([]);
            
            toast({
                title: "Review Submitted",
                description: "Thank you for your feedback!",
            });
            fetchReviews(); // Re-fetch reviews
        } catch (error) {
            console.error("Failed to submit review", error);
            toast({ title: "Error", description: "Could not submit your review.", variant: "destructive" });
        } finally {
            setIsSubmittingReview(false);
        }
    } else {
         toast({
            title: "Incomplete Review",
            description: "Please provide a rating and a comment.",
            variant: "destructive"
        });
    }
  };

  const handleDeleteReview = async(reviewId: string) => {
    setIsSubmittingReview(true); // Disable buttons while deleting
    try {
        await deleteReview(productId, reviewId);
        toast({
            title: "Review Deleted",
            description: "Your review has been successfully removed.",
        });
        fetchReviews(); // Re-fetch to update list
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not delete your review.",
            variant: "destructive"
        });
    } finally {
        setIsSubmittingReview(false);
    }
  }

  return (
       <div id="reviews" className="mt-16">
          <h2 className="font-headline text-3xl font-bold mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                 {loadingReviews ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                 ) : reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">Be the first to review this product!</p>
                 ) : (
                    reviews.map((review, index) => (
                        <Card key={review.id}>
                           <CardContent className="p-6">
                               <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={review.authorImage} alt={review.author} />
                                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{review.author}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                                                {user && user.uid === review.userId && (
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isSubmittingReview}>
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete your review.
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteReview(review.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'fill-muted text-muted-foreground'}`}/>
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{review.comment}</p>
                                        {review.reviewImageUrls && review.reviewImageUrls.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                {review.reviewImageUrls.map((url, imgIndex) => (
                                                    <a key={imgIndex} href={url} target="_blank" rel="noopener noreferrer">
                                                        <Image src={url} alt={`Review image ${imgIndex + 1}`} width={100} height={100} className="rounded-md object-cover aspect-square hover:opacity-80 transition-opacity" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                               </div>
                           </CardContent>
                        </Card>
                     ))
                 )}
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <Label>Your Rating</Label>
                                <div className="flex items-center gap-1 mt-2">
                                     {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`h-6 w-6 cursor-pointer ${i < newReviewRating ? 'fill-accent text-accent' : 'fill-muted text-muted-foreground'}`}
                                            onClick={() => setNewReviewRating(i + 1)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="review-comment">Your Review</Label>
                                <Textarea 
                                    id="review-comment" 
                                    placeholder="Share your thoughts about the product..." 
                                    className="mt-2"
                                    rows={4}
                                    value={newReviewComment}
                                    onChange={(e) => setNewReviewComment(e.target.value)}
                                    disabled={!user}
                                />
                            </div>
                             <div>
                                <Label>Add Photos (Optional)</Label>
                                 <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-4 text-center">
                                    <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                                    <label htmlFor="review-file-upload" className="mt-2 text-xs text-muted-foreground cursor-pointer">
                                        Click to browse (Max 2 images)
                                    </label>
                                    <Input id="review-file-upload" type="file" className="sr-only" onChange={handleReviewFileChange} multiple accept="image/*" disabled={!user || reviewFiles.length >= 2} />
                                </div>
                                {reviewPreviews.length > 0 && (
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        {reviewPreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                                                <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover"/>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full"
                                                    onClick={() => removeReviewImage(index)}
                                                >
                                                    <X className="h-3 w-3"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={!user || isSubmittingReview}>
                                {isSubmittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {user ? 'Submit Review' : 'Please Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
          </div>
       </div>
  );
}

function ProductPageClient({ product }: { product: Product }) {
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = useCallback(() => {
    if (selectedSize) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        quantity: quantity,
      });
       toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
        action: (
            <div className="flex flex-col gap-2 w-full">
               <ToastAction altText="View Cart" asChild>
                <Button variant="default" size="sm" className="w-full bg-white text-black hover:bg-white/90">
                    <Link href="/cart">View Cart</Link>
                </Button>
              </ToastAction>
              <ToastAction altText="Continue Shopping" asChild>
                <Button variant="secondary" size="sm" className="w-full">Continue Shopping</Button>
              </ToastAction>
            </div>
        )
      });
    } else {
        toast({
            title: "Please select a size",
            variant: "destructive",
        });
    }
  },[addItem, product, quantity, selectedSize, toast]);

  const handleBuyNow = useCallback(() => {
    if (selectedSize) {
        const params = new URLSearchParams({
            productId: product.id,
            size: selectedSize,
            quantity: quantity.toString(),
        });
        router.push(`/buy-now?${params.toString()}`);
    } else {
       toast({
            title: "Please select a size",
            variant: "destructive",
        });
    }
  }, [product, quantity, selectedSize, router, toast]);

  const handleCheckPincode = useCallback(() => {
    if (/^\d{6}$/.test(pincode)) {
        toast({
            title: "Delivery available!",
            description: `We can deliver to your pincode: ${pincode}`,
        });
    } else {
        toast({
            title: "Invalid Pincode",
            description: "Please enter a valid 6-digit pincode.",
            variant: "destructive",
        });
    }
  },[pincode, toast]);
  
  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="md:sticky top-24 self-start">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      width={800}
                      height={1067}
                      className="h-full w-full object-cover"
                      data-ai-hint={product.aiHint}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl md:text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
                </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
                <p className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                <p className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                </p>
                )}
            </div>
          </div>
          
          <div>
            <Label className="text-base font-semibold">Size</Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2 mt-2"
            >
              {product.sizes.map((size) => (
                <div key={size}>
                  <RadioGroupItem value={size} id={size} className="peer sr-only" />
                  <Label
                    htmlFor={size}
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-accent/80"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
             {!selectedSize && <p className="text-sm text-destructive mt-2">Please select a size.</p>}
          </div>

          <div>
            <Label htmlFor="quantity" className="text-base font-semibold">Quantity</Label>
            <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4"/>
                    </Button>
                    <span className="w-10 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4"/>
                    </Button>
                </div>
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</Badge>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <Button size="lg" onClick={handleAddToCart} disabled={!selectedSize}>Add to Cart</Button>
            <Button size="lg" variant="outline" onClick={handleBuyNow} disabled={!selectedSize}>Buy Now</Button>
          </div>

          <Separator />
          
          <div className="p-4 border rounded-lg bg-secondary/30">
            <div className="flex items-center gap-4">
              <Truck className="h-8 w-8 text-primary flex-shrink-0"/>
              <div className="flex-1">
                  <p className="font-semibold">Check Delivery Availability</p>
                   <div className="flex items-center space-x-2 mt-2">
                      <Input 
                        id="pincode" 
                        placeholder="Enter 6-digit Pincode" 
                        className="bg-background"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                      />
                      <Button variant="outline" onClick={handleCheckPincode}>Check</Button>
                    </div>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible defaultValue="description" className="w-full">
            <AccordionItem value="description">
                <AccordionTrigger className="text-lg font-semibold">Description</AccordionTrigger>
                <AccordionContent className="text-base">
                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                        <br /><br />
                        <span className="font-semibold text-foreground">Each piece arrives in our signature reusable, eco-friendly can—a keepsake for your treasures.</span>
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details">
                <AccordionTrigger className="text-lg font-semibold">Product Details</AccordionTrigger>
                <AccordionContent className="text-base">
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Fabric: Silk Blend</li>
                        <li>Care: Dry Clean Only</li>
                        <li>Fit: Regular</li>
                        <li>Origin: Made in India</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

        <Suspense fallback={<div className="flex justify-center items-center py-20 mt-16"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ReviewsSection productId={product.id} />
        </Suspense>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (id) {
        try {
          const fetchedProduct = await getProduct(id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          } else {
            notFound();
          }
        } catch (error) {
          console.error(error);
          notFound();
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }
  
  return <ProductPageClient product={product} />;
}
