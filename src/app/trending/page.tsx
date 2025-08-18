
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/firestore";

export default async function TrendingPage() {
    const allProducts = await getProducts();
    const trendingProducts = allProducts.filter(product => product.isTrending);

  return (
    <div className="container mx-auto">
      <div className="py-8 md:py-12 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Trending Now</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Discover our most popular styles, loved by fashion enthusiasts everywhere.
        </p>
      </div>
      <main className="mb-12">
        {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {trendingProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
                <p className="text-xl font-semibold">No Trending Items Found</p>
                <p className="text-lg text-muted-foreground mt-2">Please check back later for new trends.</p>
              </div>
          )}
      </main>
    </div>
  );
}
