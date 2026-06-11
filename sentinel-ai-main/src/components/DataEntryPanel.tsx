import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, FileText, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isolationForestScore, labelFromScore, type NetworkLog, type AnalysisRecord } from "@/lib/cyberEngine";

interface DataEntryPanelProps {
  onAnalysisComplete: (record: AnalysisRecord) => void;
}

interface ManualEntry {
  sourceIP: string;
  destIP: string;
  protocol: string;
  port: string;
  packetSize: string;
  duration: string;
  bytesIn: string;
  bytesOut: string;
}

const emptyEntry: ManualEntry = {
  sourceIP: "",
  destIP: "",
  protocol: "TCP",
  port: "",
  packetSize: "",
  duration: "",
  bytesIn: "",
  bytesOut: "",
};

const PROTOCOLS = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP"];

export function DataEntryPanel({ onAnalysisComplete }: DataEntryPanelProps) {
  const [entry, setEntry] = useState<ManualEntry>(emptyEntry);
  const [csvText, setCsvText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<NetworkLog[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEntry = useCallback((data: Partial<NetworkLog>): NetworkLog => {
    const score = isolationForestScore(data);
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      sourceIP: data.sourceIP || "0.0.0.0",
      destIP: data.destIP || "0.0.0.0",
      protocol: data.protocol || "TCP",
      packetSize: data.packetSize || 0,
      port: data.port || 80,
      duration: data.duration || 0,
      bytesIn: data.bytesIn || 0,
      bytesOut: data.bytesOut || 0,
      anomalyScore: Math.round(score * 100) / 100,
      label: labelFromScore(score),
    };
  }, []);

  const handleManualSubmit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const log = analyzeEntry({
        sourceIP: entry.sourceIP || "192.168.1.1",
        destIP: entry.destIP || "10.0.0.1",
        protocol: entry.protocol,
        port: parseInt(entry.port) || 80,
        packetSize: parseInt(entry.packetSize) || 500,
        duration: parseFloat(entry.duration) || 1,
        bytesIn: parseInt(entry.bytesIn) || 1000,
        bytesOut: parseInt(entry.bytesOut) || 500,
      });
      const results = [log];
      setAnalysisResult(results);
      setIsAnalyzing(false);

      onAnalysisComplete({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        inputType: "manual",
        totalLogs: 1,
        results,
        summary: {
          normal: results.filter(r => r.label === "Normal").length,
          suspicious: results.filter(r => r.label === "Suspicious").length,
          highRisk: results.filter(r => r.label === "High Risk").length,
          avgScore: log.anomalyScore,
        },
      });
    }, 800);
  };

  const handleCSVSubmit = () => {
    if (!csvText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const lines = csvText.trim().split("\n");
      const header = lines[0]?.toLowerCase().split(",").map(h => h.trim());
      const results: NetworkLog[] = [];

      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map(v => v.trim());
        if (vals.length < 2) continue;

        const get = (name: string) => {
          const idx = header?.indexOf(name) ?? -1;
          return idx >= 0 ? vals[idx] : undefined;
        };

        const log = analyzeEntry({
          sourceIP: get("sourceip") || get("source_ip") || get("src") || "0.0.0.0",
          destIP: get("destip") || get("dest_ip") || get("dst") || "0.0.0.0",
          protocol: get("protocol") || "TCP",
          port: parseInt(get("port") || "80"),
          packetSize: parseInt(get("packetsize") || get("packet_size") || "500"),
          duration: parseFloat(get("duration") || "1"),
          bytesIn: parseInt(get("bytesin") || get("bytes_in") || "1000"),
          bytesOut: parseInt(get("bytesout") || get("bytes_out") || "500"),
        });
        results.push(log);
      }

      setAnalysisResult(results);
      setIsAnalyzing(false);

      if (results.length > 0) {
        const avgScore = results.reduce((s, r) => s + r.anomalyScore, 0) / results.length;
        onAnalysisComplete({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          inputType: "csv",
          totalLogs: results.length,
          results,
          summary: {
            normal: results.filter(r => r.label === "Normal").length,
            suspicious: results.filter(r => r.label === "Suspicious").length,
            highRisk: results.filter(r => r.label === "High Risk").length,
            avgScore: Math.round(avgScore * 100) / 100,
          },
        });
      }
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  const clearResults = () => {
    setAnalysisResult(null);
    setEntry(emptyEntry);
    setCsvText("");
  };

  const labelIcon = (label: string) => {
    if (label === "High Risk") return <XCircle className="h-4 w-4 text-destructive" />;
    if (label === "Suspicious") return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <CheckCircle className="h-4 w-4 text-accent" />;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Data Input & Analysis
        </h3>
        {analysisResult && (
          <Button variant="ghost" size="sm" onClick={clearResults} className="text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="bg-secondary/50 border border-border w-full">
          <TabsTrigger value="manual" className="flex-1 font-display text-xs tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            MANUAL ENTRY
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex-1 font-display text-xs tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            CSV / BATCH
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-3 mt-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Source IP</label>
              <Input
                placeholder="192.168.1.1"
                value={entry.sourceIP}
                onChange={e => setEntry(p => ({ ...p, sourceIP: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Dest IP</label>
              <Input
                placeholder="10.0.0.1"
                value={entry.destIP}
                onChange={e => setEntry(p => ({ ...p, destIP: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Protocol</label>
              <select
                value={entry.protocol}
                onChange={e => setEntry(p => ({ ...p, protocol: e.target.value }))}
                className="flex h-8 w-full rounded-md border border-border bg-secondary/30 px-2 py-1 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              >
                {PROTOCOLS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Port</label>
              <Input
                type="number"
                placeholder="80"
                value={entry.port}
                onChange={e => setEntry(p => ({ ...p, port: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Packet Size (B)</label>
              <Input
                type="number"
                placeholder="500"
                value={entry.packetSize}
                onChange={e => setEntry(p => ({ ...p, packetSize: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Duration (s)</label>
              <Input
                type="number"
                placeholder="1.5"
                value={entry.duration}
                onChange={e => setEntry(p => ({ ...p, duration: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Bytes In</label>
              <Input
                type="number"
                placeholder="1000"
                value={entry.bytesIn}
                onChange={e => setEntry(p => ({ ...p, bytesIn: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">Bytes Out</label>
              <Input
                type="number"
                placeholder="500"
                value={entry.bytesOut}
                onChange={e => setEntry(p => ({ ...p, bytesOut: e.target.value }))}
                className="h-8 text-xs font-mono bg-secondary/30 border-border focus:border-primary"
              />
            </div>
          </div>
          <Button
            onClick={handleManualSubmit}
            disabled={isAnalyzing}
            className="w-full font-display tracking-wider text-xs bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
          >
            {isAnalyzing ? (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                ANALYZING...
              </motion.span>
            ) : (
              <><Send className="h-3.5 w-3.5 mr-1.5" /> RUN ANOMALY DETECTION</>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="csv" className="space-y-3 mt-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 h-10 rounded-md border border-dashed border-border bg-secondary/20 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  Upload CSV file
                </div>
                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <Textarea
              placeholder={"sourceip,destip,protocol,port,packetsize,duration,bytesin,bytesout\n192.168.1.1,10.0.0.5,TCP,4444,9500,0.001,1000,50000\n10.0.0.2,172.16.0.1,HTTP,80,512,2.5,2000,1500"}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              className="min-h-[120px] text-xs font-mono bg-secondary/30 border-border focus:border-primary resize-none"
            />
            <p className="text-[10px] text-muted-foreground font-mono">
              Headers: sourceip, destip, protocol, port, packetsize, duration, bytesin, bytesout
            </p>
          </div>
          <Button
            onClick={handleCSVSubmit}
            disabled={isAnalyzing || !csvText.trim()}
            className="w-full font-display tracking-wider text-xs bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
          >
            {isAnalyzing ? (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                ANALYZING BATCH...
              </motion.span>
            ) : (
              <><Send className="h-3.5 w-3.5 mr-1.5" /> ANALYZE CSV DATA</>
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && analysisResult.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border pt-4 space-y-3"
          >
            <h4 className="font-display text-xs tracking-widest text-primary uppercase">
              Analysis Results — {analysisResult.length} log{analysisResult.length > 1 ? "s" : ""}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-accent/10 border border-accent/20 p-2 text-center">
                <p className="text-lg font-display text-accent">{analysisResult.filter(r => r.label === "Normal").length}</p>
                <p className="text-[10px] font-mono text-muted-foreground">NORMAL</p>
              </div>
              <div className="rounded-md bg-warning/10 border border-warning/20 p-2 text-center">
                <p className="text-lg font-display text-warning">{analysisResult.filter(r => r.label === "Suspicious").length}</p>
                <p className="text-[10px] font-mono text-muted-foreground">SUSPICIOUS</p>
              </div>
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2 text-center">
                <p className="text-lg font-display text-destructive">{analysisResult.filter(r => r.label === "High Risk").length}</p>
                <p className="text-[10px] font-mono text-muted-foreground">HIGH RISK</p>
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-1.5">
              {analysisResult.map(r => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/30 border border-border text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {labelIcon(r.label)}
                    <span className="text-muted-foreground">{r.sourceIP}</span>
                    <span className="text-muted-foreground/50">→</span>
                    <span className="text-muted-foreground">{r.destIP}</span>
                    <span className="text-foreground/60">{r.protocol}:{r.port}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={r.anomalyScore > 0.65 ? "text-destructive" : r.anomalyScore > 0.35 ? "text-warning" : "text-accent"}>
                      {r.anomalyScore.toFixed(2)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-display border ${
                      r.label === "High Risk" ? "text-destructive bg-destructive/10 border-destructive/20" :
                      r.label === "Suspicious" ? "text-warning bg-warning/10 border-warning/20" :
                      "text-accent bg-accent/10 border-accent/20"
                    }`}>
                      {r.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
