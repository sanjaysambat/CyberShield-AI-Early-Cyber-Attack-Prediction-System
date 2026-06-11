import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "blue" | "green" | "red" | "orange";
}

const variants = {
  blue: "border-neon-blue/20 glow-blue",
  green: "border-neon-green/20 glow-green",
  red: "border-neon-red/20 glow-red",
  orange: "border-neon-orange/20 glow-orange",
};

const iconVariants = {
  blue: "text-neon-blue",
  green: "text-neon-green",
  red: "text-neon-red",
  orange: "text-neon-orange",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "blue" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border bg-card p-5 ${variants[variant]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-xs tracking-widest text-muted-foreground uppercase">{title}</span>
        <Icon className={`h-4 w-4 ${iconVariants[variant]}`} />
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {trend && <p className="text-xs text-muted-foreground mt-1 font-mono">{trend}</p>}
    </motion.div>
  );
}
