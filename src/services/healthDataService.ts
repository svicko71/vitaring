// Abstraction layer for persisting health readings to Cloud
import { supabase } from "@/integrations/supabase/client";
import type { HealthReading } from "@/services/healthDataGenerator";

export async function saveReading(reading: HealthReading) {
  const { data: { user } } = await supabase.auth.getUser();
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
