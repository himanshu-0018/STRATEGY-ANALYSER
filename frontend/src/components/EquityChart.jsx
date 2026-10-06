import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ReferenceArea } from "recharts";
import { fmtDate, fmtDateTime, money } from "../lib/portfolio";

const sample = (arr, max = 2500) => {
  if (arr.length <= max) return arr;
  const step = Math.ceil(arr.length / max);
  return arr.filter((_, i) => i % step === 0 || i === arr.length - 1);
};

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="qf-tooltip">
      <div className="text-slate-400">{fmtDateTime(d.time)}</div>
      <div className="text-cyan-300">Balance {money(d.balance)}</div>
      <div className="text-red-400">DD {money(d.dd)} ({d.ddPct.toFixed(2)}%)</div>
    </div>
  );
};

export const EquityChart = ({ p }) => {
  const [mode, setMode] = useState("usd");
  const data = useMemo(() => sample([{ time: p.curve[0]?.time - 1, balance: p.start, dd: 0, ddPct: 0 }, ...p.curve]), [p]);
  const axis = { stroke: "#475569", fontSize: 11, fontFamily: "JetBrains Mono", tickLine: false, axisLine: false };
  const ddKey = mode === "usd" ? "dd" : "ddPct";
  return (
    <div data-testid="combined-equity-chart-container" className="qf-card qf-rise p-5" style={{ animationDelay: "120ms" }}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-heading text-base md:text-lg font-semibold text-slate-100">Combined Balance Curve</h2>
          <p className="qf-label mt-1">Deal-by-deal, all reports merged chronologically</p>
        </div>
        <div data-testid="chart-mode-toggle-group" className="flex border border-slate-700">
          {["usd", "pct"].map((m) => (
            <button key={m} data-testid={`chart-mode-${m}`} onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-mono transition-colors ${mode === m ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:text-slate-200"}`}>
              DD {m === "usd" ? "$" : "%"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} syncId="eq" margin={{ left: 8, right: 8, top: 4 }}>
          <defs>
            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1F2937" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="time" type="number" scale="time" domain={["dataMin", "dataMax"]} tickFormatter={fmtDate} {...axis} minTickGap={60} />
          <YAxis domain={["auto", "auto"]} tickFormatter={(v) => `$${Math.round(v)}`} {...axis} width={70} />
          <Tooltip content={<Tip />} />
          {p.dd.peakTime && <ReferenceArea x1={p.dd.peakTime} x2={p.dd.troughTime} fill="#EF4444" fillOpacity={0.08} />}
          <ReferenceLine y={p.start} stroke="#475569" strokeDasharray="4 4" />
          <Area type="stepAfter" dataKey="balance" stroke="#22D3EE" strokeWidth={1.6} fill="url(#eqFill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="qf-label mt-4 mb-2">Underwater (drawdown from peak)</p>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} syncId="eq" margin={{ left: 8, right: 8 }}>
          <CartesianGrid stroke="#1F2937" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="time" type="number" scale="time" domain={["dataMin", "dataMax"]} tickFormatter={fmtDate} {...axis} minTickGap={60} />
          <YAxis tickFormatter={(v) => (mode === "usd" ? `$${Math.round(v)}` : `${v.toFixed(1)}%`)} {...axis} width={70} />
          <Tooltip content={<Tip />} />
          <Area type="stepAfter" dataKey={ddKey} stroke="#EF4444" strokeWidth={1.2} fill="#EF4444" fillOpacity={0.18} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
