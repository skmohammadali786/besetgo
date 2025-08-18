import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqPage() {
  const faqItems = {
    "Shipping": [
      {
        question: "What are your shipping options?",
        answer: "We offer standard and express shipping options. Standard shipping usually takes 5-7 business days, while express shipping takes 2-3 business days. All orders above ₹5000 qualify for free standard shipping."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. International shipping rates and times vary depending on the destination. Please proceed to checkout to see the options available for your location."
      },
       {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also find the tracking information in the 'Orders' section of your account."
      }
    ],
    "Returns": [
      {
        question: "What is your return policy?",
        answer: "We have a 7-day return policy. You can request a return within 7 days of receiving your item. The item must be unused, with tags, and in its original packaging. Please visit our Return & Refund Policy page for more details."
      },
      {
        question: "How do I start a return?",
        answer: "To start a return, go to the 'Orders' section in your account, select the order, and click the 'Return/Exchange' button. Follow the instructions to complete your request."
      }
    ],
    "Sizing": [
      {
        question: "How do I know which size to choose?",
        answer: "We have a detailed size guide available on our website with measurements for each size. You can find the 'Size Guide' link on every product page and in our website footer. If you are between sizes, we generally recommend sizing up."
      },
      {
        question: "What if the item doesn't fit?",
        answer: "If the item doesn't fit, you can request an exchange for a different size within 7 days of receiving it, subject to availability. Please follow the standard return/exchange process in your account."
      }
    ],
     "Wholesale": [
       {
        question: "Do you offer wholesale pricing?",
        answer: "Yes, we do offer wholesale pricing for bulk orders. If you are a retailer interested in carrying our products, please contact us at wholesale@shilpik.com for more information."
      }
    ]
  };

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Find answers to common questions about our products, shipping, returns, and more.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {Object.entries(faqItems).map(([topic, qas]) => (
          <div key={topic} className="mb-8">
            <h2 className="font-headline text-2xl font-bold mb-4">{topic}</h2>
            <Accordion type="single" collapsible className="w-full">
              {qas.map((qa, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{qa.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {qa.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
