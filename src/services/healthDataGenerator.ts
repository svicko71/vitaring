// Mock health data generator - simulates BLE ring sensor data
export interface HealthReading {
  timestamp: Date;
  heartRate: number;
  spo2: number;
  temperature: number;
}

function randomInRange(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

// Smooth value transitions using simple moving average
let prevHR = 78;
let prevSpO2 = 97;
let prevTemp = 36.6;

function smoothValue(prev: number, target: number, factor = 0.3): number {
  return prev + (target - prev) * factor;
}

export function generateReading(): HealthReading {
  const rawHR = randomInRange(65, 95);
  const rawSpO2 = randomInRange(94, 100);
  const rawTemp = randomInRange(36.0, 37.8, 1);

  prevHR = smoothValue(prevHR, rawHR);
  prevSpO2 = smoothValue(prevSpO2, rawSpO2);
  prevTemp = smoothValue(prevTemp, rawTemp, 0.2);

  return {
    timestamp: new Date(),
    heartRate: Math.round(prevHR),
    spo2: Math.round(prevSpO2),
    temperature: Number(prevTemp.toFixed(1)),
  };
}

// Generate historical data for the past 24 hours
export function generateHistoricalData(hours = 24): HealthReading[] {
  const data: HealthReading[] = [];
  const now = Date.now();
  const intervalMs = (hours * 60 * 60 * 1000) / 288; // ~5 min intervals

  for (let i = 288; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMs);
    // Add circadian rhythm simulation
    const hour = timestamp.getHours();
    const isNight = hour >= 22 || hour <= 6;
    const isMorning = hour >= 6 && hour <= 9;

    const hrBase = isNight ? 62 : isMorning ? 72 : 78;
    const hrRange = isNight ? 8 : 15;

    data.push({
      timestamp,
      heartRate: Math.round(hrBase + Math.random() * hrRange),
      spo2: Math.round(95 + Math.random() * 5),
      temperature: Number((36.0 + Math.random() * 1.2 + (isNight ? -0.3 : 0.2)).toFixed(1)),
    });
  }
  return data;
}
