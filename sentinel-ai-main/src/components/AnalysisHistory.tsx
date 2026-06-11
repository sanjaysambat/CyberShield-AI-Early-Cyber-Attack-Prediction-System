import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronDown, ChevronUp, FileText, Keyboard, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { AnalysisRecord } from "@/lib/cyberEngine";

interface AnalysisHistoryProps {
  records: AnalysisRecord[];
}

export function AnalysisHistory({ records }: AnalysisHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-primary" />
          Analysis History
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-xs font-mono">No analyses performed yet</p>
          <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">Submit data above to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-primary" />
        Analysis History
        <span className="ml-auto text-xs font-mono text-primary">{records.length} record{records.length !== 1 ? "s" : ""}</span>
      </h3>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {records.map((record, idx) => {
          const isExpanded = expandedId === record.id;
          const hasThreats = record.summary.highRisk > 0;
          const hasSuspicious = record.summary.suspicious > 0;

          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-md border transition-colors ${
                hasThreats ? "border-destructive/30 bg-destructive/5" :
                hasSuspicious ? "border-warning/30 bg-warning/5" :
                "border-border bg-secondary/20"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  {record.inputType === "csv" ? (
                    <FileText className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Keyboard className="h-3.5 w-3.5 text-primary" />
                  )}
                  <div>
                    <p className="text-xs font-mono text-foreground">
                      {record.inputType === "csv" ? "Batch Analysis" : "Manual Entry"} — {record.totalLogs} log{record.totalLogs !== 1 ? "s" : ""}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {record.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {record.summary.highRisk > 0 && (
                      <span className="flex items-center gap-0.5 text-destructive">
                        <XCircle className="h-3 w-3" /> {record.summary.highRisk}
                      </span>
                    )}
                    {record.summary.suspicious > 0 && (
                      <span className="flex items-center gap-0.5 text-warning">
                        <AlertTriangle className="h-3 w-3" /> {record.summary.suspicious}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 text-accent">
                      <CheckCircle className="h-3 w-3" /> {record.summary.normal}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2 border-t border-border/50 pt-2">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="rounded bg-secondary/30 p-1.5">
                          <p className="text-sm font-display text-foreground">{record.totalLogs}</p>
                          <p className="text-[9px] font-mono text-muted-foreground">TOTAL</p>
                        </div>
                        <div className="rounded bg-accent/10 p-1.5">
                          <p className="text-sm font-display text-accent">{record.summary.normal}</p>
                          <p className="text-[9px] font-mono text-muted-foreground">NORMAL</p>
                        </div>
                        <div className="rounded bg-warning/10 p-1.5">
                          <p className="text-sm font-display text-warning">{record.summary.suspicious}</p>
                          <p className="text-[9px] font-mono text-muted-foreground">SUSPECT</p>
                        </div>
                        <div className="rounded bg-destructive/10 p-1.5">
                          <p className="text-sm font-display text-destructive">{record.summary.highRisk}</p>
                          <p className="text-[9px] font-mono text-muted-foreground">HIGH RISK</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        Avg Anomaly Score: <span className={
                          record.summary.avgScore > 0.65 ? "text-destructive" :
                          record.summary.avgScore > 0.35 ? "text-warning" : "text-accent"
                        }>{record.summary.avgScore.toFixed(2)}</span>
                      </p>
                      <div className="max-h-[150px] overflow-y-auto space-y-1">
                        {record.results.map(r => (
                          <div key={r.id} className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded bg-background/50">
                            <span className="text-muted-foreground">{r.sourceIP} → {r.destIP}</span>
                            <span className={`px-1.5 py-0.5 rounded-full border ${
                              r.label === "High Risk" ? "text-destructive border-destructive/20" :
                              r.label === "Suspicious" ? "text-warning border-warning/20" :
                              "text-accent border-accent/20"
                            }`}>{r.label} ({r.anomalyScore.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
