import React from 'react';
import MarketTable from '../components/MarketTable.jsx';
import TradingViewChart from '../components/TradingViewChart.jsx';

export default function MarketsPage({ currency, onCurrencyToggle, theme, onSparklinesUpdate }) {
  return (
    <div className="py-6">
      {/* ── Main CoinMarketCap Market Table Suite ── */}
      <MarketTable
        currency={currency}
        onCurrencyToggle={onCurrencyToggle}
        onSparklinesUpdate={onSparklinesUpdate}
      />

      {/* ── Official TradingView Advanced Chart Terminal (https://www.tradingview.com/chart/) ── */}
      <section id="tradingview-terminal" className="mt-16 max-w-7xl mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Technical Analysis Station</p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-bluechip-950 mt-1">
              TradingView Advanced Real-Time Chart
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Professional charting workstation powered by TradingView. Use multi-timeframe candles, indicators (RSI, MACD, Volume), drawing tools, and search any symbol.
            </p>
          </div>
        </div>

        <TradingViewChart theme={theme} initialSymbol="BINANCE:BTCUSDT" />
      </section>
    </div>
  );
}

