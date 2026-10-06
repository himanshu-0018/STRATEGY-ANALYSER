# QuantFolio – MT5 Portfolio Analyser

## Problem Statement
StrategyQuant-like analyser: upload multiple MT5 Strategy Tester HTML reports, analyse each separately and show combined: total trades, total profit, profit factor, true chronological max drawdown (deal-by-deal, SL times across reports), combined equity chart, monthly profit.

## User Choices
Browser-only (no saving), single custom starting balance, deal-level DD, no login.

## Architecture
Frontend-only React. `lib/mt5Parser.js` (UTF-16/UTF-8 decode, DOMParser, Deals table), `lib/portfolio.js` (merge, stats, DD walk, monthly, worst days). Sample reports in `public/samples`.

## Implemented (2026-06)
- Multi-file drag/drop upload, per-report table (include toggle, remove), numbers match MT5 report
- Combined KPIs: net profit/ROI, true max DD $ & % with peak/trough timestamps, PF (MT5 convention), trades, win rate
- Combined balance curve + underwater chart, max-DD window deal list
- Monthly profit (bar + per-report matrix), worst days with per-deal timestamps

## Backlog
- P1: Lot-size multiplier per report, floating equity estimate, CSV/PDF export
- P2: Correlation matrix between strategies, Monte Carlo, save portfolios
