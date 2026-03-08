import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { generateHistoricalData } from "@/services/healthDataGenerator";
import { motion } from "framer-motion";
import { Clock, Heart, Droplets, Thermometer } from "lucide-react";

type Metric = "heartRate" | "spo2" | "temperature";

const metrics: { key: Metric; label: string; color: string; icon: React.ReactNode; unit: string }[] = [
  { key: "heartRate", label: "Heart Rate", color: "hsl(0, 80%, 60%)", icon: <Heart className="w-4 h-4" />, unit: "BPM" },
  { key: "spo2", label: "Blood Oxygen", color: "hsl(200, 85%, 55%)", icon: <Droplets className="w-4 h-4" />, unit: "%" },
  { key: "temperature", label: "Temperature", color: "hsl(38, 92%, 55%)", icon: <Thermometer className="w-4 h-4" />, unit: "°C" },
];

export default function History() {
  const [selectedMetric, setSelectedMetric] = useState<Metric>("heartRate");
  const data = useMemo(() => generateHistoricalData(24), []);

  const chartData = data.map(r => ({
    time: r.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: r[selectedMetric],
  }));

  const selected = metrics.find(m => m.key === selectedMetric)!;

  // Averages
  const avg = (data.reduce((s, r) => s + r[selectedMetric], 0) / data.length).toFixed(1);
  const min = Math.min(...data.map(r => r[selectedMetric]));
  const max = Math.max(...data.map(r => r[selectedMetric]));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Health History</h1>
          <p className="text-xs text-muted-foreground">24-hour vitals overview</p>
        </div>
      </motion.div>

      {/* Metric selector */}
      <div className="flex gap-2">
        {metrics.map(m => (
          <button
            key={m.key}
            onClick={() => setSelectedMetric(m.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedMetric === m.key
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {m.icon}
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{selected.label} — 24h Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis
              dataKey="time"
              stroke="hsl(215, 12%, 50%)"
              fontSize={10}
              tickLine={false}
              interval={Math.floor(chartData.length / 8)}
            />
            <YAxis stroke="hsl(215, 12%, 50%)" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 95%)",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="value" stroke={selected.color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Average", value: avg },
          { label: "Min", value: min },
          { label: "Max", value: max },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold font-mono text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{selected.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
