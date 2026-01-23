"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { KPIGrid } from "@/components/shared/KPIGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Link2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductColorClass } from "@/lib/category-colors";

export default function OverviewPage() {
  const router = useRouter();
  const {
    redditPosts,
    clusters,
    scenarios,
  } = useStore();

  const kpis = [
    {
      label: "Total Reddit Posts",
      value: redditPosts.length.toLocaleString(),
      change: "From data collection",
    },
    {
      label: "# Clusters",
      value: clusters.length,
      change: clusters.length > 0 ? "Active" : "Not generated yet",
    },
    {
      label: "# Scenarios",
      value: scenarios.length,
      change: "Content ready",
    },
  ];

  // 랜덤으로 6개 시나리오 선택
  const randomScenarios = useMemo(() => {
    if (scenarios.length === 0) return [];
    const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [scenarios]);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Overview"
        description="Dashboard home - Quick actions and system status"
      />

      <div className="space-y-6 p-8">
        {/* KPI Cards */}
        <KPIGrid kpis={kpis} />

        {/* Recent Scenarios */}
        {scenarios.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Content Scenarios</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/scenarios")}
                className="gap-2"
              >
                More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {randomScenarios.map((scenario) => (
                  <Card
                    key={scenario.scenario_id}
                    className="group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[#A50034]/10 hover:-translate-y-1 bg-white border-l-4"
                    style={{ 
                      borderLeftColor: scenario.products.length >= 3 ? '#A50034' : '#e5e7eb',
                    }}
                    onClick={() => router.push("/scenarios")}
                  >
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-tight group-hover:text-[#A50034] transition-colors duration-300">
                          {scenario.title}
                        </CardTitle>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#A50034] transition-all duration-300">
                          <Eye className="h-3 w-3 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {/* 연결된 제품들 - 카테고리별 색상 적용 */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Link2 className="h-3 w-3 text-muted-foreground group-hover:text-[#A50034] transition-colors duration-300" />
                        {scenario.products.slice(0, 3).map((product, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline"
                            className={`text-xs transition-all duration-300 group-hover:scale-105 ${getProductColorClass(product.name)}`}
                          >
                            {product.name}
                          </Badge>
                        ))}
                        {scenario.products.length > 3 && (
                          <Badge variant="secondary" className="text-xs group-hover:bg-[#A50034]/10 group-hover:text-[#A50034] transition-colors duration-300">
                            +{scenario.products.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs group-hover:bg-[#A50034] group-hover:text-white transition-colors duration-300">
                          {scenario.cluster_id}
                        </Badge>
                        {scenario.content_type && (
                          <Badge variant="outline" className="text-xs group-hover:border-[#A50034]/30 transition-colors duration-300">
                            {scenario.content_type.split(" ")[0]}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
