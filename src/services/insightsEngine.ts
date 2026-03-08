// Health insights derived from vital signs using simple heuristics
import type { HealthReading } from "./healthDataGenerator";

export interface HealthInsight {
  label: string;
  value: number; // 0-100
  status: "good" | "moderate" | "poor";
  icon: string;
  description: string;
}

export function calculateInsights(readings: HealthReading[]): HealthInsight[] {
  if (readings.length === 0) return getDefaultInsights();

  const recent = readings.slice(-20);
  const avgHR = recent.reduce((s, r) => s + r.heartRate, 0) / recent.length;
  const avgSpO2 = recent.reduce((s, r) => s + r.spo2, 0) / recent.length;
  const avgTemp = recent.reduce((s, r) => s + r.temperature, 0) / recent.length;
  const hrVariability = Math.max(...recent.map(r => r.heartRate)) - Math.min(...recent.map(r => r.heartRate));

  // Iron status: inversely correlated with low SpO2 and high HR
  const ironScore = Math.min(100, Math.max(0, (avgSpO2 - 90) * 10 - (avgHR > 90 ? 20 : 0)));

  // Hydration: based on temperature and HR elevation
  const hydrationScore = Math.min(100, Math.max(0, 100 - (avgTemp - 36.5) * 40 - (avgHR - 75) * 0.5));

  // Fatigue: high HR + low HRV + high temp
  const fatigueScore = Math.min(100, Math.max(0, 100 - hrVariability * 2 - (avgHR - 70) * 1.5));

  // Stress: based on elevated HR and low HRV
  const stressScore = Math.min(100, Math.max(0, 100 - (avgHR - 70) * 2 - hrVariability));

  return [
    {
      label: "Iron Status",
      value: Math.round(ironScore),
      status: ironScore > 70 ? "good" : ironScore > 40 ? "moderate" : "poor",
      icon: "🩸",
      description: ironScore > 70 ? "Iron levels appear healthy" : "Consider an iron-rich diet",
    },
    {
      label: "Hydration",
      value: Math.round(hydrationScore),
      status: hydrationScore > 70 ? "good" : hydrationScore > 40 ? "moderate" : "poor",
      icon: "💧",
      description: hydrationScore > 70 ? "Well hydrated" : "Increase water intake",
    },
    {
      label: "Energy Level",
      value: Math.round(fatigueScore),
      status: fatigueScore > 70 ? "good" : fatigueScore > 40 ? "moderate" : "poor",
      icon: "⚡",
      description: fatigueScore > 70 ? "Energy levels are high" : "Rest recommended",
    },
    {
      label: "Stress Index",
      value: Math.round(stressScore),
      status: stressScore > 70 ? "good" : stressScore > 40 ? "moderate" : "poor",
      icon: "🧘",
      description: stressScore > 70 ? "Relaxed state detected" : "Try breathing exercises",
    },
  ];
}

function getDefaultInsights(): HealthInsight[] {
  return [
    { label: "Iron Status", value: 78, status: "good", icon: "🩸", description: "Awaiting data..." },
    { label: "Hydration", value: 82, status: "good", icon: "💧", description: "Awaiting data..." },
    { label: "Energy Level", value: 70, status: "moderate", icon: "⚡", description: "Awaiting data..." },
    { label: "Stress Index", value: 65, status: "moderate", icon: "🧘", description: "Awaiting data..." },
  ];
}
