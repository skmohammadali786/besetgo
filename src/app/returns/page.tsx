import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ReturnsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Return & Refund Policy</h1>
            <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>1. Returns</h2>
            <p>We have a 7-day return policy, which means you have 7 days after receiving your item to request a return.</p>
            <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
            <p>To start a return, you can contact us at <a href="mailto:care@besetgo.com">care@besetgo.com</a> or use the return/exchange option in your account. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>

            <h2>2. Damages and issues</h2>
            <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>

            <h2>3. Exceptions / non-returnable items</h2>
            <p>Certain types of items cannot be returned, like custom products (such as special orders or personalized items). Please get in touch if you have questions or concerns about your specific item.</p>
            <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>

            <h2>4. Exchanges</h2>
            <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>

            <h2>5. Refunds</h2>
            <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>

            <div className="not-prose mt-12">
              <h2 className="font-headline text-2xl font-bold mb-4">Return Policy FAQs</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long does the return process take?</AccordionTrigger>
                  <AccordionContent>
                    Once we receive your returned item, it typically takes 3-5 business days to inspect it and process the refund or exchange.
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                  <AccordionTrigger>Who pays for return shipping?</AccordionTrigger>
                  <AccordionContent>
                    For domestic orders, we provide a free return shipping label for your first return or exchange. For subsequent returns or international orders, the customer is responsible for the return shipping costs.
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                  <AccordionTrigger>What if I received a wrong or damaged item?</AccordionTrigger>
                  <AccordionContent>
                    We sincerely apologize for the error. Please contact our customer support at care@besetgo.com immediately with your order number and a photo of the item. We will arrange for a free pickup and send you the correct item as soon as possible.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
        </div>
    </div>
  );
}
