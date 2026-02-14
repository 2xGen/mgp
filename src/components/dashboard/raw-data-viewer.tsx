
"use client";

import { useEffect, useState } from "react";
import { fetchAccounts } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function RawDataViewer() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAccounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchAccounts();
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };
    getAccounts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Account Data</CardTitle>
        <CardDescription>
          This is the raw JSON data of the business accounts associated with your Google account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching account data...</span>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {data && (
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
