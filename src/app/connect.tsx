
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup, getRedirectResult } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { setToken } from "./actions";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function ConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { isLoading: isAuthLoading, user } = useAuth();

  useEffect(() => {
    // This effect redirects an ALREADY logged-in user away from the login page.
    if (!isAuthLoading && user) {
        router.push('/');
    }
  }, [isAuthLoading, user, router]);


  const handleConnect = async () => {
    setIsConnecting(true);
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/business.manage");
    provider.addScope("https://www.googleapis.com/auth/plus.business.manage");
    
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          await setToken(credential.accessToken);
        }
        // On successful login, always redirect to the main page to let the RedirectManager take over.
        router.push('/');
    } catch (error: any) {
         if (error instanceof FirebaseError) {
          console.error("Authentication failed:", error);
          toast({
            title: "Authentication Failed",
            description: `Could not complete authentication. Error: ${error.message}`,
            variant: "destructive",
          });
        }
        setIsConnecting(false);
    }
  };
  
  // Show the loader if the main auth check is running, or if we are actively connecting.
  const showLoader = isAuthLoading || isConnecting;

  // Render nothing if a logged-in user is about to be redirected. This avoids a flash of the login page.
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
            <CardTitle className="font-headline text-3xl">Connect Your Account</CardTitle>
            <CardDescription>Use Google to sign in or create your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button onClick={handleConnect} disabled={showLoader} className="w-full" size="lg">
                {showLoader ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Continue with Google"
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-4 text-center">
            <p className="text-sm text-muted-foreground">
                <Link href="/" className="font-semibold text-primary hover:underline">
                    Back to Home
                </Link>
            </p>
             <Separator />
             <p className="text-sm text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="font-semibold text-primary hover:underline">
                    Terms of Service
                </Link>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
