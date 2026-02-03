"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { VARIANT_LABELS } from "@/lib/variant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, Star, Zap, Link2, CheckCircle2, XCircle, User, Lightbulb, Gift, Heart } from "lucide-react";
import { Scenario } from "@/lib/types";
import { categoryColors, getCategoryColorClass } from "@/lib/category-colors";

export default function ScenariosPage() {
  const { scenarios, variant } = useStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const isMonthlyLG = variant === "monthly";

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
        description={isMonthlyLG
          ? `${scenarios.length}개 TV × 클러스터 기반 콘텐츠 시나리오`
          : `${scenarios.length}개 다중 제품 연결 콘텐츠 시나리오`}
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
                  {/* 연결된 제품들 (Monthly LG: TV 단일) */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#A50034] transition-colors duration-300" />
                    {scenario.products.slice(0, isMonthlyLG ? 1 : 3).map((product, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className={`text-xs transition-all duration-300 group-hover:scale-105 ${categoryColors[product.category] || "bg-gray-100"}`}
                      >
                        {product.name}
                      </Badge>
                    ))}
                    {!isMonthlyLG && scenario.products.length > 3 && (
                      <Badge variant="secondary" className="text-xs group-hover:bg-[#A50034]/10 group-hover:text-[#A50034] transition-colors duration-300">
                        +{scenario.products.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* 카테고리 다양성 + 클러스터 (Monthly LG: 클러스터 강조) */}
                  <div className="flex items-center justify-between text-xs">
                    {!isMonthlyLG && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground group-hover:text-[#A50034] transition-colors duration-300">다양성:</span>
                        {renderDiversityStars(scenario.categoryDiversity)}
                      </div>
                    )}
                    <Badge variant="secondary" className="text-xs group-hover:bg-[#A50034] group-hover:text-white transition-colors duration-300">
                      {scenario.cluster_id} {isMonthlyLG && scenario.cluster_label && `· ${String(scenario.cluster_label).split(" (")[0]}`}
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
            {isMonthlyLG && (
              <p className="text-sm text-muted-foreground mt-1">
                TV × 클러스터 결과 기반 다양한 콘텐츠 시나리오 (클러스터와 1:1 대응 아님)
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 콘텐츠 구조 4단계 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  콘텐츠 구조 4단계
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs">1</div>
                    <span className="text-blue-700 font-medium">고객 POV</span>
                    <span className="text-muted-foreground">- 문제/걱정을 1인칭으로</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A50034] text-white text-xs">2</div>
                    <span className="text-[#A50034] font-medium">LG 통합 솔루션</span>
                    <span className="text-muted-foreground">- 제품 조합과 역할</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">3</div>
                    <span className="text-green-700 font-medium">고객 Benefit</span>
                    <span className="text-muted-foreground">- 구체적 결과/가치</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-xs">4</div>
                    <span className="text-purple-700 font-medium">LG브랜드 약속</span>
                    <span className="text-muted-foreground">- Life's Good when...</span>
                  </div>
                </div>
              </div>

              {/* 제품 조합 가이드: LG365 다중 제품용, Monthly LG(TV 단일)에서는 미노출 */}
              {!isMonthlyLG && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    제품 조합 가이드
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <span className="text-green-600 font-medium">좋은 조합</span>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-start gap-1">
                          <span className="text-green-600">✓</span>
                          다른 카테고리 2개+
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-green-600">✓</span>
                          스타일러+세탁기+공청기
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <span className="text-red-500 font-medium">피할 조합</span>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-start gap-1">
                          <span className="text-red-500">✗</span>
                          같은 카테고리만
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-red-500">✗</span>
                          냉장고+정수기+오븐
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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
                    {!isMonthlyLG && (
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-muted-foreground">다양성:</span>
                        {renderDiversityStars(selectedScenario.categoryDiversity)}
                      </div>
                    )}
                    {isMonthlyLG && selectedScenario.cluster_label && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {String(selectedScenario.cluster_label).split(" (")[0]}
                      </span>
                    )}
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

                {/* 콘텐츠 구성 - 새로운 4단계 구조 */}
                <div>
                  <Label className="text-base font-semibold">📝 콘텐츠 구성</Label>
                  {selectedScenario.contentStructure ? (
                    <div className="mt-3 space-y-0">
                      {/* 1. 고객 POV */}
                      <div className="flex gap-3 p-4 rounded-t-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-b-0">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-blue-700 mb-1">1. 고객 POV</h4>
                          <p className="text-sm leading-relaxed text-blue-900">"{selectedScenario.contentStructure.customerPOV}"</p>
                        </div>
                      </div>
                      
                      {/* 2. LG 통합 솔루션 */}
                      <div className="flex gap-3 p-4 bg-gradient-to-r from-[#A50034]/5 to-[#A50034]/10 border-x">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#A50034] text-white">
                          <Lightbulb className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-[#A50034] mb-1">2. LG 통합 솔루션</h4>
                          <p className="text-sm leading-relaxed text-gray-800">{selectedScenario.contentStructure.lgSolution}</p>
                        </div>
                      </div>
                      
                      {/* 3. 고객 Benefit */}
                      <div className="flex gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 border-x">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                          <Gift className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-green-700 mb-1">3. 고객 Benefit</h4>
                          <p className="text-sm leading-relaxed text-green-900">{selectedScenario.contentStructure.customerBenefit}</p>
                        </div>
                      </div>
                      
                      {/* 4. LG브랜드 약속 */}
                      <div className="flex gap-3 p-4 rounded-b-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-t-0">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
                          <Heart className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-purple-700 mb-1">4. LG브랜드 약속</h4>
                          <p className="text-sm leading-relaxed text-purple-900 font-medium italic">"{selectedScenario.contentStructure.brandPromise}"</p>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}
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
