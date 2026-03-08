// Rule-based health alert engine
import type { HealthReading } from "./healthDataGenerator";

export type AlertSeverity = "info" | "warning" | "critical";

export interface HealthAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  metric: "heartRate" | "spo2" | "temperature";
  value: number;
}

let alertCounter = 0;

export function evaluateAlerts(reading: HealthReading): HealthAlert[] {
  const alerts: HealthAlert[] = [];

  // Heart rate rules
  if (reading.heartRate > 120) {
    alerts.push({
      id: `alert-${++alertCounter}`,
      title: "High Heart Rate",
      message: `Heart rate detected at ${reading.heartRate} BPM. Consider resting.`,
      severity: "critical",
      timestamp: new Date(),
      metric: "heartRate",
      value: reading.heartRate,
    });
  } else if (reading.heartRate > 100) {
    alerts.push({
      id: `alert-${++alertCounter}`,
      title: "Elevated Heart Rate",
      message: `Heart rate is ${reading.heartRate} BPM — above normal resting range.`,
      severity: "warning",
      timestamp: new Date(),
      metric: "heartRate",
      value: reading.heartRate,
    });
  }

  // SpO2 rules
  if (reading.spo2 < 90) {
    alerts.push({
      id: `alert-${++alertCounter}`,
      title: "Critical Oxygen Level",
      message: `Blood oxygen at ${reading.spo2}%. Seek medical attention.`,
      severity: "critical",
      timestamp: new Date(),
      metric: "spo2",
      value: reading.spo2,
    });
  } else if (reading.spo2 < 92) {
    alerts.push({
      id: `alert-${++alertCounter}`,
      title: "Low Blood Oxygen",
      message: `SpO2 at ${reading.spo2}% — below recommended threshold.`,
      severity: "warning",
      timestamp: new Date(),
      metric: "spo2",
      value: reading.spo2,
    });
  }

  // Temperature rules
  if (reading.temperature > 38.5) {
    alerts.push({
      id: `alert-${++alertCounter}`,
      title: "High Fever Detected",
      message: `Body temperature at ${reading.temperature}°C. Consider medical consultation.`,
      severity: "critical",
      timestamp: new Date(),
      metric: "temperature",
      value: reading.temperature,
    });
  } else if (reading.temperature > 38.0) {
    alerts.push({
      id: `alert-${++alertCounter}`,
      title: "Fever Alert",
      message: `Temperature elevated to ${reading.temperature}°C.`,
      severity: "warning",
      timestamp: new Date(),
      metric: "temperature",
      value: reading.temperature,
    });
  }

  return alerts;
}
