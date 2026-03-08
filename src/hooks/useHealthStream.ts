// Real-time health data stream hook — abstracts data source (mock/BLE/cloud)
import { useState, useEffect, useRef, useCallback } from "react";
import { generateReading, generateHistoricalData, type HealthReading } from "@/services/healthDataGenerator";
import { evaluateAlerts, type HealthAlert } from "@/services/alertEngine";
import { saveReading } from "@/services/healthDataService";

const INTERVAL_MS = 3000;
const MAX_LIVE_READINGS = 60; // last 3 minutes
const PERSIST_EVERY_N = 10; // persist every 10th reading (~30s)

export function useHealthStream() {
  const [currentReading, setCurrentReading] = useState<HealthReading>(generateReading());
  const [liveReadings, setLiveReadings] = useState<HealthReading[]>([]);
  const [historicalData] = useState<HealthReading[]>(() => generateHistoricalData(24));
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const tickCount = useRef(0);

  const tick = useCallback(() => {
    const reading = generateReading();
    setCurrentReading(reading);
    setLiveReadings(prev => [...prev.slice(-(MAX_LIVE_READINGS - 1)), reading]);

    const newAlerts = evaluateAlerts(reading);
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
    }

    // Persist periodically
    tickCount.current += 1;
    if (tickCount.current % PERSIST_EVERY_N === 0) {
      saveReading(reading).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(tick, INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, tick]);

  const toggleStream = () => setIsStreaming(prev => !prev);
  const dismissAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  return {
    currentReading,
    liveReadings,
    historicalData,
    alerts,
    isStreaming,
    toggleStream,
    dismissAlert,
  };
}
