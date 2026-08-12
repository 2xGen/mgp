
"use client";

import { useEffect, useState, useCallback } from "react";
import { deleteLocalPost, fetchLocalPosts } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Terminal, PenSquare, Calendar, Image as ImageIcon, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import CreatePostForm from "./create-post-form";
import { useToast } from "@/hooks/use-toast";

interface LocalPostsListProps {
    locationName: string;
}

interface PostMedia {
    googleUrl: string;
}

interface LocalPost {
    name: string;
    languageCode: string;
    summary: string;
    searchUrl: string;
    state: 'LIVE' | 'PROCESSING' | 'REJECTED';
    createTime: string;
    updateTime: string;
    topicType: 'STANDARD' | 'EVENT' | 'OFFER' | 'ALERT';
    media: PostMedia[];
}

interface LocalPostsData {
    localPosts: LocalPost[];
    nextPageToken?: string;
}

export default function LocalPostsList({ locationName }: LocalPostsListProps) {
    const [posts, setPosts] = useState<LocalPost[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const getPosts = useCallback(async (token?: string) => {
        if (!locationName) return;

        if (token) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
            setError(null);
            setPosts([]);
            setNextPageToken(undefined);
        }

        try {
            const result = await fetchLocalPosts(locationName, token);
            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                const data: LocalPostsData = result.data;
                const incoming = data.localPosts || [];
                // Replace on first page; merge+dedupe on pagination / Strict Mode double-fetch.
                setPosts((prev) => {
                  if (!token) {
                    const byName = new Map<string, LocalPost>();
                    for (const post of incoming) {
                      if (post?.name) byName.set(post.name, post);
                    }
                    return Array.from(byName.values());
                  }
                  const byName = new Map(prev.map((p) => [p.name, p]));
                  for (const post of incoming) {
                    if (post?.name) byName.set(post.name, post);
                  }
                  return Array.from(byName.values());
                });
                setNextPageToken(data.nextPageToken);
            }
        } catch (e: any) {
            setError(e.message || "Failed to fetch local posts.");
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [locationName]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    const handleLoadMore = () => {
        if (nextPageToken) {
            getPosts(nextPageToken);
        }
    };
    
    const handlePostCreated = (newPost: LocalPost) => {
        if (!newPost?.name) return;
        setPosts((prevPosts) => {
          if (prevPosts.some((p) => p.name === newPost.name)) return prevPosts;
          return [newPost, ...prevPosts];
        });
    };
    
    const handleDeletePost = async (postName: string) => {
        const result = await deleteLocalPost(postName);
        if (result.error) {
            toast({
                title: "Error",
                description: `Failed to delete post: ${result.error}`,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Post deleted successfully."
            });
            setPosts(currentPosts => currentPosts.filter(p => p.name !== postName));
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center gap-2 text-muted-foreground p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching posts...</span>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="m-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>API Error</AlertTitle>
                    <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                </Alert>
            );
        }

        if (posts.length === 0) {
            return (
                <div className="p-4 text-center text-muted-foreground">
                    No local posts found for this location.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {posts.map((post, index) => (
                    <Card key={post.name || `post-${index}`} className="h-full flex flex-col hover:shadow-lg transition-shadow relative group/post">
                         <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                     <Badge variant="secondary">{post.topicType}</Badge>
                                    <Badge variant={post.state === 'LIVE' ? 'default' : 'destructive'} className={post.state === 'LIVE' ? "bg-green-500" : ""}>{post.state}</Badge>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/post:opacity-100 transition-opacity">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the post from your Google Business Profile.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeletePost(post.name)} className="bg-destructive hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                             <a href={post.searchUrl} target="_blank" rel="noopener noreferrer" className="block space-y-4">
                                {post.media && post.media.length > 0 ? (
                                    <div className="relative aspect-video overflow-hidden rounded-lg">
                                        <Image
                                            src={post.media[0].googleUrl}
                                            alt={post.summary.substring(0, 50)}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center aspect-video bg-muted rounded-lg">
                                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                                <p className="text-sm text-foreground line-clamp-3">{post.summary}</p>
                            </a>
                        </CardContent>
                        <CardFooter>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Posted {formatDistanceToNow(new Date(post.createTime), { addSuffix: true })}</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                        <PenSquare className="h-5 w-5" />
                        <CardTitle>Local Posts</CardTitle>
                    </div>
                    <CardDescription>
                        {posts.length > 0 && !isLoading
                            ? `Your most recent post was ${formatDistanceToNow(new Date(posts[0].createTime), { addSuffix: true })}.`
                            : "Recent posts from your Google Business Profile."}
                    </CardDescription>
                </div>
                <CreatePostForm locationName={locationName} onPostCreated={handlePostCreated} />
            </CardHeader>
            <CardContent className="p-0">
                {renderContent()}
            </CardContent>
            {nextPageToken && (
                <CardFooter>
                     <Button 
                        onClick={handleLoadMore} 
                        disabled={isLoadingMore}
                        className="w-full mt-4"
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
