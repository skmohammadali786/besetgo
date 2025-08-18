
"use client";

import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from './ui/button';
import Link from 'next/link';
import type { Promotion } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import Autoplay from "embla-carousel-autoplay";

export function PromotionCarousel({ promotions }: { promotions: Promotion[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  
  if (!promotions || promotions.length === 0) {
    return <Skeleton className="h-[60vh] md:h-[75vh] w-full" />;
  }

  return (
    <section>
      <Carousel
         plugins={[plugin.current]}
         opts={{
          loop: true,
          align: "start",
        }}
         onMouseEnter={plugin.current.stop}
         onMouseLeave={plugin.current.reset}
         className="w-full"
      >
        <CarouselContent>
            {promotions.map((promo, index) => (
            <CarouselItem key={promo.id}>
                <div className="relative h-[60vh] md:h-[75vh] w-full">
                <Image
                    src={promo.image}
                    alt={promo.alt}
                    fill
                    style={{objectFit:"cover"}}
                    className="brightness-[0.6]"
                    data-ai-hint={promo.aiHint}
                    priority={index === 0}
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 p-4 space-y-4">
                    <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                    {promo.title}
                    </h2>
                    <p className="font-body text-base md:text-lg max-w-2xl mx-auto text-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 animation-delay-300">
                    {promo.description}
                    </p>
                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 animation-delay-500">
                        <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                            <Link href={promo.href}>{promo.buttonText}</Link>
                        </Button>
                    </div>
                </div>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex" />
      </Carousel>
    </section>
  );
}
