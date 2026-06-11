import { motion } from "framer-motion";
import { Shield, AlertTriangle, Activity, Wifi } from "lucide-react";
import type { ThreatMetrics } from "@/lib/cyberEngine";

interface ThreatLevelProps {
  metrics: ThreatMetrics;
}

const levelConfig = {
  Low: { color: "text-neon-green", glow: "glow-green", icon: Shield, ring: "border-neon-green/30" },
  Medium: { color: "text-neon-orange", glow: "glow-orange", icon: AlertTriangle, ring: "border-neon-orange/30" },
  High: { color: "text-neon-red", glow: "glow-red", icon: AlertTriangle, ring: "border-neon-red/30" },
  Critical: { color: "text-neon-red", glow: "glow-red", icon: AlertTriangle, ring: "border-neon-red/50" },
};

export function ThreatLevel({ metrics }: ThreatLevelProps) {
  const config = levelConfig[metrics.threatLevel];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-lg border ${config.ring} bg-card p-6 ${config.glow}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase">Threat Level</h3>
        <motion.div
          animate={metrics.threatLevel === "Critical" ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Icon className={`h-5 w-5 ${config.color}`} />
        </motion.div>
      </div>
      <p className={`font-display text-3xl font-bold ${config.color} text-glow-${metrics.threatLevel === "Low" ? "green" : "red"}`}>
        {metrics.threatLevel}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">{metrics.totalPackets.toLocaleString()} packets</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-neon-red" />
          <span className="text-muted-foreground">{metrics.anomaliesDetected} anomalies</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="h-3.5 w-3.5 text-neon-green" />
          <span className="text-muted-foreground">{metrics.activeConnections} active</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-neon-orange" />
          <span className="text-muted-foreground">{metrics.blockedIPs} blocked</span>
        </div>
      </div>
    </motion.div>
  );
}
