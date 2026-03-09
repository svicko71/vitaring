// Abstraction layer for persisting health readings to Cloud
import { supabase } from "@/integrations/supabase/client";
import type { HealthReading } from "@/services/healthDataGenerator";

export async function saveReading(reading: HealthReading) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("health_readings").insert({
    user_id: user.id,
    heart_rate: reading.heartRate,
    spo2: reading.spo2,
    temperature: reading.temperature,
    recorded_at: reading.timestamp.toISOString(),
  });
}

export async function fetchHistory(hours: number = 24): Promise<HealthReading[]> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("health_readings")
    .select("*")
    .gte("recorded_at", since)
    .order("recorded_at", { ascending: true })
    .limit(500);

  if (error || !data) return [];

  return data.map((r: any) => ({
    heartRate: Number(r.heart_rate),
    spo2: Number(r.spo2),
    temperature: Number(r.temperature),
    timestamp: new Date(r.recorded_at),
  }));
}

export type WeeklyStats = {
  days: number;
  readingsCount: number;
  avgHeartRate: number | null;
  avgSpo2: number | null;
  avgTemperature: number | null;
};

export async function fetchWeeklyStats(days: number = 7): Promise<WeeklyStats | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error, count } = await supabase
    .from("health_readings")
    .select("*", { count: "exact" })
    .gte("recorded_at", since.toISOString())
    .order("recorded_at", { ascending: true })
    .limit(500);

  if (error) return { days, readingsCount: 0, avgHeartRate: null, avgSpo2: null, avgTemperature: null };

  const rows = ((data as unknown) as any[]) ?? [];
  const readingsCount = typeof count === "number" ? count : rows.length;
  if (rows.length === 0) return { days, readingsCount, avgHeartRate: null, avgSpo2: null, avgTemperature: null };

  let hrSum = 0;
  let spo2Sum = 0;
  let tempSum = 0;

  for (const r of rows) {
    hrSum += Number(r.heart_rate);
    spo2Sum += Number(r.spo2);
    tempSum += Number(r.temperature);
  }

  const denom = rows.length || 1;
  return {
    days,
    readingsCount,
    avgHeartRate: hrSum / denom,
    avgSpo2: spo2Sum / denom,
    avgTemperature: tempSum / denom,
  };
}




