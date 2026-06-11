import { motion } from "framer-motion";
import type { NetworkLog } from "@/lib/cyberEngine";

interface NetworkTableProps {
  logs: NetworkLog[];
}

const labelColors = {
  Normal: "text-neon-green bg-neon-green/10 border-neon-green/20",
  Suspicious: "text-neon-orange bg-neon-orange/10 border-neon-orange/20",
  "High Risk": "text-neon-red bg-neon-red/10 border-neon-red/20",
};

export function NetworkTable({ logs }: NetworkTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase mb-4">Recent Network Logs</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Time", "Source IP", "Dest IP", "Protocol", "Port", "Packet", "Score", "Label"].map(h => (
                <th key={h} className="text-left py-2 px-3 font-display text-xs tracking-wider text-muted-foreground uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 15).map((log, i) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{log.timestamp.toLocaleTimeString()}</td>
                <td className="py-2 px-3 font-mono text-xs text-primary">{log.sourceIP}</td>
                <td className="py-2 px-3 font-mono text-xs text-foreground">{log.destIP}</td>
                <td className="py-2 px-3 font-mono text-xs">{log.protocol}</td>
                <td className="py-2 px-3 font-mono text-xs">{log.port}</td>
                <td className="py-2 px-3 font-mono text-xs">{log.packetSize}B</td>
                <td className="py-2 px-3 font-mono text-xs">
                  <span className={log.anomalyScore > 0.65 ? "text-neon-red" : log.anomalyScore > 0.35 ? "text-neon-orange" : "text-neon-green"}>
                    {log.anomalyScore.toFixed(2)}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-display border ${labelColors[log.label]}`}>
                    {log.label}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
