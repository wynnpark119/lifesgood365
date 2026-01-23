import Papa from "papaparse";
import { RedditPost, Product, Scenario, Cluster } from "./types";

export async function loadRedditCSV(): Promise<RedditPost[]> {
    try {
        // Try to load reddit_cluster_results.csv first (has cluster info)
        let response = await fetch("/data/reddit_cluster_results.csv");
        if (!response.ok) {
            // Fallback to reddit_g.csv
            response = await fetch("/data/reddit_g.csv");
            if (!response.ok) {
                console.warn("CSV file not found, using fallback data");
                return getFallbackRedditData();
            }
        }

        const csvText = await response.text();

        const result = Papa.parse<any>(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data.map((row, index) => {
            // Clean URL by removing trailing whitespace, non-breaking spaces, and other unwanted characters
            let url = row["링크"] || row.url || row.URL || row.Link || "";
            // Remove all types of whitespace and encoded non-breaking spaces
            url = url.trim()
                .replace(/\s+/g, '')           // Remove all whitespace
                .replace(/%C2%A0/g, '')        // Remove encoded non-breaking space
                .replace(/\u00A0/g, '')        // Remove non-breaking space character
                .replace(/\u200B/g, '')        // Remove zero-width space
                .replace(/[\r\n\t]/g, '');     // Remove newlines and tabs

            // Parse detected terms from cluster_top_terms
            let detected_terms: string[] = [];
            const termsStr = row.cluster_top_terms || row.detected_terms || row.tags || "";
            if (termsStr) {
                detected_terms = termsStr.split(",").map((t: string) => t.trim()).filter(Boolean);
            }

            return {
                id: `reddit-${index + 1}`,
                no: row.No || row.no || index + 1,
                title: row["Reddit 스레드 제목"] || row.title || row.Title || "",
                subreddit: row.Subreddit || row.subreddit || "",
                url: url,
                detected_terms: detected_terms,
                cluster_id: row.cluster_id || undefined,
                cluster_label: row.cluster_label || undefined,
            };
        });
    } catch (error) {
        console.error("Failed to load Reddit CSV:", error);
        return getFallbackRedditData();
    }
}

export async function loadProductCSV(): Promise<Product[]> {
    try {
        const response = await fetch("/data/lg_g.csv");
        if (!response.ok) {
            console.warn("CSV file not found, using fallback data");
            return getFallbackProductData();
        }

        const csvText = await response.text();

        const result = Papa.parse<any>(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data.map((row, index) => ({
            product_id: row.product_id || `prod-${index + 1}`,
            name: row["제품명"] || row.name || row.Name || "",
            category: row.category || row.Category || "General",
            tags: (row["태그"] || row.tags || row.Tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
            capabilities: (row.capabilities || row.Capabilities || "").split(",").map((c: string) => c.trim()).filter(Boolean),
            active: row.active === "true" || row.active === "1" || row.Active === "true" || true,
        }));
    } catch (error) {
        console.error("Failed to load Product CSV:", error);
        return getFallbackProductData();
    }
}

export async function loadScenariosCSV(): Promise<Scenario[]> {
    try {
        const response = await fetch("/data/lg_scenarios.csv");
        if (!response.ok) {
            console.warn("Scenarios CSV file not found, using fallback data");
            return getFallbackScenarioData();
        }

        const csvText = await response.text();

        const result = Papa.parse<any>(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data.map((row, index) => {
            // 다중 제품 파싱 (쉼표로 구분)
            const productNames = (row.products || row.primary_product || "").split(",").map((p: string) => p.trim()).filter(Boolean);
            const productRoles = (row.product_roles || row.product_feature || "").split(",").map((r: string) => r.trim());
            
            // 제품별 카테고리 매핑
            const categoryMap: Record<string, string> = {
                "공기청정기": "환경", "가습기": "환경", "제습기": "환경", "에어컨": "환경",
                "정수기": "주방", "식기세척기": "주방", "오븐": "주방", "냉장고": "주방",
                "세탁기": "세탁", "건조기": "세탁",
                "스타일러": "의류관리",
                "무선청소기": "청소", "로봇청소기": "청소",
                "TV": "엔터테인먼트", "프로젝터": "엔터테인먼트", "사운드바": "엔터테인먼트",
                "씽큐": "플랫폼", "webOS": "플랫폼",
                "신발관리기": "위생",
                "AI로봇": "미래가전",
            };

            const products = productNames.map((name: string, i: number) => ({
                product_id: `prod-${index}-${i}`,
                name: name,
                category: categoryMap[name] || "General",
                tags: productRoles[i] ? [productRoles[i]] : [],
                capabilities: [],
                active: true,
            }));

            return {
                scenario_id: row.scenario_id || `SC${String(index + 1).padStart(3, '0')}`,
                cluster_id: row.cluster_id || "",
                title: row.scenario_title || "Untitled Scenario",
                hook: row.content_outline || "",
                products: products.length > 0 ? products : [{
                    product_id: `prod-${index}`,
                    name: "Unknown",
                    category: "General",
                    tags: [],
                    capabilities: [],
                    active: true,
                }],
                rationale: row.synergy || `${row.user_benefit || ""} | ${row.product_feature || ""}`,
                status: "New" as const,
                created_at: new Date().toISOString(),
                content_type: row.content_type || "",
                categoryDiversity: parseInt(row.category_diversity) || 1,
            };
        });
    } catch (error) {
        console.error("Failed to load Scenarios CSV:", error);
        return getFallbackScenarioData();
    }
}

// Fallback data
function getFallbackRedditData(): RedditPost[] {
    return [
        {
            id: "reddit-1",
            no: 1,
            title: "My dog sheds everywhere, especially on furniture",
            subreddit: "r/dogs",
            url: "https://reddit.com/r/dogs/example1",
            detected_terms: ["dog hair", "shedding", "furniture", "cleaning"],
        },
        {
            id: "reddit-2",
            no: 2,
            title: "Best vacuum for pet hair?",
            subreddit: "r/dogs",
            url: "https://reddit.com/r/dogs/example2",
            detected_terms: ["pet hair", "vacuum", "cleaning"],
        },
        {
            id: "reddit-3",
            no: 3,
            title: "Dog anxiety when left alone - any solutions?",
            subreddit: "r/Dogtraining",
            url: "https://reddit.com/r/Dogtraining/example3",
            detected_terms: ["dog anxiety", "alone", "separation anxiety"],
        },
        {
            id: "reddit-4",
            no: 4,
            title: "Pet odor removal tips needed",
            subreddit: "r/pets",
            url: "https://reddit.com/r/pets/example4",
            detected_terms: ["pet odor", "smell", "cleaning"],
        },
        {
            id: "reddit-5",
            no: 5,
            title: "Excessive dog barking at night - help!",
            subreddit: "r/Dogtraining",
            url: "https://reddit.com/r/Dogtraining/example5",
            detected_terms: ["dog barking", "night", "noise"],
        },
        {
            id: "reddit-6",
            no: 6,
            title: "How to keep house cool with pets in summer",
            subreddit: "r/pets",
            url: "https://reddit.com/r/pets/example6",
            detected_terms: ["summer", "heat", "cooling", "pets"],
        },
        {
            id: "reddit-7",
            no: 7,
            title: "Best air purifier for pet allergies?",
            subreddit: "r/Allergies",
            url: "https://reddit.com/r/Allergies/example7",
            detected_terms: ["allergies", "air purifier", "pet dander"],
        },
        {
            id: "reddit-8",
            no: 8,
            title: "Dog hair on clothes - washing tips",
            subreddit: "r/dogs",
            url: "https://reddit.com/r/dogs/example8",
            detected_terms: ["dog hair", "clothes", "washing", "laundry"],
        },
    ];
}

function getFallbackProductData(): Product[] {
    return [
        {
            product_id: "prod-1",
            name: "LG Styler",
            category: "Home Appliance",
            tags: ["#가전_세탁", "#털제거", "#의류관리"],
            capabilities: ["Steam refresh", "Pet hair removal", "Odor elimination"],
            active: true,
        },
        {
            product_id: "prod-2",
            name: "LG CordZero Vacuum",
            category: "Cleaning",
            tags: ["#청소", "#털제거", "#무선"],
            capabilities: ["Powerful suction", "Pet hair brush", "HEPA filter"],
            active: true,
        },
        {
            product_id: "prod-3",
            name: "LG Washer (Tromm)",
            category: "Home Appliance",
            tags: ["#세탁", "#털제거", "#대용량"],
            capabilities: ["TurboWash", "Pet hair removal cycle", "Steam cleaning"],
            active: true,
        },
        {
            product_id: "prod-4",
            name: "LG PuriCare Air Purifier",
            category: "Air Care",
            tags: ["#공기청정", "#알레르기", "#반려동물"],
            capabilities: ["360° filtration", "Pet allergen removal", "Smart sensor"],
            active: true,
        },
        {
            product_id: "prod-5",
            name: "LG Dehumidifier",
            category: "Air Care",
            tags: ["#제습", "#냄새제거", "#곰팡이방지"],
            capabilities: ["Moisture control", "Odor removal", "Auto mode"],
            active: true,
        },
        {
            product_id: "prod-6",
            name: "LG DUALCOOL Air Conditioner",
            category: "Climate Control",
            tags: ["#냉방", "#ThinQ", "#스마트홈"],
            capabilities: ["Fast cooling", "Energy saving", "ThinQ integration"],
            active: true,
        },
        {
            product_id: "prod-7",
            name: "LG ThinQ Home",
            category: "Smart Home",
            tags: ["#스마트홈", "#자동화", "#모니터링"],
            capabilities: ["Device control", "Automation", "Remote monitoring"],
            active: true,
        },
        {
            product_id: "prod-8",
            name: "LG Soundbar",
            category: "Audio",
            tags: ["#오디오", "#백색소음", "#수면"],
            capabilities: ["White noise mode", "Ambient sound", "Sleep timer"],
            active: true,
        },
        {
            product_id: "prod-9",
            name: "LG OLED TV",
            category: "Entertainment",
            tags: ["#TV", "#앰비언트", "#스마트"],
            capabilities: ["Ambient mode", "Gallery mode", "ThinQ AI"],
            active: true,
        },
        {
            product_id: "prod-10",
            name: "LG RoboVac",
            category: "Cleaning",
            tags: ["#로봇청소기", "#자동청소", "#털제거"],
            capabilities: ["Auto cleaning", "Pet hair detection", "Smart mapping"],
            active: false,
        },
    ];
}


function getFallbackScenarioData(): Scenario[] {
    return [
        {
            scenario_id: "scenario-1",
            cluster_id: "0",
            title: "Pet Hair Cleanup Solutions",
            hook: "Tired of dog hair everywhere? Here's how LG helps",
            products: [
                {
                    product_id: "prod-1",
                    name: "LG CordZero Vacuum",
                    category: "Cleaning",
                    tags: ["#청소", "#털제거"],
                    capabilities: ["Pet hair brush", "HEPA filter"],
                    active: true,
                },
            ],
            rationale: "Pet hair is a common pain point for dog owners",
            status: "New",
            created_at: new Date().toISOString(),
        },
    ];
}



export async function loadClustersFromRedditCSV(): Promise<Cluster[]> {
  try {
    const response = await fetch("/data/reddit_cluster_results.csv");
    if (!response.ok) {
      console.warn("Cluster CSV file not found");
      return [];
    }
    
    const csvText = await response.text();
    const result = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Group posts by cluster_id
    const clusterMap = new Map<string, any[]>();
    result.data.forEach((row: any) => {
      const clusterId = row.cluster_id;
      if (!clusterId) return;
      
      if (!clusterMap.has(clusterId)) {
        clusterMap.set(clusterId, []);
      }
      clusterMap.get(clusterId)!.push(row);
    });

    // Create cluster objects
    const clusters: Cluster[] = [];
    clusterMap.forEach((posts, clusterId) => {
      const firstPost = posts[0];
      const topTerms = (firstPost.cluster_top_terms || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      clusters.push({
        cluster_id: clusterId,
        cluster_label: firstPost.cluster_label || `Cluster ${clusterId}`,
        top_terms: topTerms,
        post_count: posts.length,
        representative_posts: posts.slice(0, 5).map((row: any, index: number) => ({
          id: `reddit-${row.No || index}`,
          no: row.No || index + 1,
          title: row["Reddit 스레드 제목"] || row.title || "",
          subreddit: row.Subreddit || row.subreddit || "",
          url: (row["링크"] || row.url || "").trim(),
          detected_terms: topTerms,
          cluster_id: clusterId,
          cluster_label: firstPost.cluster_label,
        })),
        created_at: new Date().toISOString(),
        pinned: false,
      });
    });

    return clusters.sort((a, b) => parseInt(a.cluster_id) - parseInt(b.cluster_id));
  } catch (error) {
    console.error("Failed to load clusters from CSV:", error);
    return [];
  }
}

