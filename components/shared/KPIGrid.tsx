import { KPI } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIGridProps {
    kpis: KPI[];
}

export function KPIGrid({ kpis }: KPIGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                {kpi.label}
                            </p>
                            {kpi.trend && (
                                <div className="flex items-center gap-1">
                                    {kpi.trend === "up" && (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    )}
                                    {kpi.trend === "down" && (
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                    )}
                                    {kpi.trend === "neutral" && (
                                        <Minus className="h-4 w-4 text-gray-500" />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <p className="text-3xl font-bold">{kpi.value}</p>
                            {kpi.change && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {kpi.change}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
