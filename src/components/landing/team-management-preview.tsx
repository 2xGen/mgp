'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, UserPlus, Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

const teamMembers = [
    { name: 'Sarah Lee', email: 'sarah@example.com', locations: ['Downtown', 'Beachfront'] },
    { name: 'Mike Chen', email: 'mike@example.com', locations: ['Midtown'] },
];

const availableLocations = [
    { id: 'loc1', title: 'Sunset Cafe - Downtown' },
    { id: 'loc2', title: 'Sunset Cafe - Beachfront' },
];

export default function TeamManagementPreview() {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div className="order-2 min-w-0">
             <Card className="shadow-xl shadow-primary/10">
                <CardHeader>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                         <div>
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Users className="h-5 w-5" />
                              MyGoProfile Team
                            </CardTitle>
                            <CardDescription>Users added to your team in this app.</CardDescription>
                         </div>
                        <Button variant="outline" size="sm" className="shrink-0">
                          <UserPlus className="mr-2 h-4 w-4"/> Invite
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {teamMembers.map(member => (
                        <div key={member.email} className="flex flex-col items-start gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {member.locations.map(loc => <Badge key={loc} variant="secondary">{loc}</Badge>)}
                            </div>
                        </div>
                    ))}
                    <Card className="border-primary/20 bg-primary/[0.04]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Assign Locations</CardTitle>
                            <CardDescription>Select locations for olivia@example.com.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-muted-foreground">Only locations the user has access to on Google are shown.</p>
                             {availableLocations.map(loc => (
                                <div key={loc.id} className="flex items-center space-x-2">
                                    <Checkbox id={`check-${loc.id}`} defaultChecked={loc.id === 'loc1'} />
                                    <Label htmlFor={`check-${loc.id}`} className="font-normal">{loc.title}</Label>
                                </div>
                            ))}
                        </CardContent>
                         <CardFooter>
                            <Button className="w-full" onClick={() => setIsAdded(true)} disabled={isAdded}>
                                {isAdded ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Added to Team
                                    </>
                                ) : (
                                    "Add to Team"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>
        </div>

        <div className="order-1 flex flex-col items-start gap-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Team
            </div>
            <h2 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
                Build your team{' '}
                <span className="bg-gradient-brand animate-gradient-flow bg-[length:400%_400%] bg-clip-text text-transparent">
                  in minutes
                </span>
            </h2>
            <p className="text-lg text-muted-foreground">
                Invite teammates, assign them to specific locations, and let them handle reviews and updates without sharing your Google login.
            </p>
             <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                       <Check className="h-5 w-5" />
                    </div>
                    <span className="pt-1">Invite users who already have Google access to your profiles.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                       <Check className="h-5 w-5" />
                    </div>
                    <span className="pt-1">Assign them to one or multiple locations you manage.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-green/10 text-brand-green">
                       <Check className="h-5 w-5" />
                    </div>
                    <span className="pt-1">Empower your team to handle reviews and updates securely.</span>
                </li>
              </ul>
              <Link href="/login" className="mt-2">
                <Button size="lg" variant="outline">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
    </div>
  );
}
