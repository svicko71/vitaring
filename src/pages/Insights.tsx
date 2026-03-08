import { useHealthStream } from "@/hooks/useHealthStream";
import { calculateInsights } from "@/services/insightsEngine";
import { InsightCard } from "@/components/health/InsightCard";
import { HealthScore } from "@/components/health/HealthScore";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function Insights() {
  const { currentReading, liveReadings } = useHealthStream();
  const insights = calculateInsights(liveReadings);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Health Insights</h1>
          <p className="text-xs text-muted-foreground">AI-derived analysis from your vitals</p>
        </div>
      </motion.div>

      <HealthScore reading={currentReading} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={insight.label} insight={insight} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-2">💡 Recommendations</h3>
        <ul className="space-y-2">
          {insights.filter(i => i.status !== "good").map(i => (
            <li key={i.label} className="flex items-start gap-2 text-sm text-foreground">
              <span>{i.icon}</span>
              <span>{i.description}</span>
            </li>
          ))}
          {insights.every(i => i.status === "good") && (
            <li className="text-sm text-primary">All indicators look great! Keep it up. 🎉</li>
          )}
        </ul>
      </motion.div>
    </div>
  );
}
