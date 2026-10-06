import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { money, fmtDateTime, REPORT_COLORS } from "../lib/portfolio";

export const DealList = ({ deals, colorOf }) => (
  <div className="max-h-72 overflow-y-auto border-t border-slate-800 bg-black/20">
    {deals.map((e, i) => (
      <div key={i} className="grid grid-cols-[150px_1fr_60px_90px] gap-2 px-3 py-1.5 font-mono text-[11px] border-b border-slate-800/40">
        <span className="text-slate-400">{fmtDateTime(e.time)}</span>
        <span className="truncate text-slate-300">
          <span className="inline-block h-1.5 w-1.5 mr-1.5 align-middle" style={{ background: colorOf(e.ri) }} />
          {e.report} <span className="text-slate-500">{e.comment}</span>
        </span>
        <span className="text-slate-500">{e.type} {e.direction}</span>
        <span className={`text-right ${e.net >= 0 ? "text-emerald-400" : "text-red-400"}`}>{money(e.net)}</span>
      </div>
    ))}
  </div>
);

export const WorstDays = ({ p, colorOf }) => {
  const [open, setOpen] = useState(null);
  return (
    <div data-testid="worst-days-container" className="qf-card qf-rise p-5" style={{ animationDelay: "240ms" }}>
      <h2 className="font-heading text-base md:text-lg font-semibold text-slate-100 mb-1">Worst Days (Combined)</h2>
      <p className="qf-label mb-4">Click a day to see every deal with its exact SL time</p>
      {p.worstDays.length === 0 && <p className="text-sm text-slate-500">No losing days.</p>}
      <div className="flex flex-col">
        {p.worstDays.map((d, i) => (
          <div key={d.day} className="border-b border-slate-800/60">
            <button data-testid={`worst-day-row-${i}`} onClick={() => setOpen(open === d.day ? null : d.day)}
              className="w-full grid grid-cols-[18px_100px_1fr_auto] items-center gap-3 py-2.5 text-left hover:bg-slate-800/30 transition-colors">
              <ChevronRight className={`h-3.5 w-3.5 text-slate-500 transition-transform ${open === d.day ? "rotate-90" : ""}`} />
              <span className="font-mono text-xs text-slate-200">{d.day}</span>
              <span className="font-mono text-[11px] text-slate-500">
                {d.losses} SL/loss · {d.losingReports} report{d.losingReports === 1 ? "" : "s"} · intraday DD {money(d.intraDD)}
              </span>
              <span className="font-mono text-xs text-red-400 pr-2">{money(d.total)}</span>
            </button>
            {open === d.day && <DealList deals={d.deals} colorOf={colorOf} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DrawdownWindow = ({ p, colorOf }) => {
  const [show, setShow] = useState(false);
  if (!p.dd.peakTime) return null;
  return (
    <div data-testid="max-dd-window" className="qf-card qf-rise p-5 border-l-2 !border-l-red-500" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-base md:text-lg font-semibold text-slate-100">Max Drawdown Window</h2>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Peak {money(p.dd.peakBal)} @ {fmtDateTime(p.dd.peakTime)} → Trough {money(p.dd.troughBal)} @ {fmtDateTime(p.dd.troughTime)}
          </p>
        </div>
        <button data-testid="toggle-dd-deals-button" onClick={() => setShow(!show)}
          className="px-4 py-2 text-xs font-mono border border-slate-700 hover:border-red-400 hover:text-red-300 transition-colors text-slate-300">
          {show ? "Hide" : "Show"} {p.ddDeals.length} deals in this window
        </button>
      </div>
      {show && <div className="mt-4"><DealList deals={p.ddDeals} colorOf={colorOf} /></div>}
    </div>
  );
};
