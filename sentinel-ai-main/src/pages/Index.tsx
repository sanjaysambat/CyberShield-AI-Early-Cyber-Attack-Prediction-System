import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Activity, AlertTriangle, Zap, Database, Eye, Play, Pause } from "lucide-react";
import { ThreatLevel } from "@/components/ThreatLevel";
import { AlertsPanel } from "@/components/AlertsPanel";
import { TrafficChart, ProtocolChart } from "@/components/NetworkCharts";
import { NetworkTable } from "@/components/NetworkTable";
import { StatCard } from "@/components/StatCard";
import { AnomalyScoreChart } from "@/components/AnomalyScoreChart";
import { DataEntryPanel } from "@/components/DataEntryPanel";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import {
  generateNetworkLog,
  generateAlert,
  computeMetrics,
  generateTimeSeriesData,
  generateProtocolData,
  type NetworkLog,
  type Alert,
  type ThreatMetrics,
  type AnalysisRecord,
} from "@/lib/cyberEngine";

export default function Index() {
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<ThreatMetrics>({
    totalPackets: 0,
    anomaliesDetected: 0,
    threatLevel: "Low",
    activeConnections: 0,
    blockedIPs: 0,
    avgAnomalyScore: 0,
  });
  const [timeSeriesData] = useState(generateTimeSeriesData);
  const [protocolData] = useState(generateProtocolData);
  const [anomalyTimeline, setAnomalyTimeline] = useState<Array<{ time: string; score: number }>>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const handleAnalysisComplete = useCallback((record: AnalysisRecord) => {
    setAnalysisHistory(prev => [record, ...prev].slice(0, 50));
  }, []);

  const ingestLog = useCallback(() => {
    const log = generateNetworkLog();
    setLogs(prev => {
      const updated = [log, ...prev].slice(0, 200);
      setMetrics(computeMetrics(updated));
      return updated;
    });

    const alert = generateAlert(log);
    if (alert) {
      setAlerts(prev => [alert, ...prev].slice(0, 50));
    }

    setAnomalyTimeline(prev => [
      ...prev.slice(-29),
      { time: new Date().toLocaleTimeString(), score: log.anomalyScore },
    ]);
  }, []);

  useEffect(() => {
    // Seed initial data
    for (let i = 0; i < 30; i++) ingestLog();
  }, [ingestLog]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(ingestLog, 1500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, ingestLog]);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="min-h-screen bg-background cyber-grid scanline">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="h-7 w-7 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wider text-foreground">
                CYBER<span className="text-primary">SHIELD</span> AI
              </h1>
              <p className="text-xs text-muted-foreground font-mono tracking-wide">Early Attack Prediction System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary/30 text-primary text-sm font-display tracking-wider hover:bg-primary/10 transition-colors"
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isRunning ? "PAUSE" : "RESUME"}
            </button>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? "bg-neon-green" : "bg-neon-orange"} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? "bg-neon-green" : "bg-neon-orange"}`} />
              </span>
              <span className="text-xs text-muted-foreground font-mono">{isRunning ? "MONITORING" : "PAUSED"}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Packets" value={metrics.totalPackets} icon={Database} variant="blue" trend="+12.5% from last hour" />
          <StatCard title="Anomalies" value={metrics.anomaliesDetected} icon={AlertTriangle} variant="red" trend={`${metrics.avgAnomalyScore} avg score`} />
          <StatCard title="Active Connections" value={metrics.activeConnections} icon={Activity} variant="green" trend="142 new this hour" />
          <StatCard title="Blocked IPs" value={metrics.blockedIPs} icon={Zap} variant="orange" trend="Auto-blocked by AI" />
        </div>

        {/* Threat Level + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ThreatLevel metrics={metrics} />
          <div className="lg:col-span-2">
            <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledge} />
          </div>
        </div>

        {/* Data Entry & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataEntryPanel onAnalysisComplete={handleAnalysisComplete} />
          <AnalysisHistory records={analysisHistory} />
        </div>

        {/* Anomaly Score Timeline */}
        <AnomalyScoreChart data={anomalyTimeline} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficChart data={timeSeriesData} />
          <ProtocolChart data={protocolData} />
        </div>

        {/* Network Logs Table */}
        <NetworkTable logs={logs} />

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-mono">
            <Eye className="h-3.5 w-3.5" />
            <span>Isolation Forest ML Engine • Real-time Anomaly Detection • {logs.length} logs processed</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
