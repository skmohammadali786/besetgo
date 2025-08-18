
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/firestore";

export default async function CoOrdSetsPage() {
  const allProducts = await getProducts();
  const coordSetProducts = allProducts.filter(
      (product) => product.category === 'Co-ord Sets'
  );

  return (
    <div className="container mx-auto">
       <div className="py-8 md:py-12 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Co-ord Sets</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Effortless style meets modern comfort. Discover our collection of chic and versatile co-ord sets.
        </p>
      </div>
      <main className="mb-12">
        {coordSetProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {coordSetProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
                <p className="text-xl font-semibold">No Co-ord Sets Found</p>
                <p className="text-lg text-muted-foreground mt-2">Please check back later for new additions.</p>
              </div>
          )}
      </main>
    </div>
  );
}
