"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { VARIANT_LABELS } from "@/lib/variant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { Cluster } from "@/lib/types";
import { exportRedditClusterResults } from "@/lib/export";

// 키워드 기반 색상 매핑 (인덱스 순환)
const termColorClasses = [
  "bg-green-100 text-green-800 border-green-300",
  "bg-blue-100 text-blue-800 border-blue-300",
  "bg-purple-100 text-purple-800 border-purple-300",
  "bg-orange-100 text-orange-800 border-orange-300",
  "bg-cyan-100 text-cyan-800 border-cyan-300",
  "bg-pink-100 text-pink-800 border-pink-300",
];

export default function ClustersPage() {
    const { clusters, redditPosts, variant } = useStore();
    const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
    const variantLabel = VARIANT_LABELS[variant];

    const handleExportCluster = (cluster: Cluster) => {
        const clusterPosts = redditPosts.filter((p) => p.cluster_id === cluster.cluster_id);
        exportRedditClusterResults(clusterPosts);
        toast.success("Cluster exported");
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Clustering Results"
                description={`${variantLabel}: ${clusters.length} intent-based clusters from Reddit data`}
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
                                className="group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[#A50034]/10 hover:-translate-y-1 hover:border-[#A50034]/30 bg-white"
                                onClick={() => setSelectedCluster(cluster)}
                            >
                                <CardHeader className="relative">
                                    {/* 호버 시 보이는 아이콘 */}
                                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A50034] text-white">
                                            <Eye className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base mb-1 group-hover:text-[#A50034] transition-colors duration-300">{cluster.cluster_label}</CardTitle>
                                            <p className="text-xs text-muted-foreground">클러스터 #{cluster.cluster_id}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="w-fit mt-2 group-hover:bg-[#A50034]/10 group-hover:text-[#A50034] transition-colors duration-300">
                                        {cluster.post_count} posts
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cluster.top_terms.slice(0, 6).map((term, i) => (
                                            <Badge 
                                                key={i} 
                                                variant="outline" 
                                                className={`text-xs transition-all duration-300 group-hover:scale-105 ${termColorClasses[i % termColorClasses.length]}`}
                                            >
                                                {term}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center text-[#A50034] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-sm font-medium">자세히 보기</span>
                                        <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </div>
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
                                            <Badge 
                                                key={i} 
                                                variant="outline"
                                                className={termColorClasses[i % termColorClasses.length]}
                                            >
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
