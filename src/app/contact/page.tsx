
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { handleContact } from "@/ai/flows/contact-flow";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const result = await handleContact(data);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Flow returned success: false");
      }
    } catch (error) {
       console.error("Contact form submission failed:", error);
       toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about our products, your order, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">For support or inquiries, drop us an email.</p>
                     <Button asChild className="mt-2">
                      <a href="mailto:care@besetgo.com">
                        <Mail className="mr-2 h-4 w-4" /> Email Now
                      </a>
                    </Button>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">Our customer care is available from 10 AM to 6 PM IST.</p>
                     <Button asChild className="mt-2">
                      <a href="tel:+919876543210">
                         <Phone className="mr-2 h-4 w-4" /> Call Now
                      </a>
                    </Button>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">WhatsApp</h3>
                    <p className="text-muted-foreground">Chat with us directly on WhatsApp.</p>
                    <Button asChild className="mt-2 bg-green-600 hover:bg-green-700">
                      <a href="https://wa.me/919332309632" target="_blank" rel="noopener noreferrer">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Chat Now
                      </a>
                    </Button>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Our Studio</h3>
                    <p className="text-muted-foreground">
                        123, Fashion Avenue, Jaipur, <br />
                        Rajasthan, India - 302001
                    </p>
                </div>
            </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6 p-8 border rounded-lg bg-card">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Your Name" required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="e.g., Order Inquiry" required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Write your message here..." rows={5} required/>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
