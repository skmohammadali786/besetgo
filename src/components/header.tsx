
"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, LogOut } from "lucide-react";
import type { Category } from "@/lib/types";
import { CartSheet } from './cart-sheet';


export function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
       isScrolled ? "bg-secondary/95 backdrop-blur-sm" : "bg-transparent",
      isVisible ? 'translate-y-0' : '-translate-y-full'
      )}>
      <div className="container flex h-16 items-center">
        {/* Desktop View */}
        <div className="mr-4 hidden md:flex md:flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold whitespace-nowrap">BESETGO.</span>
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(pathname.startsWith('/products') && 'text-accent')}>Categories</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={category.href}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
                 <DropdownMenuItem asChild>
                    <Link href="/products">All Products</Link>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/latest-arrivals" className={cn(buttonVariants({ variant: "ghost" }), pathname === '/latest-arrivals' && 'text-accent')}>Latest Arrivals</Link>
            <Link href="/trending" className={cn(buttonVariants({ variant: "ghost" }), pathname === '/trending' && 'text-accent')}>Trending</Link>
            <Link href="/sale" className={cn(buttonVariants({ variant: "ghost" }), pathname === '/sale' && 'text-accent')}>Sale</Link>
            <Link href="/about" className={cn(buttonVariants({ variant: "ghost" }), pathname === '/about' && 'text-accent')}>About</Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "ghost" }), pathname === '/contact' && 'text-accent')}>Contact</Link>
          </nav>
        </div>

        {/* Mobile View */}
        <div className="flex w-full items-center justify-between md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" x2="21" y1="12" y2="12"></line><line x1="3" x2="21" y1="6" y2="6"></line><line x1="3" x2="21" y1="18" y2="18"></line></svg>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs flex flex-col p-0">
                <SheetHeader className="p-4 border-b">
                   <SheetTrigger asChild>
                     <Link href="/" className="mb-2">
                       <SheetTitle className="font-headline text-2xl font-bold text-left">BESETGO.</SheetTitle>
                     </Link>
                   </SheetTrigger>
                </SheetHeader>
                <ScrollArea className="flex-1">
                  <nav className="grid gap-2 text-base font-medium p-4">
                      <SheetTrigger asChild><Link href="/" className="block py-2 transition-colors hover:text-primary">Home</Link></SheetTrigger>
                      <Separator className="my-2" />
                      <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Shop</p>
                      <SheetTrigger asChild><Link href="/latest-arrivals" className="block py-2 transition-colors hover:text-primary">Latest Arrivals</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/trending" className="block py-2 transition-colors hover:text-primary">Trending</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/sale" className="block py-2 transition-colors hover:text-primary text-black">Sale</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/products" className="block py-2 transition-colors hover:text-primary">All Products</Link></SheetTrigger>
                      
                      <Separator className="my-2" />

                      <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Categories</p>
                      {categories.map((category) => (
                        <SheetTrigger asChild key={category.id}>
                            <Link href={category.href} className="block py-2 transition-colors hover:text-primary">{category.name}</Link>
                        </SheetTrigger>
                      ))}

                      <Separator className="my-2" />

                      <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">About</p>
                       <SheetTrigger asChild><Link href="/about" className="block py-2 transition-colors hover:text-primary">About Us</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/contact" className="block py-2 transition-colors hover:text-primary">Contact Us</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/sustainability" className="block py-2 transition-colors hover:text-primary">Sustainability</Link></SheetTrigger>
                      
                       <Separator className="my-2" />

                       <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Customer Service</p>
                      <SheetTrigger asChild><Link href="/account" className="block py-2 transition-colors hover:text-primary">My Account</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/account?tab=wishlist" className="block py-2 transition-colors hover:text-primary">Wishlist</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/faq" className="block py-2 transition-colors hover:text-primary">FAQ</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/size-guide" className="block py-2 transition-colors hover:text-primary">Size Guide</Link></SheetTrigger>
                      <SheetTrigger asChild><Link href="/returns" className="block py-2 transition-colors hover:text-primary">Return & Refund Policy</Link></SheetTrigger>
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="flex items-center">
              <span className="font-headline text-2xl font-bold">BESETGO.</span>
            </Link>

            <div className="flex items-center justify-end space-x-1">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                    <span className="sr-only">Search</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top">
                  <SheetHeader>
                    <SheetTitle>Search for products</SheetTitle>
                  </SheetHeader>
                  <form className="mt-4 flex gap-2" onSubmit={handleSearch}>
                    <Input name="search" placeholder="Search for kurtas, lehengas..." />
                    <SheetTrigger asChild>
                      <Button type="submit">Search</Button>
                    </SheetTrigger>
                  </form>
                </SheetContent>
              </Sheet>
              <Suspense fallback={<div className="h-10 w-10" />}>
                <CartSheet />
              </Suspense>
              {user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/account"><User className="mr-2 h-4 w-4" />My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/sign-in">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                         <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
                         <circle cx="12" cy="10" r="3" />
                         <circle cx="12" cy="12" r="10" />
                      </svg>
                      <span className="sr-only">Account</span>
                    </Link>
                  </Button>
              )}
            </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
           <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                    <span className="sr-only">Search</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top">
                  <SheetHeader>
                    <SheetTitle>Search for products</SheetTitle>
                  </SheetHeader>
                  <form className="mt-4 flex gap-2" onSubmit={handleSearch}>
                    <Input name="search" placeholder="Search for kurtas, lehengas..." />
                    <SheetTrigger asChild>
                      <Button type="submit">Search</Button>
                    </SheetTrigger>
                  </form>
                </SheetContent>
              </Sheet>
              <Suspense fallback={<div className="h-10 w-10" />}>
                <CartSheet />
              </Suspense>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/account"><User className="mr-2 h-4 w-4" />My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                  <Button variant="ghost" asChild>
                      <Link href="/sign-in">Sign In</Link>
                  </Button>
              )}
        </div>
      </div>
    </header>
  );
}
