import { RedditPost, Cluster } from "./types";

export function runClustering(
    posts: RedditPost[],
    clusterCount: number,
    strictness: "Loose" | "Medium" | "Strict"
): { posts: RedditPost[]; clusters: Cluster[] } {
    // Simple keyword-based clustering simulation
    const clusterKeywords = [
        { id: "C001", label: "Pet Hair Management", keywords: ["hair", "shedding", "fur", "vacuum", "cleaning"] },
        { id: "C002", label: "Pet Anxiety & Behavior", keywords: ["anxiety", "alone", "separation", "barking", "training"] },
        { id: "C003", label: "Pet Odor & Allergens", keywords: ["odor", "smell", "allergies", "air", "purifier"] },
        { id: "C004", label: "Climate Control for Pets", keywords: ["heat", "cool", "summer", "temperature", "ac"] },
        { id: "C005", label: "Pet Laundry & Fabric Care", keywords: ["clothes", "washing", "laundry", "fabric", "styler"] },
        { id: "C006", label: "Noise & Sleep Issues", keywords: ["barking", "night", "noise", "sleep", "quiet"] },
        { id: "C007", label: "Smart Home & Monitoring", keywords: ["smart", "monitoring", "camera", "automation", "thinq"] },
        { id: "C008", label: "General Pet Care", keywords: ["pet", "dog", "cat", "care", "tips"] },
    ];

    const selectedClusters = clusterKeywords.slice(0, Math.min(clusterCount, clusterKeywords.length));

    // Assign posts to clusters
    const updatedPosts = posts.map(post => {
        const terms = post.detected_terms.map(t => t.toLowerCase());

        let bestCluster = null;
        let maxScore = 0;

        for (const cluster of selectedClusters) {
            const score = cluster.keywords.filter(kw =>
                terms.some(term => term.includes(kw) || kw.includes(term))
            ).length;

            if (score > maxScore) {
                maxScore = score;
                bestCluster = cluster;
            }
        }

        if (bestCluster && maxScore > 0) {
            return {
                ...post,
                cluster_id: bestCluster.id,
                cluster_label: bestCluster.label,
            };
        }

        return post;
    });

    // Build cluster objects
    const clusters: Cluster[] = selectedClusters.map(clusterDef => {
        const clusterPosts = updatedPosts.filter(p => p.cluster_id === clusterDef.id);

        return {
            cluster_id: clusterDef.id,
            cluster_label: clusterDef.label,
            top_terms: clusterDef.keywords.slice(0, 6),
            post_count: clusterPosts.length,
            representative_posts: clusterPosts.slice(0, 5),
            created_at: new Date().toISOString(),
        };
    }).filter(c => c.post_count > 0);

    return { posts: updatedPosts, clusters };
}
