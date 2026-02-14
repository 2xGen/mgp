
"use client";

import { useEffect, useState } from "react";
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
import { Loader2, PlusCircle, Terminal, ImagePlus } from "lucide-react";
import { createLocalPost, fetchMedia } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CreatePostFormProps {
  locationName: string;
  onPostCreated: (newPost: any) => void;
}

interface MediaItem {
  name: string;
  mediaFormat: 'PHOTO' | 'VIDEO';
  googleUrl: string;
  thumbnailUrl: string;
}

const formSchema = z.object({
  summary: z.string().min(1, "Post content cannot be empty.").max(1500, "Post content cannot exceed 1500 characters."),
});

type PostFormValues = z.infer<typeof formSchema>;

export default function CreatePostForm({ locationName, onPostCreated }: CreatePostFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
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
    if (isDialogOpen) {
      const getMedia = async () => {
        setIsMediaLoading(true);
        const result = await fetchMedia(locationName);
        if (result.success && result.data.mediaItems) {
            // Filter for photos only
            const photos = result.data.mediaItems.filter((item: MediaItem) => item.mediaFormat === 'PHOTO');
            setMediaItems(photos);
        } else {
          // You might want to show a small error message here instead of a toast
          console.error("Failed to load media for post creation.");
        }
        setIsMediaLoading(false);
      };
      getMedia();
    }
  }, [isDialogOpen, locationName]);

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const media = selectedMediaUrl ? [{ sourceUrl: selectedMediaUrl }] : undefined;
    const result = await createLocalPost(locationName, values.summary, media);

    if (result.error) {
      setError(result.error);
    } else {
      onPostCreated(result.data);
      setIsDialogOpen(false);
      form.reset();
      setSelectedMediaUrl(null);
      toast({
        title: "Success",
        description: "Your post has been successfully created.",
      });
    }
    setIsSubmitting(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) return;
    setIsDialogOpen(open);
    if (!open) {
      setError(null);
      form.reset();
      setSelectedMediaUrl(null);
      setMediaItems([]);
    }
  }

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
            Write your post content below. You can optionally add one photo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
                <FormItem>
                    <FormLabel>Attach a Photo (Optional)</FormLabel>
                    <FormHelperText>
                        If your desired photo isn't listed, upload it in the "Photos &amp; Videos" section first.
                    </FormHelperText>
                </FormItem>
                 <ScrollArea className="h-40 w-full rounded-md border">
                    <div className="p-4">
                        {isMediaLoading ? (
                             <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : mediaItems.length > 0 ? (
                             <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {mediaItems.map(item => (
                                    <button 
                                        type="button"
                                        key={item.name}
                                        onClick={() => setSelectedMediaUrl(item.googleUrl === selectedMediaUrl ? null : item.googleUrl)}
                                        className={cn(
                                            "relative aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            selectedMediaUrl === item.googleUrl && "ring-2 ring-primary ring-offset-2"
                                        )}
                                    >
                                        <Image src={item.thumbnailUrl || item.googleUrl} alt="media thumbnail" fill className="object-cover"/>
                                        {selectedMediaUrl === item.googleUrl && <div className="absolute inset-0 bg-primary/50" />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                                <ImagePlus className="h-8 w-8 mb-2"/>
                                <p className="text-sm font-semibold">No photos found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
