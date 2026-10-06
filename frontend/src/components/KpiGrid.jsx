import { Activity, TrendingUp, Scale, ShieldAlert, Layers } from "lucide-react";
import { money, fmtDateTime } from "../lib/portfolio";

const Kpi = ({ testId, icon: Icon, label, value, sub, tone, delay }) => (
  <div data-testid={testId} className="qf-card qf-rise p-5 flex flex-col gap-3" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center justify-between">
      <span className="qf-label">{label}</span>
      <Icon className="h-4 w-4 text-slate-500" />
    </div>
    <span className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight ${tone || "text-slate-50"}`}>{value}</span>
    <span className="text-xs text-slate-400 font-mono leading-relaxed">{sub}</span>
  </div>
);

export const KpiGrid = ({ p, activeCount }) => {
  const { stats, dd, start, final } = p;
  const roi = start ? (stats.net / start) * 100 : 0;
  return (
    <div data-testid="combined-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <Kpi testId="kpi-card-total-profit" icon={TrendingUp} label="Combined Net Profit" delay={0}
        value={money(stats.net, true)} tone={stats.net >= 0 ? "text-emerald-400" : "text-red-400"}
        sub={`${roi.toFixed(2)}% ROI · final ${money(final)}`} />
      <Kpi testId="kpi-card-max-drawdown" icon={ShieldAlert} label="True Max Drawdown" delay={60}
        value={`-${money(dd.amount)}`} tone="text-red-400"
        sub={dd.peakTime ? `${((dd.amount / dd.peakBal) * 100).toFixed(2)}% · ${fmtDateTime(dd.peakTime)} → ${fmtDateTime(dd.troughTime)}` : "No drawdown"} />
      <Kpi testId="kpi-card-profit-factor" icon={Scale} label="Combined Profit Factor" delay={120}
        value={Number.isFinite(stats.pf) ? stats.pf.toFixed(2) : "∞"} tone={stats.pf >= 1 ? "text-slate-50" : "text-red-400"}
        sub={`GP ${money(stats.grossProfit)} / GL ${money(stats.grossLoss)}`} />
      <Kpi testId="kpi-card-total-trades" icon={Activity} label="Total Trades" delay={180}
        value={stats.trades.toLocaleString()} sub={`${(stats.winRate * 100).toFixed(2)}% win rate · ${stats.wins} wins`} />
      <Kpi testId="kpi-card-active-strategies" icon={Layers} label="Active Reports" delay={240}
        value={activeCount} sub={`Max DD % ${(dd.pct * 100).toFixed(2)}% (${money(dd.pctAmount)})`} />
    </div>
  );
};
