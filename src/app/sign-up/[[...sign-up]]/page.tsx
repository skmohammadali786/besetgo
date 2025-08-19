
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
            title: "Sign Up Failed",
            description: "Please enter your full name.",
            variant: "destructive",
        })
      return;
    }
    try {
      await signUp(email, password, name);
      router.push("/account");
    } catch (error: any) {
      toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
        })
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
        <Card className="w-full max-w-md">
             <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
                <CardDescription>Join BESETGO. to start your fashion journey</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                            id="name" 
                            type="text" 
                            placeholder="Riya Sharma" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full">Create Account</Button>
                </form>
            </CardContent>
             <CardFooter className="flex justify-center text-sm">
                <p>Already have an account?&nbsp;</p>
                <Link href="/sign-in" className="text-primary hover:underline">
                    Sign In
                </Link>
            </CardFooter>
        </Card>
    </div>
  );
}
