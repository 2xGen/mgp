"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { isLoading: isAuthLoading, user } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push("/");
    }
  }, [isAuthLoading, user, router]);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not start Google sign-in.";
      console.error("Authentication failed:", error);
      toast({
        title: "Authentication Failed",
        description: message,
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const showLoader = isAuthLoading || isConnecting;

  if (!isAuthLoading && user) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card className="w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">MyGoProfile</span>
            </div>
            <CardTitle className="font-headline text-3xl">Sign in</CardTitle>
            <CardDescription>
              Create your account or sign in with Google. You&apos;ll connect your
              Business Profile after signup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleSignIn}
              disabled={showLoader}
              className="w-full"
              size="lg"
            >
              {showLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Continue with Google"
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              <Link
                href="/"
                className="font-semibold text-primary hover:underline"
              >
                Back to Home
              </Link>
            </p>
            <Separator />
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="font-semibold text-primary hover:underline"
              >
                Terms of Service
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
