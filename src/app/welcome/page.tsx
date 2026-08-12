"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, LogOut, Link2, BarChart3, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startFreeTrial, claimTeamInvite } from "../actions";
import { Logo } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Link2,
    title: "Connect your profile",
    description: "Link your Google Business Profile securely.",
  },
  {
    icon: BarChart3,
    title: "See your data",
    description: "Views, searches, calls, reviews — in one place.",
  },
  {
    icon: Sparkles,
    title: "Improve your presence",
    description: "Clear next steps for what to fix and grow.",
  },
] as const;

const plans = [
  {
    id: "starter" as const,
    name: "Starter",
    blurb: "€29/mo · 1 location · improve your Google presence",
  },
  {
    id: "growth" as const,
    name: "Growth",
    blurb: "€49/mo · up to 3 locations · most popular",
  },
  {
    id: "enterprise" as const,
    name: "Agency",
    blurb: "€99/mo · up to 10 locations · multiple business profiles",
  },
];

export default function WelcomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "growth" | "enterprise">(
    "starter"
  );
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [showTeamJoin, setShowTeamJoin] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "there";

  const handleStartTrial = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading("trial");
    const result = await startFreeTrial(user.id, selectedPlan);

    if (result.error) {
      toast({
        title: "Could not start trial",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(null);
      return;
    }

    toast({
      title: "You're in",
      description: "14-day free trial started. Next: connect your Google Business Profile.",
    });
    // GBP connect route is next after trial.
    window.location.href = "/connect-google";
  };

  const handleClaimInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode) return;

    setIsLoading("claim");
    const result = await claimTeamInvite(user.id, inviteCode);
    if (result.success) {
      toast({
        title: "Joined team",
        description: "Redirecting to your dashboard…",
      });
      window.location.href = "/dashboard";
    } else {
      toast({
        title: "Could not join",
        description: result.error || "Check the invite code and try again.",
        variant: "destructive",
      });
      setIsLoading(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="hero-pattern absolute inset-0 -z-10 opacity-40" />

      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex items-center justify-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MyGoProfile</span>
          </div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
            Welcome, {displayName}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Get more from your Google Business Profile — start free, no card
            required.
          </p>
        </div>

        <ol className="mb-8 space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">
                  <span className="text-muted-foreground">{index + 1}. </span>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border bg-background/80 p-6 shadow-sm backdrop-blur">
          <Button
            className="w-full px-6 py-6 text-base font-semibold"
            size="lg"
            onClick={handleStartTrial}
            disabled={!!isLoading}
          >
            {isLoading === "trial" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Start free trial
          </Button>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            14 days free · {plans.find((p) => p.id === selectedPlan)?.name} plan ·
            change anytime
          </p>

          <Collapsible open={showPlanPicker} onOpenChange={setShowPlanPicker}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="mt-2 w-full text-sm" disabled={!!isLoading}>
                {showPlanPicker ? "Hide plans" : "Choose a different plan size"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">{plan.blurb}</p>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Collapsible open={showTeamJoin} onOpenChange={setShowTeamJoin}>
          <CollapsibleTrigger asChild>
            <Button variant="link" className="mx-auto mt-6 flex text-sm" disabled={!!isLoading}>
              Have a team invite code?
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-2xl border bg-background/80 p-5">
            <form onSubmit={handleClaimInvite} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite code</Label>
                <Input
                  id="invite-code"
                  placeholder="Enter code…"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  disabled={!!isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!inviteCode || !!isLoading}
              >
                {isLoading === "claim" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Join team
              </Button>
            </form>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-8 text-center">
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
