import { Cluster, Product, Scenario } from "./types";

export function generateScenarios(
    clusters: Cluster[],
    products: Product[]
): Scenario[] {
    const scenarios: Scenario[] = [];
    const activeProducts = products.filter(p => p.active);

    const mappingRules = [
        {
            keywords: ["hair", "shedding", "fur"],
            products: ["LG Styler", "LG CordZero Vacuum", "LG Washer", "LG RoboVac"],
            topics: [
                { title: "반려견 털 관리의 모든 것", hook: "반려견 털 때문에 고민이신가요?" },
                { title: "LG 스타일러로 의류 털 제거", hook: "옷에 붙은 털, 이제 걱정 끝!" },
                { title: "무선 청소기로 매일 깨끗하게", hook: "매일 청소해도 끝이 없는 털..." },
            ],
        },
        {
            keywords: ["odor", "smell", "allergies", "allergen"],
            products: ["LG PuriCare Air Purifier", "LG Dehumidifier"],
            topics: [
                { title: "반려동물 냄새 제거 솔루션", hook: "집안 냄새, 이제 해결할 수 있어요" },
                { title: "알레르기 걱정 없는 집 만들기", hook: "반려동물과 함께해도 건강하게" },
            ],
        },
        {
            keywords: ["heat", "cool", "summer", "temperature"],
            products: ["LG DUALCOOL Air Conditioner", "LG ThinQ Home"],
            topics: [
                { title: "여름철 반려동물 더위 관리", hook: "우리 아이도 시원하게!" },
                { title: "스마트홈으로 온도 자동 조절", hook: "외출 중에도 집안 온도 걱정 끝" },
            ],
        },
        {
            keywords: ["anxiety", "alone", "separation"],
            products: ["LG ThinQ Home"],
            topics: [
                { title: "분리불안 해결 스마트 솔루션", hook: "혼자 있는 우리 아이가 걱정되시나요?" },
                { title: "외출 중 반려동물 모니터링", hook: "언제 어디서나 우리 아이 확인" },
            ],
        },
        {
            keywords: ["barking", "noise", "night", "sleep"],
            products: ["LG Soundbar", "LG OLED TV", "LG ThinQ Home"],
            topics: [
                { title: "반려견 짖음 완화 백색소음", hook: "밤에 짖는 우리 아이 진정시키기" },
                { title: "숙면을 위한 스마트 루틴", hook: "LG ThinQ로 수면 환경 자동 조성" },
            ],
        },
        {
            keywords: ["washing", "laundry", "clothes", "fabric"],
            products: ["LG Styler", "LG Washer"],
            topics: [
                { title: "반려동물 침구 세탁 꿀팁", hook: "털과 냄새 한 번에 해결" },
                { title: "의류 관리의 새로운 기준", hook: "스타일러로 매일 새 옷처럼" },
            ],
        },
    ];

    clusters.forEach(cluster => {
        const clusterTerms = cluster.top_terms.map(t => t.toLowerCase());

        // Find matching rules
        const matchingRules = mappingRules.filter(rule =>
            rule.keywords.some(kw => clusterTerms.some(term => term.includes(kw) || kw.includes(term)))
        );

        if (matchingRules.length === 0) return;

        // Generate 2-4 scenarios per cluster
        const numScenarios = Math.min(2 + Math.floor(Math.random() * 3), matchingRules.length * 2);

        for (let i = 0; i < numScenarios; i++) {
            const rule = matchingRules[i % matchingRules.length];
            const topic = rule.topics[i % rule.topics.length];

            const connectedProducts = activeProducts.filter(p =>
                rule.products.some(ruleProd => p.name.includes(ruleProd))
            );

            if (connectedProducts.length === 0) continue;

            scenarios.push({
                scenario_id: `scenario-${scenarios.length + 1}`,
                cluster_id: cluster.cluster_id,
                title: topic.title,
                hook: topic.hook,
                products: connectedProducts.slice(0, 3),
                rationale: generateRationale(cluster, connectedProducts),
                status: "New",
                created_at: new Date().toISOString(),
            });
        }
    });

    return scenarios;
}

function generateRationale(cluster: Cluster, products: Product[]): string {
    const productNames = products.map(p => p.name).join(", ");
    return `"${cluster.cluster_label}" 클러스터의 주요 키워드(${cluster.top_terms.slice(0, 3).join(", ")})와 ${productNames}의 핵심 기능이 매칭되어 추천되었습니다.`;
}

export function generateHookVariations(hook: string): {
    empathy: string;
    informative: string;
    brand: string;
} {
    // Simple variations based on original hook
    return {
        empathy: `${hook} 많은 분들이 같은 고민을 하고 계세요.`,
        informative: `${hook} 전문가가 알려드리는 해결 방법!`,
        brand: `${hook} LG ThinQ로 스마트하게 해결하세요.`,
    };
}
