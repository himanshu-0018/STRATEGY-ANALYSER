const num = (s) => {
  if (s == null) return 0;
  const v = parseFloat(String(s).replace(/[\s\u00a0]/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

const parseTime = (s) => {
  const m = s.match(/(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
};

const decode = (buf) => {
  const b = new Uint8Array(buf);
  if (b[0] === 0xff && b[1] === 0xfe) return new TextDecoder("utf-16le").decode(buf);
  if (b[0] === 0xfe && b[1] === 0xff) return new TextDecoder("utf-16be").decode(buf);
  if (b.length > 1 && b[1] === 0 && b[0] !== 0) return new TextDecoder("utf-16le").decode(buf);
  return new TextDecoder("utf-8").decode(buf);
};

const cellText = (td) => (td.textContent || "").replace(/\u00a0/g, " ").trim();

const findValue = (cells, label) => {
  const i = cells.findIndex((t) => t.toLowerCase() === label.toLowerCase());
  return i >= 0 ? cells[i + 1] : undefined;
};

const OUT_DIRS = new Set(["out", "in/out", "out by"]);

export function parseMt5Report(buffer, fileName) {
  const html = decode(buffer);
  const doc = new DOMParser().parseFromString(html, "text/html");
  const cells = Array.from(doc.querySelectorAll("td")).map(cellText);

  const dealsHeader = Array.from(doc.querySelectorAll("th, b")).find((el) => cellText(el) === "Deals");
  if (!dealsHeader) throw new Error("No 'Deals' table found. Is this an MT5 Strategy Tester HTML report?");

  const table = dealsHeader.closest("table");
  const rows = Array.from(table.querySelectorAll("tr"));
  const startIdx = rows.findIndex((r) => r.contains(dealsHeader));
  const deals = [];
  for (let i = startIdx + 1; i < rows.length; i++) {
    const tds = Array.from(rows[i].querySelectorAll("td")).map(cellText);
    if (tds.length < 13) continue;
    const time = parseTime(tds[0]);
    if (time == null) continue;
    const type = tds[3].toLowerCase();
    if (type !== "buy" && type !== "sell") continue;
    const direction = tds[4].toLowerCase();
    const commission = num(tds[8]);
    const swap = num(tds[9]);
    const profit = num(tds[10]);
    deals.push({
      time,
      deal: tds[1],
      symbol: tds[2],
      type,
      direction,
      volume: num(tds[5]),
      price: num(tds[6]),
      commission,
      swap,
      profit,
      net: commission + swap + profit,
      isOut: OUT_DIRS.has(direction),
      comment: tds[12],
    });
  }
  if (!deals.length) throw new Error("No trade deals found in report.");
  deals.sort((a, b) => a.time - b.time);

  const expert = findValue(cells, "Expert:") || fileName;
  const period = findValue(cells, "Period:") || "";
  return {
    id: `${fileName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fileName,
    expert,
    symbol: findValue(cells, "Symbol:") || deals[0].symbol,
    period,
    timeframe: period.split(" ")[0],
    initialDeposit: num(findValue(cells, "Initial Deposit:")) || 1000,
    reported: {
      netProfit: num(findValue(cells, "Total Net Profit:")),
      profitFactor: num(findValue(cells, "Profit Factor:")),
      equityDD: findValue(cells, "Equity Drawdown Maximal:") || "",
      totalTrades: num(findValue(cells, "Total Trades:")),
    },
    deals,
  };
}
