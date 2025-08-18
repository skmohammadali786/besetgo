
import Image from "next/image";

export default function SustainabilityPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Commitment to Sustainability</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          At SHILPIK., we believe that fashion can be beautiful and responsible. We are committed to mindful practices that honor our artisans, our planet, and our customers.
        </p>
      </div>

      <div className="space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <h2 className="font-headline text-3xl font-bold text-primary">Empowering Artisans</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Our journey begins with the talented artisans across India who are the custodians of centuries-old craft traditions. We partner directly with craft clusters, ensuring fair wages and a supportive work environment. By eliminating middlemen, we help these communities thrive and preserve their invaluable skills for future generations. Each SHILPIK. piece you own is a testament to their dedication and artistry.
                </p>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg">
                <Image
                    src="https://images.unsplash.com/photo-1599318012684-6f414a387538?q=80&w=1200"
                    alt="Artisan working on a loom"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint="artisan loom"
                />
            </div>
        </div>

         <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="aspect-video overflow-hidden rounded-lg md:order-last">
                <Image
                    src="https://images.unsplash.com/photo-1620714223084-86c891503b03?q=80&w=1200"
                    alt="Natural fabric dyes"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint="natural fabric dyes"
                />
            </div>
            <div className="space-y-4">
                <h2 className="font-headline text-3xl font-bold text-primary">Conscious Materials</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We prioritize natural, biodegradable fabrics like organic cotton, linen, and silk. We are also exploring innovative materials made from recycled fibers. Our dyes are predominantly plant-based and azo-free, reducing water pollution and ensuring our garments are gentle on your skin and the environment. We believe in creating clothes that feel as good as they look.
                </p>
            </div>
        </div>
        
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <h2 className="font-headline text-3xl font-bold text-primary">Mindful Production</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We produce in small batches to minimize waste and avoid overproduction. This approach allows us to maintain high quality standards and ensures that each garment is made with care and attention to detail. We utilize fabric scraps to create accessories and packaging, striving for a zero-waste production cycle. Our packaging is plastic-free and made from recycled materials.
                </p>
            </div>
             <div className="aspect-video overflow-hidden rounded-lg">
                <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200"
                    alt="Fashion designer working"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint="fashion studio"
                />
            </div>
        </div>
        
        <div id="packaging" className="grid md:grid-cols-2 gap-12 items-center pt-8">
             <div className="aspect-video overflow-hidden rounded-lg md:order-last">
                <Image
                    src="https://placehold.co/600x400.png"
                    alt="Stylish and reusable can packaging"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint="reusable can"
                />
            </div>
            <div className="space-y-4">
                <h2 className="font-headline text-3xl font-bold text-primary">Our Signature Packaging: A Gift That Lasts</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We believe the experience of receiving a SHILPIK. piece should be as special as the garment itself. That’s why your order arrives in our signature reusable can. It’s more than just packaging; it’s a beautiful, durable container designed for a second life. Use it to store jewelry, as a planter for your favorite succulent, or as a chic organizer on your desk. This is our commitment to reducing waste and adding lasting value to your purchase.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
