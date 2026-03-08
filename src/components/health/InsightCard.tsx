import { motion } from "framer-motion";
import type { HealthInsight } from "@/services/insightsEngine";

interface InsightCardProps {
  insight: HealthInsight;
  index: number;
}

const statusColors = {
  good: "bg-primary/20 text-primary",
  moderate: "bg-warning/20 text-warning",
  poor: "bg-destructive/20 text-destructive",
};

export function InsightCard({ insight, index }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{insight.icon}</span>
          <span className="font-medium text-foreground">{insight.label}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[insight.status]}`}>
          {insight.status}
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${insight.value}%` }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{insight.description}</span>
        <span className="text-sm font-mono font-semibold text-foreground">{insight.value}%</span>
      </div>
    </motion.div>
  );
}
