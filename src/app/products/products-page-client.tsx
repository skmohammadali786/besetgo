
"use client";

import { ProductCard } from "@/components/product-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import type { Product, Category } from "@/lib/types";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
}

export function ProductsPageClient({ products: initialProducts, categories }: ProductsPageProps) {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  
  const [sortOrder, setSortOrder] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const category = categories.find(c => c.name.toLowerCase().replace(/ /g, '-') === categoryParam);
      if (category && !selectedCategories.includes(category.name)) {
        setSelectedCategories([category.name]);
      }
    } else {
        if (searchParams.get('search') === null) {
            setSelectedCategories([]);
        }
    }
  }, [searchParams, categories, selectedCategories]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product =>
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.category))
    );

    const searchQuery = searchParams.get('search');
    if (searchQuery) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default: // "featured"
        // No specific sorting, uses default order.
        break;
    }
    return filtered;
  }, [sortOrder, priceRange, selectedCategories, searchParams, allProducts]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const Filters = () => (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryChange(category.name)}
                  />
                  <Label htmlFor={category.id} className="font-normal cursor-pointer">{category.name}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="p-1">
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value as [number, number]);
                  setCurrentPage(1);
                }}
                max={20000}
                step={500}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-12 duration-500">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">All Products</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Discover your next favorite piece from our curated collection of elegant ethnic wear.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1 animate-in fade-in slide-in-from-left-12 duration-500">
          <div className="sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <Filters />
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 animate-in fade-in duration-500">
             <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                   <ScrollArea className="flex-1 px-1 h-[calc(100vh-8rem)]">
                    <div className="p-4">
                      <Filters />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            <p className="text-sm text-muted-foreground hidden sm:block">Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products</p>
            <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
              <SelectTrigger className="w-auto md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {paginatedProducts.map((product, index) => (
                <div key={product.id} className="animate-in fade-in zoom-in-95 duration-500" style={{animationDelay: `${index * 100}ms`}}>
                    <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 animate-in fade-in">
                <p className="text-xl font-semibold">No Products Found</p>
                <p className="text-lg text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
              </div>
          )}
          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p-1))}}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1)}}
                      isActive={currentPage === i+1}
                    >
                      {i+1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p+1))}}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </>
  );
}
