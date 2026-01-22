"use client";

import { create } from "zustand";
import { AppState, LogEvent, Scenario } from "./types";
import { loadRedditCSV, loadProductCSV, loadScenariosCSV, loadClustersFromRedditCSV } from "./csv";
import { runClustering as runClusteringAlgo } from "./clustering";
import { generateScenarios as generateScenariosAlgo } from "./recommend";

export const useStore = create<AppState>((set, get) => ({
    // Initial state
    redditPosts: [],
    clusters: [],
    products: [],
    scenarios: [],
    logs: [],
    searchQueries: [
        { id: "q1", query: "dog hair", added_at: new Date().toISOString() },
        { id: "q2", query: "dog shedding", added_at: new Date().toISOString() },
        { id: "q3", query: "dog anxiety", added_at: new Date().toISOString() },
        { id: "q4", query: "pet odor", added_at: new Date().toISOString() },
        { id: "q5", query: "dog barking", added_at: new Date().toISOString() },
        { id: "q6", query: "pet allergies", added_at: new Date().toISOString() },
        { id: "q7", query: "dog alone", added_at: new Date().toISOString() },
        { id: "q8", query: "pet summer heat", added_at: new Date().toISOString() },
    ],
    isLoadingClustering: false,
    isLoadingScenarios: false,

    // Setters
    setRedditPosts: (posts) => set({ redditPosts: posts }),
    setClusters: (clusters) => set({ clusters }),
    setProducts: (products) => set({ products }),
    setScenarios: (scenarios) => set({ scenarios }),

    addLog: (log) => {
        const newLog: LogEvent = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            ...log,
        };
        set((state) => ({ logs: [newLog, ...state.logs] }));
    },

    addSearchQuery: (query) => {
        const newQuery = {
            id: `q-${Date.now()}`,
            query,
            added_at: new Date().toISOString(),
        };
        set((state) => ({ searchQueries: [...state.searchQueries, newQuery] }));
        get().addLog({
            actor: "user",
            action: "Add Search Query",
            entity: "SearchQuery",
            detail: `Added query: "${query}"`,
        });
    },

    // Business logic
    runClustering: async (clusterCount, strictness) => {
        set({ isLoadingClustering: true });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { posts, clusters } = runClusteringAlgo(
            get().redditPosts,
            clusterCount,
            strictness
        );

        set({
            redditPosts: posts,
            clusters,
            isLoadingClustering: false,
        });

        get().addLog({
            actor: "user",
            action: "Run Clustering",
            entity: "Cluster",
            detail: `Generated ${clusters.length} clusters with ${strictness} strictness`,
        });
    },

    generateScenarios: async (clusterIds) => {
        set({ isLoadingScenarios: true });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const targetClusters = clusterIds
            ? get().clusters.filter(c => clusterIds.includes(c.cluster_id))
            : get().clusters;

        const newScenarios = generateScenariosAlgo(targetClusters, get().products);

        set((state) => ({
            scenarios: [...state.scenarios, ...newScenarios],
            isLoadingScenarios: false,
        }));

        get().addLog({
            actor: "user",
            action: "Generate Scenarios",
            entity: "Scenario",
            detail: `Generated ${newScenarios.length} scenarios from ${targetClusters.length} clusters`,
        });
    },

    updateScenarioStatus: (scenarioId, status) => {
        set((state) => ({
            scenarios: state.scenarios.map(s =>
                s.scenario_id === scenarioId ? { ...s, status } : s
            ),
        }));

        get().addLog({
            actor: "user",
            action: "Update Scenario Status",
            entity: "Scenario",
            detail: `Changed scenario ${scenarioId} to ${status}`,
        });
    },

    updateProduct: (productId, updates) => {
        set((state) => ({
            products: state.products.map(p =>
                p.product_id === productId ? { ...p, ...updates } : p
            ),
        }));

        get().addLog({
            actor: "user",
            action: "Update Product",
            entity: "Product",
            detail: `Updated product ${productId}`,
        });
    },

    clearLogs: () => {
        set({ logs: [] });
    },
}));

// Initialize data on app load
export async function initializeStore() {
    const [posts, products, scenarios, clusters] = await Promise.all([
        loadRedditCSV(),
        loadProductCSV(),
        loadScenariosCSV(),
        loadClustersFromRedditCSV(),
    ]);

    useStore.setState({
        redditPosts: posts,
        products,
        scenarios,
        clusters,
    });

    useStore.getState().addLog({
        actor: "system",
        action: "Initialize Data",
        entity: "System",
        detail: `Loaded ${posts.length} Reddit posts, ${products.length} products, ${scenarios.length} scenarios, and ${clusters.length} clusters`,
    });
}
