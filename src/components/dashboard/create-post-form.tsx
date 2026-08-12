"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription as FormHelperText,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Terminal, ImagePlus, Repeat, UploadCloud, Sparkles } from "lucide-react";
import { createLocalPost, fetchMedia } from "@/app/actions";
import { generateGooglePost } from "@/ai/flows/generate-google-post-flow";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/app/dashboard/dashboard-provider";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CreatePostFormProps {
  locationName: string;
  onPostCreated: (newPost: any) => void;
}

interface MediaItem {
  name: string;
  mediaFormat: "PHOTO" | "VIDEO";
  googleUrl: string;
  thumbnailUrl: string;
}

const formSchema = z.object({
  summary: z
    .string()
    .min(1, "Post content cannot be empty.")
    .max(1500, "Post content cannot exceed 1500 characters."),
});

type PostFormValues = z.infer<typeof formSchema>;

export default function CreatePostForm({ locationName, onPostCreated }: CreatePostFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recurringWeekly, setRecurringWeekly] = useState(false);
  const [topicHint, setTopicHint] = useState("");
  const { toast } = useToast();
  const { selectedLocation } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: "",
    },
  });

  useEffect(() => {
    if (!isDialogOpen) return;
    const getMedia = async () => {
      setIsMediaLoading(true);
      const result = await fetchMedia(locationName);
      if (result.success && result.data.mediaItems) {
        const photos = result.data.mediaItems.filter(
          (item: MediaItem) => item.mediaFormat === "PHOTO"
        );
        setMediaItems(photos);
      } else {
        console.error("Failed to load media for post creation.");
      }
      setIsMediaLoading(false);
    };
    void getMedia();
  }, [isDialogOpen, locationName]);

  const handleUploadPhoto = async (file: File) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please upload a JPG or PNG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB.");
      return;
    }
    if (file.size < 10 * 1024) {
      setError("Photo must be at least 10KB (Google requirement).");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Local posts require media.sourceUrl (Google does not accept dataRef on posts).
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/google/media/prepare-url", {
        method: "POST",
        body: formData,
      });

      let payload: { error?: string; sourceUrl?: string } = {};
      try {
        payload = await res.json();
      } catch {
        throw new Error(
          res.ok
            ? "Upload failed (invalid server response)."
            : `Upload failed (HTTP ${res.status}). Refresh the page and try again.`
        );
      }

      if (!res.ok || payload.error || !payload.sourceUrl) {
        throw new Error(payload.error || "Failed to prepare photo URL for Google.");
      }

      const previewUrl = URL.createObjectURL(file);
      const uploaded: MediaItem = {
        name: `pending:${payload.sourceUrl}`,
        mediaFormat: "PHOTO",
        googleUrl: payload.sourceUrl,
        thumbnailUrl: previewUrl,
      };

      setMediaItems((prev) => [uploaded, ...prev.filter((m) => !m.name.startsWith("pending:"))]);
      setSelectedMediaUrl(payload.sourceUrl);
      toast({
        title: "Photo ready",
        description: "Attached to this post. Publish when you're ready.",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const details = selectedLocation?.details;
      const result = await generateGooglePost({
        businessName: details?.title || "our business",
        category: details?.categories?.primaryCategory?.displayName,
        description: details?.profile?.description,
        locality: details?.storefrontAddress?.locality,
        tone: "friendly",
        topicHint: topicHint.trim() || undefined,
      });
      form.setValue("summary", result.summary, { shouldValidate: true });
      toast({
        title: "Draft ready",
        description: "Edit if you like, then publish to Google.",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not generate a post.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const media = selectedMediaUrl ? [{ sourceUrl: selectedMediaUrl }] : undefined;
    const result = await createLocalPost(
      locationName,
      values.summary,
      media,
      recurringWeekly
        ? { recurringWeekly: true, weeks: 8, eventTitle: values.summary.slice(0, 58) }
        : undefined
    );

    if (!result || result.error) {
      setError(result?.error || "Failed to create post. Refresh the page and try again.");
    } else {
      onPostCreated(result.data);
      setIsDialogOpen(false);
      form.reset();
      setSelectedMediaUrl(null);
      setRecurringWeekly(false);
      setTopicHint("");
      toast({
        title: "Success",
        description: recurringWeekly
          ? "Your weekly recurring post has been created on Google."
          : "Your post has been successfully created.",
      });
    }
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting || isUploading || isGenerating) return;
    setIsDialogOpen(open);
    if (!open) {
      setError(null);
      form.reset();
      setSelectedMediaUrl(null);
      setRecurringWeekly(false);
      setTopicHint("");
      setMediaItems([]);
    }
  };

  const busy = isSubmitting || isUploading || isGenerating;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Draft with AI, attach a photo, and publish — or write it yourself.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                AI draft
              </div>
              <Input
                placeholder="Optional topic (e.g. weekend special, new menu)"
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
                disabled={busy}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={busy}
                onClick={() => void handleGenerateAi()}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Write with AI
              </Button>
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Post Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="What's new with your business?"
                      className="resize-none"
                      disabled={busy}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="recurring-weekly" className="font-medium">
                    Repeat weekly
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Publishes as a Google event post every week for 8 weeks (same day each week).
                </p>
              </div>
              <Switch
                id="recurring-weekly"
                checked={recurringWeekly}
                onCheckedChange={setRecurringWeekly}
                disabled={busy}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <FormItem className="space-y-0">
                  <FormLabel>Attach a Photo (Optional)</FormLabel>
                  <FormHelperText>
                    Google posts need a public image URL. Upload a new photo or pick one from your profile.
                  </FormHelperText>
                </FormItem>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUploadPhoto(file);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-40 w-full rounded-md border">
                <div className="p-4">
                  {isMediaLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : mediaItems.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {mediaItems.map((item) => (
                        <button
                          type="button"
                          key={item.name}
                          disabled={busy}
                          onClick={() =>
                            setSelectedMediaUrl(
                              item.googleUrl === selectedMediaUrl ? null : item.googleUrl
                            )
                          }
                          className={cn(
                            "relative aspect-square overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            selectedMediaUrl === item.googleUrl &&
                              "ring-2 ring-primary ring-offset-2"
                          )}
                        >
                          <Image
                            src={item.thumbnailUrl || item.googleUrl}
                            alt="media thumbnail"
                            fill
                            unoptimized={
                              item.thumbnailUrl?.startsWith("blob:") ||
                              item.name.startsWith("pending:")
                            }
                            className="object-cover"
                          />
                          {selectedMediaUrl === item.googleUrl && (
                            <div className="absolute inset-0 bg-primary/50" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
                      <ImagePlus className="mb-2 h-8 w-8" />
                      <p className="text-sm font-semibold">No photos yet</p>
                      <p className="mt-1 text-xs">Upload one above to attach it to this post.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap">{error}</pre>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={busy}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={busy}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {recurringWeekly ? "Publish weekly" : "Publish Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
