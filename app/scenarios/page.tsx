"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search } from "lucide-react";
import { Scenario } from "@/lib/types";

export default function ScenariosPage() {
  const { scenarios } = useStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clusterFilter, setClusterFilter] = useState("all");

  // 클러스터 목록 추출
  const clusterIds = useMemo(() => {
    const ids = Array.from(new Set(scenarios.map((s) => s.cluster_id)));
    return ids.sort();
  }, [scenarios]);

  // 필터링된 시나리오
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      const matchesSearch =
        scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.products[0]?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCluster =
        clusterFilter === "all" || scenario.cluster_id === clusterFilter;

      return matchesSearch && matchesCluster;
    });
  }, [scenarios, searchTerm, clusterFilter]);

  // 콘텐츠 아웃라인을 단계별로 파싱
  const parseOutline = (outline: string) => {
    return outline.split("\n").filter(line => line.trim());
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Content Scenarios"
        description={`${scenarios.length} LG product-connected content scenarios for Shorts`}
      />

      <div className="space-y-6 p-8">
        {/* 필터 */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={clusterFilter} onValueChange={setClusterFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by cluster" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              {clusterIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 시나리오 그리드 */}
        {filteredScenarios.length === 0 ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">
                No scenarios found. Please check filters or data loading.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredScenarios.map((scenario) => (
              <Card
                key={scenario.scenario_id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => setSelectedScenario(scenario)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-tight">
                      {scenario.title}
                    </CardTitle>
                    <Eye className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 제품 */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#A50034]">
                      {scenario.products[0]?.name}
                    </Badge>
                    {scenario.content_type && (
                      <Badge variant="outline" className="text-xs">
                        {scenario.content_type.split(" ")[0]}
                      </Badge>
                    )}
                  </div>

                  {/* 클러스터 정보 */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {scenario.cluster_id}
                    </Badge>
                    <span className="text-xs">
                      {scenario.scenario_id}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 시나리오 상세 다이얼로그 */}
      <Dialog open={!!selectedScenario} onOpenChange={() => setSelectedScenario(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedScenario && (
            <>
              <DialogHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedScenario.scenario_id}</Badge>
                    <Badge variant="outline">{selectedScenario.cluster_id}</Badge>
                  </div>
                  <DialogTitle className="text-xl leading-tight">
                    {selectedScenario.title}
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* 핵심 제품 */}
                <div>
                  <Label className="text-base font-semibold">🏆 핵심 제품</Label>
                  <div className="mt-2 rounded-lg border bg-muted/50 p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg">
                        {selectedScenario.products[0]?.name}
                      </h4>
                      {selectedScenario.products[0]?.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {selectedScenario.products[0].tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 콘텐츠 구성 */}
                <div>
                  <Label className="text-base font-semibold">📝 콘텐츠 구성</Label>
                  <div className="mt-2 space-y-2 rounded-lg border p-4">
                    {parseOutline(selectedScenario.hook).map((line, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#A50034] text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="flex-1 text-sm leading-relaxed">{line.replace(/^\d+\.\s*/, "")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 사용자 혜택 & 제품 기능 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-semibold">✨ 사용자 혜택</Label>
                    <div className="mt-2 rounded-lg border bg-green-50 p-3">
                      <p className="text-sm">
                        {selectedScenario.rationale.split("|")[0]?.trim()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">⚙️ 제품 기능</Label>
                    <div className="mt-2 rounded-lg border bg-blue-50 p-3">
                      <p className="text-sm">
                        {selectedScenario.rationale.split("|")[1]?.trim()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 콘텐츠 유형 */}
                {selectedScenario.content_type && (
                  <div>
                    <Label className="text-base font-semibold">🎨 콘텐츠 유형</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-sm">
                        {selectedScenario.content_type}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
