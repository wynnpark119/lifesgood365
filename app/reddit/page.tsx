"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { RedditPost } from "@/lib/types";

const POSTS_PER_PAGE = 30;

export default function RedditPage() {
    const { redditPosts, clusters, setRedditPosts } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [subredditFilter, setSubredditFilter] = useState("all");
    const [clusterFilter, setClusterFilter] = useState("all");
    const [selectedPost, setSelectedPost] = useState<RedditPost | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const subreddits = useMemo(() => {
        return Array.from(new Set(redditPosts.map((p) => p.subreddit)));
    }, [redditPosts]);

    const filteredPosts = useMemo(() => {
        return redditPosts
            .filter((post) => {
                const matchesSearch =
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.subreddit.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesSubreddit =
                    subredditFilter === "all" || post.subreddit === subredditFilter;
                const matchesCluster =
                    clusterFilter === "all" ||
                    (clusterFilter === "assigned" && post.cluster_id) ||
                    (clusterFilter === "unassigned" && !post.cluster_id);

                return matchesSearch && matchesSubreddit && matchesCluster;
            })
            .sort((a, b) => Number(a.no) - Number(b.no)); // 번호순 정렬
    }, [redditPosts, searchTerm, subredditFilter, clusterFilter]);

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    const handleToggleHighlight = (postId: string) => {
        setRedditPosts(
            redditPosts.map((p) =>
                p.id === postId ? { ...p, highlighted: !p.highlighted } : p
            )
        );
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Reddit Data"
                description={`Total ${filteredPosts.length} posts collected`}
            />

            <div className="space-y-6 p-8">
                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by title or subreddit..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-9"
                        />
                    </div>
                    <Select value={subredditFilter} onValueChange={(v) => { setSubredditFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Subreddit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subreddits</SelectItem>
                            {subreddits.map((sr) => (
                                <SelectItem key={sr} value={sr}>
                                    {sr}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={clusterFilter} onValueChange={(v) => { setClusterFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Cluster Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">No</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="w-32">Subreddit</TableHead>
                                <TableHead className="w-48">Detected Terms</TableHead>
                                <TableHead className="w-40">Cluster</TableHead>
                                <TableHead className="w-16">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPosts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No posts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedPosts.map((post) => (
                                    <TableRow
                                        key={post.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => setSelectedPost(post)}
                                    >
                                        <TableCell className="text-muted-foreground">{post.no}</TableCell>
                                        <TableCell>{post.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{post.subreddit}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {post.detected_terms.slice(0, 3).map((term, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {term}
                                                    </Badge>
                                                ))}
                                                {post.detected_terms.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{post.detected_terms.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {post.cluster_label ? (
                                                <Badge className="bg-[#A50034]">{post.cluster_label}</Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(post.url, "_blank");
                                                }}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1} to {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Sheet */}
            <Sheet open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                <SheetContent className="w-[500px]">
                    {selectedPost && (
                        <>
                            <SheetHeader>
                                <SheetTitle>{selectedPost.title}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                                <div>
                                    <Label>Subreddit</Label>
                                    <p className="mt-1">{selectedPost.subreddit}</p>
                                </div>
                                <div>
                                    <Label>Link</Label>
                                    <Button
                                        variant="link"
                                        className="mt-1 h-auto p-0"
                                        onClick={() => window.open(selectedPost.url, "_blank")}
                                    >
                                        Open in new tab
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                                <div>
                                    <Label>Detected Terms</Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedPost.detected_terms.length > 0 ? (
                                            selectedPost.detected_terms.map((term, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {term}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No terms detected</p>
                                        )}
                                    </div>
                                </div>
                                {clusters.length > 0 && (
                                    <div>
                                        <Label>Assign Cluster</Label>
                                        <Select
                                            value={selectedPost.cluster_id || ""}
                                            onValueChange={(value) => {
                                                const cluster = clusters.find((c) => c.cluster_id === value);
                                                setRedditPosts(
                                                    redditPosts.map((p) =>
                                                        p.id === selectedPost.id
                                                            ? {
                                                                ...p,
                                                                cluster_id: value,
                                                                cluster_label: cluster?.cluster_label,
                                                            }
                                                            : p
                                                    )
                                                );
                                                toast.success("Cluster assigned");
                                            }}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select cluster" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clusters.map((c) => (
                                                    <SelectItem key={c.cluster_id} value={c.cluster_id}>
                                                        {c.cluster_label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <Label>Mark as Highlight</Label>
                                    <Switch
                                        checked={selectedPost.highlighted}
                                        onCheckedChange={() => handleToggleHighlight(selectedPost.id)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
