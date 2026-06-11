// Simulated Isolation Forest anomaly detection engine
// In production, this would call a Python/FastAPI backend

export interface NetworkLog {
  id: string;
  timestamp: Date;
  sourceIP: string;
  destIP: string;
  protocol: string;
  packetSize: number;
  port: number;
  duration: number;
  bytesIn: number;
  bytesOut: number;
  anomalyScore: number;
  label: "Normal" | "Suspicious" | "High Risk";
}

export interface Alert {
  id: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  sourceIP: string;
  type: string;
  acknowledged: boolean;
}

export interface AnalysisRecord {
  id: string;
  timestamp: Date;
  inputType: "manual" | "csv";
  totalLogs: number;
  results: NetworkLog[];
  summary: {
    normal: number;
    suspicious: number;
    highRisk: number;
    avgScore: number;
  };
}

export interface ThreatMetrics {
  totalPackets: number;
  anomaliesDetected: number;
  threatLevel: "Low" | "Medium" | "High" | "Critical";
  activeConnections: number;
  blockedIPs: number;
  avgAnomalyScore: number;
}

const PROTOCOLS = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP"];
const ATTACK_TYPES = [
  "Port Scan Detected",
  "DDoS Pattern",
  "Brute Force Attempt",
  "Data Exfiltration",
  "SQL Injection Probe",
  "Unusual DNS Query",
  "Privilege Escalation",
  "Lateral Movement",
];

function randomIP(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Simulated Isolation Forest scoring
export function isolationForestScore(log: Partial<NetworkLog>): number {
  let score = 0;
  const pSize = log.packetSize || 0;
  const dur = log.duration || 0;
  const bOut = log.bytesOut || 0;

  // Anomalous packet sizes
  if (pSize > 8000 || pSize < 20) score += 0.3;
  // Very short or very long connections
  if (dur < 0.01 || dur > 300) score += 0.2;
  // High outbound traffic ratio
  if (bOut > (log.bytesIn || 1) * 5) score += 0.25;
  // Suspicious ports
  if (log.port && [4444, 31337, 1337, 6667, 8888].includes(log.port)) score += 0.35;
  // Random noise
  score += (Math.random() - 0.5) * 0.15;

  return Math.max(0, Math.min(1, score));
}

export function labelFromScore(score: number): NetworkLog["label"] {
  if (score > 0.65) return "High Risk";
  if (score > 0.35) return "Suspicious";
  return "Normal";
}

export function generateNetworkLog(): NetworkLog {
  const isAnomaly = Math.random() < 0.15;
  const port = isAnomaly
    ? [4444, 31337, 1337, 8888, 6667][Math.floor(Math.random() * 5)]
    : [80, 443, 22, 53, 8080, 3306, 5432][Math.floor(Math.random() * 7)];

  const packetSize = isAnomaly
    ? Math.random() < 0.5 ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 5000) + 8000
    : Math.floor(Math.random() * 2000) + 64;

  const bytesIn = Math.floor(Math.random() * 50000) + 100;
  const bytesOut = isAnomaly ? bytesIn * (Math.random() * 10 + 5) : bytesIn * (Math.random() * 1.5 + 0.2);

  const partial: Partial<NetworkLog> = {
    packetSize,
    port,
    duration: isAnomaly ? (Math.random() < 0.5 ? 0.001 : 500 + Math.random() * 200) : Math.random() * 60 + 0.1,
    bytesIn,
    bytesOut,
  };

  const anomalyScore = isolationForestScore(partial);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    sourceIP: randomIP(),
    destIP: randomIP(),
    protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
    packetSize,
    port,
    duration: partial.duration!,
    bytesIn,
    bytesOut: Math.floor(bytesOut),
    anomalyScore: Math.round(anomalyScore * 100) / 100,
    label: labelFromScore(anomalyScore),
  };
}

export function generateAlert(log: NetworkLog): Alert | null {
  if (log.label === "Normal") return null;
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    severity: log.label === "High Risk"
      ? (Math.random() > 0.5 ? "critical" : "high")
      : (Math.random() > 0.5 ? "medium" : "low"),
    message: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
    sourceIP: log.sourceIP,
    type: log.protocol,
    acknowledged: false,
  };
}

export function computeMetrics(logs: NetworkLog[]): ThreatMetrics {
  const anomalies = logs.filter(l => l.label !== "Normal");
  const avgScore = logs.length > 0
    ? logs.reduce((s, l) => s + l.anomalyScore, 0) / logs.length
    : 0;

  let threatLevel: ThreatMetrics["threatLevel"] = "Low";
  const ratio = logs.length > 0 ? anomalies.length / logs.length : 0;
  if (ratio > 0.3) threatLevel = "Critical";
  else if (ratio > 0.2) threatLevel = "High";
  else if (ratio > 0.1) threatLevel = "Medium";

  return {
    totalPackets: logs.length,
    anomaliesDetected: anomalies.length,
    threatLevel,
    activeConnections: Math.floor(Math.random() * 500) + 100,
    blockedIPs: Math.floor(anomalies.length * 0.3),
    avgAnomalyScore: Math.round(avgScore * 100) / 100,
  };
}

// Generate time-series data for charts
export function generateTimeSeriesData(points: number = 24) {
  return Array.from({ length: points }, (_, i) => {
    const normal = Math.floor(Math.random() * 800) + 200;
    const suspicious = Math.floor(Math.random() * 80) + 10;
    const highRisk = Math.floor(Math.random() * 25);
    return {
      time: `${String(i).padStart(2, "0")}:00`,
      normal,
      suspicious,
      highRisk,
      total: normal + suspicious + highRisk,
    };
  });
}

export function generateProtocolData() {
  return PROTOCOLS.map(p => ({
    name: p,
    count: Math.floor(Math.random() * 5000) + 200,
    anomalies: Math.floor(Math.random() * 200),
  }));
}
