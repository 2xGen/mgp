
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, ArrowRight, LogOut, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { startFreeTrial, claimTeamInvite } from '../actions';
import { Logo } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';

const starterFeatures = [
    "1 Location",
    "1 Team Member",
    "AI-Powered Review Replies",
    "Local SEO Insights & Recommendations",
];

const growthFeatures = [
    "3 Locations",
    "3 Team Members",
    "All Starter Features",
    "Multi-Location Leaderboard",
    "Advanced Performance Analytics",
];

const enterpriseFeatures = [
    "Up to 10 Locations",
    "Up to 5 Team Members",
    "All Growth Features",
    "Early Access to New Features",
];


export default function WelcomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState('');

  const handleStartTrial = async (planId: 'starter' | 'growth' | 'enterprise') => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsLoading(planId);
    
    const result = await startFreeTrial(user.uid, planId);
    
    if (result.error) {
       toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
        });
        setIsLoading(null);
    } else {
        toast({
            title: "Trial Started!",
            description: "Your 14-day free trial has begun. Redirecting to your dashboard...",
        });
        window.location.href = '/dashboard';
    }
  };

  const handleClaimInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode) return;

    setIsLoading('claim');

    const result = await claimTeamInvite(user.uid, inviteCode);
    if (result.success) {
        toast({
            title: "Success!",
            description: "You have joined the team. Redirecting you to the dashboard...",
        });
        window.location.href = '/dashboard';
    } else {
        toast({
            title: "Error",
            description: result.error || "Could not claim invite. Please check the code and try again.",
            variant: "destructive",
        });
        setIsLoading(null);
    }
  }

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };


  if (!user) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-muted/40 flex items-center justify-center p-4">
        <div className="max-w-7xl w-full">
            <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex items-center justify-center gap-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">MyGoProfile</span>
                </div>
                <h1 className="font-headline text-4xl font-semibold tracking-tight">Welcome, {user.displayName}!</h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    To get started, select a plan to start your 14-day free trial, or join a team if you have an invite code.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Starter Plan */}
                <Card className="shadow-lg h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Starter</CardTitle>
                        <CardDescription>For single-location businesses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-grow">
                        <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold">$29</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <ul className="space-y-3">
                            {starterFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-brand-green" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={() => handleStartTrial('starter')}
                            disabled={!!isLoading}
                        >
                            {isLoading === 'starter' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Start 14-Day Free Trial
                        </Button>
                    </CardFooter>
                </Card>

                {/* Growth Plan */}
                <Card className="border-primary shadow-2xl shadow-primary/20 h-full flex flex-col">
                     <CardHeader>
                        <CardTitle className="font-headline text-3xl">Growth</CardTitle>
                        <CardDescription>For agencies & multi-location businesses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-grow">
                        <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold">$49</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <ul className="space-y-3">
                            {growthFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-brand-green" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={() => handleStartTrial('growth')}
                            disabled={!!isLoading}
                        >
                            {isLoading === 'growth' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Start 14-Day Free Trial
                        </Button>
                    </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="shadow-lg h-full flex flex-col">
                     <CardHeader>
                         <div className="flex justify-between items-center">
                            <CardTitle className="font-headline text-3xl">Enterprise</CardTitle>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Best Value</Badge>
                        </div>
                        <CardDescription>For agencies and businesses ready to scale.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-grow">
                        <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold">$99</span>
                            <span className="text-muted-foreground">/ month</span>
                        </div>
                        <ul className="space-y-3">
                            {enterpriseFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={() => handleStartTrial('enterprise')}
                            disabled={!!isLoading}
                        >
                            {isLoading === 'enterprise' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Start 14-Day Free Trial
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            
            <div className="relative my-8">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-muted/40 px-2 text-sm text-muted-foreground">OR</span>
            </div>

            <Card className="max-w-md mx-auto">
                 <CardHeader>
                    <CardTitle>Join a Team</CardTitle>
                    <CardDescription>If you received an invite code, enter it here to join your team.</CardDescription>
                </CardHeader>
                <form onSubmit={handleClaimInvite}>
                    <CardContent className="space-y-2">
                        <Label htmlFor="invite-code">Invite Code</Label>
                        <Input 
                            id="invite-code" 
                            placeholder="Enter code..."
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            disabled={!!isLoading}
                            required
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={!inviteCode || !!isLoading}>
                            {isLoading === 'claim' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            Join Team
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="text-center mt-8">
                <Button variant="link" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Button>
            </div>
        </div>
    </div>
  );
}

    