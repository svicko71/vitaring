import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { HealthReading } from "@/services/healthDataGenerator";

interface LiveChartProps {
  data: HealthReading[];
  metric: "heartRate" | "spo2" | "temperature";
  color: string;
  label: string;
}

export function LiveChart({ data, metric, color, label }: LiveChartProps) {
  const chartData = data.map((r, i) => ({
    idx: i,
    value: r[metric],
    time: r.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <div className="glass-card p-4">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">{label} Trend</h4>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 14% 18%)",
              borderRadius: "8px",
              color: "hsl(210 20% 95%)",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
