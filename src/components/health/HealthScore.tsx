import { motion } from "framer-motion";
import type { HealthReading } from "@/services/healthDataGenerator";

interface HealthScoreProps {
  reading: HealthReading;
}

export function HealthScore({ reading }: HealthScoreProps) {
  // Simple composite health score
  const hrScore = reading.heartRate >= 60 && reading.heartRate <= 85 ? 100 : Math.max(0, 100 - Math.abs(reading.heartRate - 72) * 2);
  const spo2Score = Math.min(100, (reading.spo2 - 90) * 10);
  const tempScore = reading.temperature >= 36.2 && reading.temperature <= 37.2 ? 100 : Math.max(0, 100 - Math.abs(reading.temperature - 36.7) * 40);

  const overall = Math.round((hrScore + spo2Score + tempScore) / 3);
  const statusLabel = overall > 80 ? "Excellent" : overall > 60 ? "Good" : overall > 40 ? "Fair" : "Needs Attention";
  const statusColor = overall > 80 ? "text-primary" : overall > 60 ? "text-primary/80" : overall > 40 ? "text-warning" : "text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex items-center gap-6"
    >
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg width={80} height={80} className="-rotate-90">
          <circle cx={40} cy={40} r={34} fill="none" stroke="hsl(var(--muted))" strokeWidth={6} />
          <motion.circle
            cx={40} cy={40} r={34} fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 34}
            animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - overall / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span key={overall} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-xl font-bold font-mono text-foreground">
            {overall}
          </motion.span>
        </div>
      </div>
      <div>
        <h3 className="text-sm text-muted-foreground font-medium">Health Score</h3>
        <p className={`text-lg font-semibold ${statusColor}`}>{statusLabel}</p>
        <p className="text-xs text-muted-foreground mt-1">Based on HR, SpO2 & Temperature</p>
      </div>
    </motion.div>
  );
}
