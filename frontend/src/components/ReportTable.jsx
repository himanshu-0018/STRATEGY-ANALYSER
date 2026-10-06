import { Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { money, fmtDate, REPORT_COLORS } from "../lib/portfolio";

const H = ({ children, right }) => <th className={`qf-label py-3 px-3 font-medium ${right ? "text-right" : "text-left"}`}>{children}</th>;
const C = ({ children, right, className = "" }) => <td className={`py-3 px-3 font-mono text-xs ${right ? "text-right" : ""} ${className}`}>{children}</td>;

export const ReportTable = ({ reports, summaries, enabled, onToggle, onRemove }) => (
  <div data-testid="per-report-table-container" className="qf-card qf-rise p-5 overflow-x-auto" style={{ animationDelay: "60ms" }}>
    <h2 className="font-heading text-base md:text-lg font-semibold text-slate-100 mb-1">Individual Reports</h2>
    <p className="qf-label mb-4">Each file analysed separately on its own initial deposit</p>
    <table className="w-full min-w-[900px]">
      <thead className="border-b border-slate-800">
        <tr><H>Use</H><H>Strategy</H><H>Symbol / TF</H><H>Range</H><H right>Deposit</H><H right>Trades</H><H right>Net Profit</H><H right>PF</H><H right>Win %</H><H right>Max DD</H><H /></tr>
      </thead>
      <tbody>
        {reports.map((r, i) => {
          const s = summaries[r.id];
          return (
            <tr key={r.id} data-testid={`per-report-row-${i}`} className={`border-b border-slate-800/60 transition-colors hover:bg-slate-800/30 ${enabled[r.id] ? "" : "opacity-40"}`}>
              <C><Checkbox data-testid={`report-include-checkbox-${i}`} checked={enabled[r.id]} onCheckedChange={() => onToggle(r.id)} /></C>
              <C className="font-sans text-sm text-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0" style={{ background: REPORT_COLORS[i % REPORT_COLORS.length] }} />
                  <span className="truncate max-w-[260px]" title={r.expert}>{r.expert}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-[260px]">{r.fileName}</div>
              </C>
              <C>{r.symbol} · {r.timeframe}</C>
              <C className="text-slate-400">{fmtDate(s.from)} → {fmtDate(s.to)}</C>
              <C right>{money(r.initialDeposit)}</C>
              <C right>{s.trades}</C>
              <C right className={s.net >= 0 ? "text-emerald-400" : "text-red-400"}>{money(s.net, true)}</C>
              <C right>{Number.isFinite(s.pf) ? s.pf.toFixed(2) : "∞"}</C>
              <C right>{(s.winRate * 100).toFixed(1)}%</C>
              <C right className="text-red-400">-{money(s.dd.amount)} <span className="text-slate-500">({(s.dd.pct * 100).toFixed(2)}%)</span></C>
              <C right>
                <button data-testid={`report-remove-button-${i}`} onClick={() => onRemove(r.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </C>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
