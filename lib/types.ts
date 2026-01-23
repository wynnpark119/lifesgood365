// Core Data Models
export interface RedditPost {
  id: string;
  no: number;
  title: string;
  subreddit: string;
  url: string;
  detected_terms: string[];
  cluster_id?: string;
  cluster_label?: string;
  highlighted?: boolean;
}

export interface Cluster {
  cluster_id: string;
  cluster_label: string;
  top_terms: string[];
  post_count: number;
  representative_posts: RedditPost[];
  created_at: string;
  pinned?: boolean;
}

export interface Product {
  product_id: string;
  name: string;
  category: string;
  tags: string[];
  capabilities: string[];
  active: boolean;
}

export interface Scenario {
  scenario_id: string;
  cluster_id: string;
  title: string;
  hook: string;
  products: Product[];
  rationale: string;
  status: "New" | "Selected" | "In Production" | "Published";
  created_at: string;
  content_type?: string;
  categoryDiversity?: number; // 카테고리 다양성 점수 (1-5, 높을수록 좋은 조합)
  hook_variations?: {
    empathy: string;
    informative: string;
    brand: string;
  };
}

export interface LogEvent {
  id: string;
  timestamp: string;
  actor: "user" | "system";
  action: string;
  entity: string;
  detail: string;
}

export interface SearchQuery {
  id: string;
  query: string;
  added_at: string;
}

// Store State
export interface AppState {
  // Data
  redditPosts: RedditPost[];
  clusters: Cluster[];
  products: Product[];
  scenarios: Scenario[];
  logs: LogEvent[];
  searchQueries: SearchQuery[];
  
  // Loading states
  isLoadingClustering: boolean;
  isLoadingScenarios: boolean;
  
  // Actions
  setRedditPosts: (posts: RedditPost[]) => void;
  setClusters: (clusters: Cluster[]) => void;
  setProducts: (products: Product[]) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  addLog: (log: Omit<LogEvent, "id" | "timestamp">) => void;
  addSearchQuery: (query: string) => void;
  
  // Business logic
  runClustering: (clusterCount: number, strictness: "Loose" | "Medium" | "Strict") => Promise<void>;
  generateScenarios: (clusterIds?: string[]) => Promise<void>;
  updateScenarioStatus: (scenarioId: string, status: Scenario["status"]) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  clearLogs: () => void;
}

// KPI Data
export interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}
