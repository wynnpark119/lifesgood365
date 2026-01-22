"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Cluster } from "@/lib/types";
import { exportRedditClusterResults } from "@/lib/export";

export default function ClustersPage() {
    const { clusters, redditPosts, setClusters } = useStore();
    const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

    const handleExportCluster = (cluster: Cluster) => {
        const clusterPosts = redditPosts.filter((p) => p.cluster_id === cluster.cluster_id);
        exportRedditClusterResults(clusterPosts);
        toast.success("Cluster exported");
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Clustering Results"
                description={`${clusters.length} AI-generated topic clusters from Reddit data`}
            />

            <div className="space-y-6 p-8">

                {/* Cluster Grid */}
                {clusters.length === 0 ? (
                    <Card>
                        <CardContent className="flex h-64 items-center justify-center">
                            <p className="text-muted-foreground">
                                No clusters available. Please check data loading.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {clusters.map((cluster) => (
                            <Card
                                key={cluster.cluster_id}
                                className="cursor-pointer transition-shadow hover:shadow-lg"
                                onClick={() => setSelectedCluster(cluster)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base mb-1">{cluster.cluster_label}</CardTitle>
                                            <p className="text-xs text-muted-foreground">클러스터 #{cluster.cluster_id}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="w-fit mt-2">
                                        {cluster.post_count} posts
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1">
                                        {cluster.top_terms.slice(0, 6).map((term, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {term}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button
                                        variant="link"
                                        className="mt-4 h-auto p-0 text-[#A50034]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCluster(cluster);
                                        }}
                                    >
                                        View Details →
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Cluster Detail Dialog */}
            <Dialog open={!!selectedCluster} onOpenChange={() => setSelectedCluster(null)}>
                <DialogContent className="max-w-2xl">
                    {selectedCluster && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedCluster.cluster_label}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Top Terms</Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedCluster.top_terms.map((term, i) => (
                                            <Badge key={i} variant="secondary">
                                                {term}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label>Representative Posts ({selectedCluster.representative_posts.length})</Label>
                                    <div className="mt-2 space-y-2">
                                        {selectedCluster.representative_posts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="rounded-lg border p-3 text-sm hover:bg-muted/50"
                                            >
                                                <p className="font-medium">{post.title}</p>
                                                <p className="text-xs text-muted-foreground">{post.subreddit}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
