"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { Loader2, Link2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

function ConnectGoogleContent() {
  const { user, isLoading, subscription, isSubscriptionLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [starting, setStarting] = useState(false);
  const error = searchParams.get("error");

  useEffect(() => {
    if (isLoading || isSubscriptionLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!subscription) {
      router.replace("/welcome");
    }
  }, [user, isLoading, subscription, isSubscriptionLoading, router]);

  const errorMessage = (() => {
    switch (error) {
      case "missing_refresh_token":
        return "Google did not return a refresh token. Revoke MyGoProfile access in your Google Account permissions, then try again.";
      case "invalid_state":
        return "Security check failed. Please try connecting again.";
      case "token_exchange_failed":
        return "Could not complete Google connection. Check OAuth client settings and try again.";
      case "access_denied":
        return "You declined Google access. We need Business Profile permission to show your data.";
      default:
        return error ? `Connection error: ${error}` : null;
    }
  })();

  if (isLoading || isSubscriptionLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">MyGoProfile</span>
        </div>

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Link2 className="h-7 w-7" />
        </div>

        <h1 className="font-headline text-3xl font-semibold tracking-tight">
          Connect your Google Business Profile
        </h1>
        <p className="mt-3 text-muted-foreground">
          This is separate from signing in. We use Google&apos;s official access
          so we can show performance, reviews, and profile data — without your
          password.
        </p>

        <ul className="mt-6 space-y-3 text-left text-sm text-muted-foreground">
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            Read performance, reviews, and profile details
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            Reply to reviews and publish posts when you choose
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
            You can disconnect anytime from settings
          </li>
        </ul>

        {errorMessage && (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button
          className="mt-8 w-full py-6 text-base font-semibold"
          size="lg"
          disabled={starting}
          onClick={() => {
            setStarting(true);
            window.location.href = "/api/google/start";
          }}
        >
          {starting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          Connect with Google
        </Button>

        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/dashboard" className="text-primary hover:underline">
            Skip for now
          </Link>
          {" · "}
          you can connect later from the dashboard
        </p>
      </div>
    </div>
  );
}

export default function ConnectGooglePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConnectGoogleContent />
    </Suspense>
  );
}
