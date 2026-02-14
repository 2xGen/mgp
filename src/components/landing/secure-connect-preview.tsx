
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Clock, Lock, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

const mockLocations = [
    { id: "loc1", title: "Sunset Cafe - Downtown" },
    { id: "loc2", title: "Sunset Cafe - Beachfront" },
    { id: "loc3", title: "Joe's Garage - Midtown" },
];

const trustPoints = [
    { icon: ShieldCheck, text: "Google-secured login only." },
    { icon: Clock, text: "No complicated setup — connect in 2 minutes." },
    { icon: Lock, text: "Your data is 100% private, never shared." },
];

export default function SecureConnectPreview() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
        <div className="flex flex-col items-start gap-6 md:order-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Secure & Simple
            </div>
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                Get Started in Minutes with <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">Peace of Mind</span>
            </h2>
            <p className="text-lg text-muted-foreground">
                Connecting your Google Business Profile is fast, easy, and secure. We use Google's own sign-in process, so your credentials are never shared with us. Your privacy is our top priority.
            </p>
             <ul className="space-y-4 text-muted-foreground">
                {trustPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-green/10 text-brand-green flex-shrink-0">
                            <point.icon className="h-5 w-5" />
                        </div>
                        <span className="pt-1">{point.text}</span>
                    </li>
                ))}
              </ul>
              <Link href="/pricing" className="mt-4 w-full">
                <Button size="lg" variant="outline" className="w-full">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
        <div className="shadow-2xl rounded-xl bg-card md:order-1">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Manage Your Locations</CardTitle>
                    <CardDescription>Select the business locations you want to manage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockLocations.map((location, index) => (
                        <div key={location.id} className="flex items-center space-x-3 rounded-md border p-4">
                             <Checkbox id={location.id} defaultChecked={index < 2} />
                             <Label htmlFor={location.id} className="font-normal flex-grow cursor-pointer">
                                {location.title}
                            </Label>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex-col gap-4 items-stretch">
                    <Button size="lg" className="w-full" onClick={() => setIsConnected(true)} disabled={isConnected}>
                        {isConnected ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Connected
                            </>
                        ) : (
                            "Connect with Google"
                        )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">You will be redirected to Google to authenticate.</p>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
