
"use client";

import { Button } from "@/components/ui/button";
import { getCategories, getProducts, getPromotions } from "@/lib/firestore";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { PromotionCarousel } from "@/components/promotion-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";
import { PackagingBanner } from "@/components/packaging-banner";
import type { Category, Product, Promotion } from "@/lib/types";

function CategoriesGrid({ categories }: { categories: Category[] }) {
  const categoryShapes = [
    "rounded-[45%_55%_45%_55%/_60%_50%_50%_40%]",
    "rounded-[55%_45%_60%_40%/_50%_60%_40%_50%]",
    "rounded-[40%_60%_50%_50%/_45%_55%_55%_45%]",
    "rounded-[50%_50%_40%_60%/_55%_45%_55%_45%]",
    "rounded-[60%_40%_55%_45%/_50%_50%_40%_60%]",
    "rounded-[48%_52%_52%_48%/_60%_40%_60%_40%]",
  ];

  return (
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <div key={category.id}>
            <Link href={category.href} className="group">
              <div className={`relative overflow-hidden ${categoryShapes[index % categoryShapes.length]} aspect-[4/5] transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover w-full h-full "
                  data-ai-hint={category.aiHint}
                   sizes="(max-width: 768px) 50vw, (max-width: 1200px) 16vw, 150px"
                   priority={index < 2}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              </div>
              <h3 className="mt-4 text-center font-headline text-xl font-semibold text-foreground group-hover:text-primary">
                {category.name}
              </h3>
            </Link>
        </div>
      ))}
    </div>
  )
}

function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
             <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full rounded-[45%_55%_45%_55%/_60%_50%_50%_40%]" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
        ))}
    </div>
  )
}


function ProductGrids({ products }: { products: Product[] }) {
  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  return (
    <>
      <section className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
          Featured Collection
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
             <div key={product.id}>
                <ProductCard product={product} priority={index < 4} />
             </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild variant="default" size="lg">
                <Link href="/products">View All Products</Link>
            </Button>
        </div>
      </section>
      
      {trendingProducts.length > 0 ? (
        <section className="bg-secondary/50 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
                Trending Now
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {trendingProducts.map((product, index) => (
                   <div key={product.id}>
                      <ProductCard product={product} />
                   </div>
                ))}
              </div>
              <div className="text-center mt-12">
                  <Button asChild variant="default" size="lg">
                      <Link href="/trending">Explore All Trending</Link>
                  </Button>
              </div>
            </div>
        </section>
      ): null}
    </>
  )
}

function ProductGridSkeleton() {
  return (
    <section className="container mx-auto px-4">
      <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
        Featured Collection
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[4/5] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    </section>
  )
}


export default function Home() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [promoData, catData, prodData] = await Promise.all([
          getPromotions(),
          getCategories(),
          getProducts(),
        ]);
        setPromotions(promoData);
        setCategories(catData);
        setProducts(prodData);
      } catch (error) {
        console.error("Failed to fetch page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);


  return (
    <div className="space-y-12 md:space-y-20">
      <PromotionCarousel promotions={promotions} />
      
      <section className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        {loading ? <CategoriesGridSkeleton /> : <CategoriesGrid categories={categories} />}
      </section>

      {loading ? <ProductGridSkeleton /> : <ProductGrids products={products} />}
      
      <PackagingBanner />

    </div>
  );
}
