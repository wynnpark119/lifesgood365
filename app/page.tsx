"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { KPIGrid } from "@/components/shared/KPIGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

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
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => router.push("/scenarios")}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm leading-tight">
                        {scenario.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#A50034]">
                          {scenario.products[0]?.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {scenario.cluster_id}
                        </Badge>
                        {scenario.content_type && (
                          <Badge variant="outline" className="text-xs">
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
