import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { HealthAlert } from "@/services/alertEngine";

interface AlertBannerProps {
  alerts: HealthAlert[];
  onDismiss: (id: string) => void;
}

const severityConfig = {
  critical: { icon: AlertCircle, bgClass: "bg-destructive/10 border-destructive/30", textClass: "text-destructive" },
  warning: { icon: AlertTriangle, bgClass: "bg-warning/10 border-warning/30", textClass: "text-warning" },
  info: { icon: Info, bgClass: "bg-spo2/10 border-spo2/30", textClass: "text-spo2" },
};

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  const visibleAlerts = alerts.slice(0, 3);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {visibleAlerts.map(alert => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: -50, height: 0 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${config.bgClass}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.textClass}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${config.textClass}`}>{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
              </div>
              <button onClick={() => onDismiss(alert.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
