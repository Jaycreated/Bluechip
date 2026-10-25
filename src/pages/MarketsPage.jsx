import React, { useState } from 'react';
import MarketTable from '../components/MarketTable.jsx';
import TradingViewChart from '../components/TradingViewChart.jsx';

const toTradingViewSymbol = (coinSymbol) => {
  const symbol = String(coinSymbol || '').toUpperCase();
  if (!symbol || symbol === 'USDT') return 'BINANCE:BTCUSDT';
  return `BINANCE:${symbol}USDT`;
};

export default function MarketsPage({ currency, onCurrencyToggle, theme, onSparklinesUpdate }) {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  const [selectedCoin, setSelectedCoin] = useState({ name: 'Bitcoin', symbol: 'BTC' });
  const [isChartOpen, setIsChartOpen] = useState(false);

  const handleCoinSelect = (coin) => {
    const nextSymbol = toTradingViewSymbol(coin?.symbol);
    const safeCoin = coin || { name: 'Bitcoin', symbol: 'BTC' };
    setSelectedCoin(safeCoin);
    setSelectedSymbol(nextSymbol);
    setIsChartOpen(true);

    setTimeout(() => {
      const chartSection = document.getElementById('tradingview-terminal');
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  return (
    <div className="py-6">
      {/* ── Focused chart first, like CoinMarketCap detail view ── */}
      {isChartOpen && (
        <section id="tradingview-terminal" className="max-w-7xl mx-auto px-4 mb-8 scroll-mt-28">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-bluechip-50 text-bluechip-700 grid place-items-center font-black text-lg">
                {(selectedCoin?.symbol || 'BTC').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Selected Asset</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-bluechip-950">
                  {selectedCoin?.name || 'Bitcoin'} <span className="text-slate-400">{(selectedCoin?.symbol || 'BTC').toUpperCase()}</span>
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-bluechip-600">Live chart</span>
              </div>
              <button
                type="button"
                onClick={() => setIsChartOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-extrabold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>

          <TradingViewChart
            theme={theme}
            initialSymbol="BINANCE:BTCUSDT"
            selectedSymbol={selectedSymbol}
            onSymbolChange={setSelectedSymbol}
          />
        </section>
      )}

      {/* ── Main CoinMarketCap Market Table Suite ── */}
      <MarketTable
        currency={currency}
        onCurrencyToggle={onCurrencyToggle}
        onSparklinesUpdate={onSparklinesUpdate}
        onCoinSelect={handleCoinSelect}
      />
    </div>
  );
}

