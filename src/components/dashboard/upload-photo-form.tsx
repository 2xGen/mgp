
"use client";

import { useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadPhotoFormProps {
  locationName: string;
  onPhotoUploaded: (newMediaItem: any) => void;
}

const formSchema = z.object({
  photo: z.any()
    .refine(files => files?.length === 1, "Photo is required.")
    .refine(files => files?.[0]?.size >= 10 * 1024, "Photo must be at least 10KB.")
    .refine(files => files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
    .refine(
      files => ["image/jpeg", "image/png"].includes(files?.[0]?.type),
      ".jpg and .png files are accepted."
    ),
  description: z.string().max(2048, "Description cannot exceed 2048 characters.").optional(),
});

type PhotoFormValues = z.infer<typeof formSchema>;

export default function UploadPhotoForm({ locationName, onPhotoUploaded }: UploadPhotoFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  const onSubmit = async (values: PhotoFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const file = values.photo?.[0] as File | undefined;
    if (!file) {
      setError("Photo is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("locationName", locationName);
      formData.append("description", values.description || "");

      const res = await fetch("/api/google/media/upload", {
        method: "POST",
        body: formData,
      });

      let payload: { error?: string; data?: unknown } = {};
      try {
        payload = await res.json();
      } catch {
        throw new Error(
          res.ok
            ? "Upload failed (invalid server response)."
            : `Upload failed (HTTP ${res.status}). Refresh the page and try again.`
        );
      }

      if (!res.ok || payload.error) {
        throw new Error(payload.error || `Upload failed (HTTP ${res.status}).`);
      }
      if (!payload.data) {
        throw new Error("Upload succeeded but Google returned no media item. Refresh and try again.");
      }

      onPhotoUploaded(payload.data);
      toast({
        title: "Success",
        description: "Your photo has been uploaded.",
      });
      setIsDialogOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setError(null);
      setPreview(null);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload a New Photo</DialogTitle>
          <DialogDescription>
            Add a new photo to your business profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleFileChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {preview && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Describe your photo..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Upload Error</AlertTitle>
                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !preview}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


    