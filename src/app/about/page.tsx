
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">About SHILPIK.</h1>
          <p className="text-lg text-muted-foreground">
            SHILPIK. was born from a desire to celebrate the rich heritage of Indian ethnic wear while embracing a modern, elegant aesthetic. Our name reflects our commitment to empowering the modern individual who is always ready for the next adventure.
          </p>
          <p className="text-muted-foreground">
            We believe that clothing is a form of self-expression. Our collections are designed for the contemporary individual who values quality, craftsmanship, and timeless style. Each piece in our collection is a testament to the intricate artistry of Indian textiles and embroidery, re-imagined for today's world.
          </p>
          <p className="text-muted-foreground">
            From the looms of Banaras to the block-printers of Rajasthan, we partner with craft clusters across India to bring you authentic, handcrafted pieces. We are dedicated to sustainable practices and fair wages, ensuring that every SHILPIK. garment not only looks beautiful but also carries a story of empowerment and tradition.
          </p>
        </div>
        <div className="aspect-[4/5] overflow-hidden rounded-lg">
           <Image
              src="https://placehold.co/600x750.png"
              alt="Artisan weaving"
              width={600}
              height={750}
              className="h-full w-full object-cover"
              data-ai-hint="artisan weaving"
            />
        </div>
      </div>
    </div>
  );
}
