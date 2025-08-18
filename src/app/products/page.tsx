
import { getProducts, getCategories } from "@/lib/firestore";
import type { Product, Category } from "@/lib/types";
import { ProductsPageClient } from "./products-page-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </aside>
      <main className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/5] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

async function ProductsList() {
  const products = await getProducts();
  const categories = await getCategories();

  return <ProductsPageClient products={products} categories={categories} />;
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8 md:py-12">
      <Suspense fallback={<ProductsPageSkeleton />}>
        <ProductsList />
      </Suspense>
    </div>
  )
}
