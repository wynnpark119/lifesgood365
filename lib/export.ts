import { RedditPost, Cluster, Scenario } from "./types";

export function exportRedditClusterResults(posts: RedditPost[]): void {
    const csvContent = [
        ["No", "Reddit 스레드 제목", "Subreddit", "링크", "cluster_id", "cluster_label", "cluster_top_terms"],
        ...posts.map(post => [
            post.no,
            post.title,
            post.subreddit,
            post.url,
            post.cluster_id || "",
            post.cluster_label || "",
            post.detected_terms.join(","),
        ]),
    ];

    downloadCSV(csvContent, "reddit_cluster_results.csv");
}

export function exportClusterRecommendations(
    clusters: Cluster[],
    scenarios: Scenario[]
): void {
    const csvContent = [
        [
            "cluster_id",
            "cluster_label",
            "cluster_top_terms",
            "seed_queries",
            "recommended_products",
            "content_topic_ideas",
            "mapping_rationale",
        ],
        ...clusters.map(cluster => {
            const clusterScenarios = scenarios.filter(s => s.cluster_id === cluster.cluster_id);
            const products = [...new Set(clusterScenarios.flatMap(s => s.products.map(p => p.name)))].join(", ");
            const topics = clusterScenarios.map(s => s.title).join(" | ");
            const rationale = clusterScenarios[0]?.rationale || "";

            return [
                cluster.cluster_id,
                cluster.cluster_label,
                cluster.top_terms.join(","),
                cluster.top_terms.slice(0, 3).join(","),
                products,
                topics,
                rationale,
            ];
        }),
    ];

    downloadCSV(csvContent, "cluster_to_lg_recommendations.csv");
}

export function exportLogs(logs: any[]): void {
    const csvContent = [
        ["Timestamp", "Actor", "Action", "Entity", "Detail"],
        ...logs.map(log => [
            log.timestamp,
            log.actor,
            log.action,
            log.entity,
            log.detail,
        ]),
    ];

    downloadCSV(csvContent, "system_logs.csv");
}

function downloadCSV(content: any[][], filename: string): void {
    const csvString = content
        .map(row =>
            row
                .map(cell => {
                    const cellStr = String(cell);
                    if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }
                    return cellStr;
                })
                .join(",")
        )
        .join("\n");

    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
