
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/firestore";

export default async function LatestArrivalsPage() {
    const allProducts = await getProducts();
    const newArrivals = [...allProducts].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 8);

  return (
    <div className="container mx-auto">
      <div className="py-8 md:py-12 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Latest Arrivals</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Check out the latest additions to our collection. Fresh designs, timeless elegance.
        </p>
      </div>
      <main className="mb-12">
        {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-xl font-semibold">No New Arrivals Found</p>
                <p className="text-lg text-muted-foreground mt-2">Please check back later for new additions.</p>
            </div>
        )}
      </main>
    </div>
  );
}
