import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface AnomalyScoreChartProps {
  data: Array<{ time: string; score: number }>;
}

export function AnomalyScoreChart({ data }: AnomalyScoreChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase">Anomaly Score Timeline</h3>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-green" />Normal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-orange" />Suspicious</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-red" />High Risk</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0, 85%, 55%)" />
              <stop offset="50%" stopColor="hsl(35, 100%, 55%)" />
              <stop offset="100%" stopColor="hsl(160, 100%, 45%)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 15%)" />
          <XAxis dataKey="time" stroke="hsl(210, 15%, 40%)" fontSize={10} fontFamily="JetBrains Mono" />
          <YAxis domain={[0, 1]} stroke="hsl(210, 15%, 40%)" fontSize={10} fontFamily="JetBrains Mono" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 25%, 7%)",
              border: "1px solid hsl(195, 100%, 50%, 0.3)",
              borderRadius: "8px",
              fontFamily: "Rajdhani",
              color: "hsl(200, 100%, 95%)",
            }}
          />
          {/* Threshold lines */}
          <Line type="monotone" dataKey={() => 0.65} stroke="hsl(0, 85%, 55%)" strokeDasharray="5 5" strokeWidth={1} dot={false} name="High Risk" />
          <Line type="monotone" dataKey={() => 0.35} stroke="hsl(35, 100%, 55%)" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Suspicious" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(195, 100%, 50%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(195, 100%, 50%)" }}
            activeDot={{ r: 5, fill: "hsl(195, 100%, 50%)", stroke: "hsl(195, 100%, 50%)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
