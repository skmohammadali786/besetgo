
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import React from "react";

function PackagingBannerComponent() {
    return (
        <section className="bg-secondary/30 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-12 duration-500">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
                        <Image 
                            src="https://placehold.co/600x450.png"
                            alt="Eco-friendly and reusable can packaging"
                            fill
                            className="object-cover"
                            data-ai-hint="stylish can packaging"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold">
                            Beyond the Thread: Packaging Reimagined.
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                            Your BE SET GO. piece arrives in a beautifully crafted, durable can. More than just packaging, it's a keepsake. Re-use it as a stylish planter, a chic storage container, or a home for your treasures. It's our small step towards a more sustainable future, blending elegance with purpose.
                        </p>
                        <Button asChild size="lg" className="mt-6">
                            <Link href="/sustainability#packaging">Our Green Commitment</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const PackagingBanner = React.memo(PackagingBannerComponent);
