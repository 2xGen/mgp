"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { deleteMedia, fetchMedia } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Terminal, Camera, Eye, Video, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UploadPhotoForm from "./upload-photo-form";

interface MediaListProps {
  locationName: string;
}

interface Attribution {
  profileName: string;
  profileUrl: string;
}

interface MediaItem {
  name: string;
  mediaFormat: "PHOTO" | "VIDEO";
  googleUrl: string;
  thumbnailUrl: string;
  createTime: string;
  insights: {
    viewCount: string;
  };
  attribution: Attribution;
}

interface MediaData {
  mediaItems: MediaItem[];
  nextPageToken?: string;
  totalMediaItemCount?: number;
}

function dedupeMedia(items: MediaItem[]): MediaItem[] {
  const byName = new Map<string, MediaItem>();
  for (const item of items) {
    if (item?.name) byName.set(item.name, item);
  }
  return Array.from(byName.values());
}

export default function MediaList({ locationName }: MediaListProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fetchGenRef = useRef(0);

  const uniqueMedia = useMemo(() => dedupeMedia(mediaItems), [mediaItems]);

  const getMedia = useCallback(
    async (token?: string) => {
      if (!locationName) return;

      const gen = token ? fetchGenRef.current : ++fetchGenRef.current;

      if (token) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
        setMediaItems([]);
        setNextPageToken(undefined);
      }

      try {
        const result = await fetchMedia(locationName, token);
        // Ignore stale first-page responses (Strict Mode / HMR / fast tab switches).
        if (!token && gen !== fetchGenRef.current) return;

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          const data: MediaData = result.data;
          const incoming = data.mediaItems || [];
          setMediaItems((prev) => dedupeMedia(token ? [...prev, ...incoming] : incoming));
          setNextPageToken(data.nextPageToken);
          if (!token && data.totalMediaItemCount) {
            setTotalCount(data.totalMediaItemCount);
          }
        }
      } catch (e: unknown) {
        if (!token && gen !== fetchGenRef.current) return;
        setError(e instanceof Error ? e.message : "Failed to fetch media.");
      } finally {
        if (!token && gen !== fetchGenRef.current) return;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [locationName]
  );

  useEffect(() => {
    void getMedia();
    return () => {
      // Invalidate in-flight first-page fetches on unmount / location change.
      fetchGenRef.current += 1;
    };
  }, [getMedia]);

  const handlePhotoUploaded = (newMediaItem: MediaItem) => {
    setMediaItems((prev) => dedupeMedia([newMediaItem, ...prev]));
    if (totalCount !== null) {
      setTotalCount(totalCount + 1);
    }
  };

  const handleLoadMore = () => {
    if (nextPageToken) {
      void getMedia(nextPageToken);
    }
  };

  const handleDeleteMedia = async (mediaName: string) => {
    const result = await deleteMedia(mediaName);
    if (result.error) {
      toast({
        title: "Error",
        description: `Failed to delete media: ${result.error}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Media item deleted successfully.",
      });
      setMediaItems((currentItems) => currentItems.filter((item) => item.name !== mediaName));
      if (totalCount) {
        setTotalCount(totalCount - 1);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 p-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching media...</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="m-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </AlertDescription>
        </Alert>
      );
    }

    if (uniqueMedia.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No media items found for this location.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {uniqueMedia.map((item) => (
          <div key={item.name} className="group relative aspect-square">
            <a
              href={item.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full overflow-hidden rounded-lg"
            >
              <Image
                src={item.thumbnailUrl || item.googleUrl}
                alt="Location media"
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.mediaFormat === "VIDEO" && (
                <div className="absolute left-2 top-2 rounded-full bg-black/50 p-1.5 text-white">
                  <Video className="h-4 w-4" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-2 text-white">
                {item.attribution && (
                  <a
                    href={item.attribution.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-medium hover:underline"
                  >
                    {item.attribution.profileName}
                  </a>
                )}
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Eye className="h-3 w-3" />
                  <span>{Number(item.insights?.viewCount || 0).toLocaleString()} views</span>
                </div>
              </div>
            </a>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this media from your
                    Google Business Profile.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteMedia(item.name)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <CardTitle>Photos & Videos</CardTitle>
          </div>
          <CardDescription>
            {totalCount !== null
              ? `Showing ${uniqueMedia.length} of ${totalCount} media items.`
              : "Media items for this location."}
          </CardDescription>
        </div>
        <UploadPhotoForm locationName={locationName} onPhotoUploaded={handlePhotoUploaded} />
      </CardHeader>
      <CardContent className="p-0">{renderContent()}</CardContent>
      {nextPageToken && (
        <CardFooter>
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="mt-4 w-full"
            variant="outline"
          >
            {isLoadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load More
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
