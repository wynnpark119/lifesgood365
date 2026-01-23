"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, Star, Zap, Link2, CheckCircle2, XCircle } from "lucide-react";
import { Scenario } from "@/lib/types";
import { categoryColors, getCategoryColorClass } from "@/lib/category-colors";

export default function ScenariosPage() {
  const { scenarios } = useStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  // 콘텐츠 아웃라인을 단계별로 파싱
  const parseOutline = (outline: string) => {
    return outline.split("\n").filter(line => line.trim());
  };

  // 카테고리 다양성 점수에 따른 별 렌더링
  const renderDiversityStars = (score: number = 1) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i <= score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Content Scenarios"
        description={`${scenarios.length}개 다중 제품 연결 콘텐츠 시나리오`}
      />

      <div className="space-y-6 p-8">
        {/* 시나리오 그리드 */}
        {scenarios.length === 0 ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">
                시나리오가 없습니다. 필터를 확인하거나 데이터를 로딩해주세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.scenario_id}
                className="group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[#A50034]/10 hover:-translate-y-1 border-l-4 bg-white"
                style={{ 
                  borderLeftColor: scenario.categoryDiversity && scenario.categoryDiversity >= 4 ? '#A50034' : '#e5e7eb',
                }}
                onClick={() => setSelectedScenario(scenario)}
              >
                <CardHeader className="pb-3 relative">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-tight group-hover:text-[#A50034] transition-colors duration-300">
                      {scenario.title}
                    </CardTitle>
                    {/* 호버 시 아이콘 변화 */}
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#A50034] transition-all duration-300">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 연결된 제품들 */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#A50034] transition-colors duration-300" />
                    {scenario.products.slice(0, 3).map((product, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className={`text-xs transition-all duration-300 group-hover:scale-105 ${categoryColors[product.category] || "bg-gray-100"}`}
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

                  {/* 카테고리 다양성 + 클러스터 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground group-hover:text-[#A50034] transition-colors duration-300">다양성:</span>
                      {renderDiversityStars(scenario.categoryDiversity)}
                    </div>
                    <Badge variant="secondary" className="text-xs group-hover:bg-[#A50034] group-hover:text-white transition-colors duration-300">
                      {scenario.cluster_id}
                    </Badge>
                  </div>

                  {/* 콘텐츠 유형 + 호버 시 보이는 액션 */}
                  <div className="flex items-center justify-between pt-1">
                    {scenario.content_type && (
                      <Badge variant="outline" className="text-xs group-hover:border-[#A50034]/30 transition-colors duration-300">
                        {scenario.content_type}
                      </Badge>
                    )}
                    <span className="text-xs text-[#A50034] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto">
                      클릭하여 상세보기 →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 시나리오 설계 원칙 섹션 */}
        <Card className="mt-8 bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-[#A50034]" />
              시나리오 설계 원칙
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 핵심 규칙 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  좋은 조합
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    서로 다른 카테고리 제품 2개 이상 연결
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    스타일러(의류) + 세탁기(세탁) + 공기청정기(환경)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    에어컨(환경) + 사운드바(엔터) + 씽큐(플랫폼)
                  </li>
                </ul>
              </div>

              {/* 피해야 할 조합 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  피해야 할 조합
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    같은 카테고리 제품끼리만 연결
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    스타일러 + 청소기 (둘다 털 제거 = 시너지 약함)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    냉장고 + 정수기 + 오븐 (주방만 3개)
                  </li>
                </ul>
              </div>

              {/* 다양성 점수 가이드 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  카테고리 다양성 점수
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    {renderDiversityStars(5)}
                    <span>3+ 카테고리 / 4개 제품</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {renderDiversityStars(4)}
                    <span>3 카테고리 조합</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {renderDiversityStars(2)}
                    <span>2 카테고리 조합</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {renderDiversityStars(1)}
                    <span>1 카테고리 (피하기)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시나리오 상세 다이얼로그 */}
      <Dialog open={!!selectedScenario} onOpenChange={() => setSelectedScenario(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedScenario && (
            <>
              <DialogHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{selectedScenario.scenario_id}</Badge>
                    <Badge variant="outline">{selectedScenario.cluster_id}</Badge>
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-xs text-muted-foreground">다양성:</span>
                      {renderDiversityStars(selectedScenario.categoryDiversity)}
                    </div>
                  </div>
                  <DialogTitle className="text-xl leading-tight">
                    {selectedScenario.title}
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* 연결된 제품들 */}
                <div>
                  <Label className="text-base font-semibold">🔗 연결된 제품 ({selectedScenario.products.length}개)</Label>
                  <div className="mt-3 grid gap-3">
                    {selectedScenario.products.map((product, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between rounded-lg border p-3 ${categoryColors[product.category] || "bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-xs opacity-75">{product.category}</p>
                          </div>
                        </div>
                        {product.tags[0] && (
                          <span className="text-xs max-w-[200px] text-right opacity-75">
                            {product.tags[0]}
                          </span>
                        )}
                      </div>
                    ))}
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

                {/* 시너지 효과 */}
                <div>
                  <Label className="text-base font-semibold">💡 시너지 효과</Label>
                  <div className="mt-2 rounded-lg border bg-gradient-to-r from-[#A50034]/5 to-[#A50034]/10 p-4">
                    <p className="text-sm leading-relaxed">
                      {selectedScenario.rationale}
                    </p>
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
