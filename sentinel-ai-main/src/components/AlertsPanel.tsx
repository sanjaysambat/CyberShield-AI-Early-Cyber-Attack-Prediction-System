import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield, Info, XCircle, Check } from "lucide-react";
import type { Alert } from "@/lib/cyberEngine";

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

const severityConfig = {
  low: { icon: Info, color: "text-neon-blue", bg: "bg-neon-blue/5", border: "border-neon-blue/20" },
  medium: { icon: AlertTriangle, color: "text-neon-orange", bg: "bg-neon-orange/5", border: "border-neon-orange/20" },
  high: { icon: AlertTriangle, color: "text-neon-red", bg: "bg-neon-red/5", border: "border-neon-red/20" },
  critical: { icon: XCircle, color: "text-neon-red", bg: "bg-neon-red/10", border: "border-neon-red/40" },
};

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase">Live Alerts</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-red" />
          </span>
          <span className="text-xs text-muted-foreground font-mono">{alerts.filter(a => !a.acknowledged).length} active</span>
        </div>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {alerts.slice(0, 20).map((alert) => {
            const cfg = severityConfig[alert.severity];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: alert.acknowledged ? 0.4 : 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className={`flex items-start gap-3 p-3 rounded-md border ${cfg.border} ${cfg.bg} transition-opacity`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-display uppercase tracking-wider ${cfg.color}`}>{alert.severity}</span>
                    <span className="text-xs text-muted-foreground font-mono">{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5 truncate">{alert.message}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{alert.sourceIP} • {alert.type}</p>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Check className="h-3.5 w-3.5 text-neon-green" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Shield className="h-8 w-8 mb-2" />
            <p className="text-sm">No alerts detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
