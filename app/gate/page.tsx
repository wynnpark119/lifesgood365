"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setVariant, VARIANT_LABELS, type Variant } from "@/lib/variant";
import { useStore, initializeStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, Loader2 } from "lucide-react";

const variants: { id: Variant; icon: React.ReactNode; description: string }[] = [
  {
    id: "lg365",
    icon: <LayoutDashboard className="h-10 w-10 text-[#A50034]" />,
    description: "Life's Good 365 AI 시나리오 대시보드",
  },
  {
    id: "monthly",
    icon: <Calendar className="h-10 w-10 text-[#A50034]" />,
    description: "Monthly LG 시나리오 대시보드",
  },
];

export default function GatePage() {
  const router = useRouter();
  const setStoreVariant = useStore((s) => s.setVariant);
  const [loading, setLoading] = useState(false);

  async function handleSelect(variant: Variant) {
    setLoading(true);
    setVariant(variant);
    setStoreVariant(variant);
    await initializeStore(variant);
    setLoading(false);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">대시보드 선택</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          사용할 대시보드를 선택하세요.
        </p>
      </div>
      <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
        {variants.map(({ id, icon, description }) => (
          <Card
            key={id}
            className="cursor-pointer transition-all hover:border-[#A50034]/50 hover:shadow-lg"
            onClick={() => handleSelect(id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  {icon}
                </div>
                <CardTitle className="text-lg">{VARIANT_LABELS[id]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
              <Button
                className="mt-4 w-full bg-[#A50034] hover:bg-[#A50034]/90"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(id);
                }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "선택"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        © 2026 LG Electronics · 이 페이지는 네비게이션에 노출되지 않습니다.
      </p>
    </div>
  );
}
