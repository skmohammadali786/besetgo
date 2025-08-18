
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/cart-provider';
import { WishlistProvider } from '@/contexts/wishlist-provider';
import { AddressProvider } from '@/contexts/address-provider';
import { AuthProvider } from '@/contexts/auth-provider';
import { ProfileProvider } from '@/contexts/profile-provider';
import { getCategories } from '@/lib/firestore';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';

const fontBody = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap',
});
const fontHeadline = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SHILPIK: Elegant Ethnic Fashion',
  description: 'SHILPIK.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={cn('antialiased', fontBody.variable, fontHeadline.variable)}>
          <AuthProvider>
            <ProfileProvider>
              <AddressProvider>
                <WishlistProvider>
                  <CartProvider>
                    <div className="flex min-h-screen flex-col">
                      <Header categories={categories} />
                      <main className="flex-1">{children}</main>
                      <Suspense fallback={null}>
                        <Footer />
                      </Suspense>
                    </div>
                    <Toaster />
                  </CartProvider>
                </WishlistProvider>
              </AddressProvider>
            </ProfileProvider>
          </AuthProvider>
        </body>
      </html>
  );
}
