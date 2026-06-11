import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

interface TrafficChartProps {
  data: Array<{ time: string; normal: number; suspicious: number; highRisk: number; total: number }>;
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase mb-4">Network Traffic Analysis</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 15%)" />
          <XAxis dataKey="time" stroke="hsl(210, 15%, 40%)" fontSize={11} fontFamily="JetBrains Mono" />
          <YAxis stroke="hsl(210, 15%, 40%)" fontSize={11} fontFamily="JetBrains Mono" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 25%, 7%)",
              border: "1px solid hsl(195, 100%, 50%, 0.3)",
              borderRadius: "8px",
              fontFamily: "Rajdhani",
              color: "hsl(200, 100%, 95%)",
            }}
          />
          <Area type="monotone" dataKey="normal" stroke="hsl(195, 100%, 50%)" fill="url(#colorNormal)" strokeWidth={2} />
          <Area type="monotone" dataKey="suspicious" stroke="hsl(35, 100%, 55%)" fill="url(#colorSuspicious)" strokeWidth={2} />
          <Area type="monotone" dataKey="highRisk" stroke="hsl(0, 85%, 55%)" fill="url(#colorHighRisk)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProtocolChartProps {
  data: Array<{ name: string; count: number; anomalies: number }>;
}

export function ProtocolChart({ data }: ProtocolChartProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase mb-4">Protocol Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 15%)" />
          <XAxis dataKey="name" stroke="hsl(210, 15%, 40%)" fontSize={11} fontFamily="JetBrains Mono" />
          <YAxis stroke="hsl(210, 15%, 40%)" fontSize={11} fontFamily="JetBrains Mono" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 25%, 7%)",
              border: "1px solid hsl(195, 100%, 50%, 0.3)",
              borderRadius: "8px",
              fontFamily: "Rajdhani",
              color: "hsl(200, 100%, 95%)",
            }}
          />
          <Legend wrapperStyle={{ fontFamily: "Rajdhani", fontSize: 13 }} />
          <Bar dataKey="count" name="Total" fill="hsl(195, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
          <Bar dataKey="anomalies" name="Anomalies" fill="hsl(0, 85%, 55%)" radius={[4, 4, 0, 0]} opacity={0.9} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
