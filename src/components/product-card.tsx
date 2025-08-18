
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { Badge } from "./ui/badge";
import React from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "./ui/toast";
import { useAuth } from "@/hooks/use-auth";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

function ProductCardComponent({ product, className, priority = false }: ProductCardProps) {
  const { user } = useAuth();
  const { wishlistedItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const isWishlisted = wishlistedItems.includes(product.id);

  const handleWishlistToggle = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
        toast({ title: "Please sign in", description: "You need to be signed in to add items to your wishlist.", variant: "destructive" });
        return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  }, [user, isWishlisted, removeFromWishlist, addToWishlist, product.id, toast]);
  
  const handleAddToCart = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
     if (!user) {
        toast({ title: "Please sign in", description: "You need to be signed in to add items to your cart.", variant: "destructive" });
        return;
    }
    const defaultSize = product.sizes[0];
    if (defaultSize) {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: defaultSize,
        });
        toast({
          title: "Added to cart",
          description: `1 x ${product.name}`,
           action: (
            <div className="flex flex-col gap-2 w-full">
               <ToastAction altText="View Cart" asChild>
                <Button asChild variant="default" size="sm" className="w-full bg-white text-black hover:bg-white/90">
                    <Link href="/cart">View Cart</Link>
                </Button>
              </ToastAction>
              <ToastAction altText="Continue Shopping" asChild>
                <Button variant="secondary" size="sm" className="w-full">Continue</Button>
              </ToastAction>
            </div>
        )
        });
    } else {
        router.push(`/products/${product.id}`);
    }
  }, [user, product, addItem, toast, router]);

  return (
    <div className={cn("group relative", className)}>
      <Link href={`/products/${product.id}`}>
        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-200">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={500}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            data-ai-hint={product.aiHint}
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
           <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              onClick={handleWishlistToggle}
              aria-label="Toggle Wishlist"
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
            </Button>
          </div>
          {product.originalPrice && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white rounded-full px-3 py-1 text-xs">SALE</Badge>
          )}
        </div>
        <div className="mt-4 text-center">
            <h3 className="text-sm font-medium text-gray-700 group-hover:text-primary">
                {product.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{product.category}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="text-sm font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
      <div className="mt-3">
          <Button 
            variant="outline" 
            className="w-full transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4"/> Quick Add
          </Button>
      </div>
    </div>
  );
}

export const ProductCard = React.memo(ProductCardComponent);
