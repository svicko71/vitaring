import { Heart, Droplets, Thermometer } from "lucide-react";
import { useHealthStream } from "@/hooks/useHealthStream";
import { CircularGauge } from "@/components/health/CircularGauge";
import { VitalCard } from "@/components/health/VitalCard";
import { HealthScore } from "@/components/health/HealthScore";
import { LiveChart } from "@/components/health/LiveChart";
import { AlertBanner } from "@/components/health/AlertBanner";
import { WeeklyStats } from "@/components/health/WeeklyStats";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { currentReading, liveReadings, alerts, dismissAlert, isStreaming, toggleStream } = useHealthStream();

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && <AlertBanner alerts={alerts} onDismiss={dismissAlert} />}

      {/* Health Score */}
      <HealthScore reading={currentReading} />

      {/* Live Gauges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground">Real-Time Vitals</h2>
          <button
            onClick={toggleStream}
            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
              isStreaming ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {isStreaming ? "● Live" : "○ Paused"}
          </button>
        </div>
        <div className="flex justify-around flex-wrap gap-6">
          <CircularGauge
            value={currentReading.heartRate}
            min={40}
            max={140}
            label="Heart Rate"
            unit="BPM"
            colorClass="gradient-heart"
            glowClass="glow-heart"
          />
          <CircularGauge
            value={currentReading.spo2}
            min={85}
            max={100}
            label="Blood Oxygen"
            unit="%"
            colorClass="gradient-spo2"
            glowClass="glow-spo2"
          />
          <CircularGauge
            value={currentReading.temperature}
            min={35}
            max={40}
            label="Temperature"
            unit="°C"
            colorClass="gradient-temp"
            glowClass="glow-temp"
          />
        </div>
      </motion.div>

      {/* Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VitalCard
          title="Heart Rate"
          value={currentReading.heartRate}
          unit="BPM"
          icon={<Heart className="w-4 h-4 text-heart" />}
          trend={currentReading.heartRate > 80 ? "up" : "stable"}
        />
        <VitalCard
          title="SpO2"
          value={currentReading.spo2}
          unit="%"
          icon={<Droplets className="w-4 h-4 text-spo2" />}
          trend="stable"
        />
        <VitalCard
          title="Temperature"
          value={currentReading.temperature}
          unit="°C"
          icon={<Thermometer className="w-4 h-4 text-temp" />}
          trend={currentReading.temperature > 37.0 ? "up" : "stable"}
        />
      </div>

      {/* Weekly Stats */}
      <WeeklyStats />

      {/* Live Charts */}
      {liveReadings.length > 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LiveChart data={liveReadings} metric="heartRate" color="hsl(0, 80%, 60%)" label="Heart Rate" />
          <LiveChart data={liveReadings} metric="spo2" color="hsl(200, 85%, 55%)" label="SpO2" />
          <LiveChart data={liveReadings} metric="temperature" color="hsl(38, 92%, 55%)" label="Temperature" />
        </div>
      )}
    </div>
  );
}
