import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWeeklyStats, type WeeklyStats } from "@/services/healthDataService";

function formatNumber(value: number | null, fractionDigits = 0) {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toFixed(fractionDigits);
}

export function WeeklyStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<WeeklyStats | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const result = await fetchWeeklyStats(7);
        if (mounted) setStats(result);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(
    () =>
      [
        { label: "متوسط نبض القلب", value: stats?.avgHeartRate ?? null, unit: "BPM", digits: 0 },
        { label: "متوسط الأكسجين", value: stats?.avgSpo2 ?? null, unit: "%", digits: 0 },
        { label: "متوسط الحرارة", value: stats?.avgTemperature ?? null, unit: "°C", digits: 1 },
      ] as const,
    [stats],
  );

  return (
    <section className="glass-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">إحصائيات أسبوعية</h2>
          <p className="text-xs text-muted-foreground mt-1">ملخص لآخر 7 أيام من قراءاتك المحفوظة</p>
        </div>
        {!isLoading && (
          <div className="text-xs text-muted-foreground">
            عدد القراءات: <span className="font-mono text-foreground">{stats?.readingsCount ?? 0}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-28" />
          </div>
          <div className="rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-28" />
          </div>
          <div className="rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-28" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-2xl font-bold font-mono text-foreground">
                  {formatNumber(item.value, item.digits)}
                </div>
                <div className="text-xs text-muted-foreground">{item.unit}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (stats?.readingsCount ?? 0) === 0 && (
        <p className="mt-4 text-xs text-muted-foreground">لا توجد قراءات كافية خلال الأسبوع الماضي لعرض الإحصائيات.</p>
      )}
    </section>
  );
}
