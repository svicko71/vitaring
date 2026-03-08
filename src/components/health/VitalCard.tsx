import { motion } from "framer-motion";
import { ReactNode } from "react";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  glowClass?: string;
  children?: ReactNode;
}

export function VitalCard({ title, value, unit, icon, trend, glowClass, children }: VitalCardProps) {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? "text-destructive" : trend === "down" ? "text-spo2" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 ${glowClass ?? ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        {trend && <span className={`text-sm font-mono ${trendColor}`}>{trendIcon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={String(value)}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold font-mono text-foreground"
        >
          {value}
        </motion.span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {children}
    </motion.div>
  );
}
