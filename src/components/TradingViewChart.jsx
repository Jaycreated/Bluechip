import React, { useEffect, useRef, useState, memo } from 'react';
import { Maximize2, Minimize2, BarChart2, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

const POPULAR_SYMBOLS = [
  { label: 'BTC / USDT', symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin', icon: '₿' },
  { label: 'ETH / USDT', symbol: 'BINANCE:ETHUSDT', name: 'Ethereum', icon: 'Ξ' },
  { label: 'SOL / USDT', symbol: 'BINANCE:SOLUSDT', name: 'Solana', icon: '◎' },
  { label: 'BNB / USDT', symbol: 'BINANCE:BNBUSDT', name: 'BNB', icon: '◆' },
  { label: 'XRP / USDT', symbol: 'BINANCE:XRPUSDT', name: 'XRP', icon: '✕' },
  { label: 'DOGE / USDT', symbol: 'BINANCE:DOGEUSDT', name: 'Dogecoin', icon: 'Ð' },
  { label: 'ADA / USDT', symbol: 'BINANCE:ADAUSDT', name: 'Cardano', icon: '₳' },
];

function TradingViewChart({ theme = 'dark', initialSymbol = 'BINANCE:BTCUSDT' }) {
  const containerRef = useRef(null);
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous widget DOM
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    widgetDiv.style.maxWidth = '100%';
    widgetContainer.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    // Advanced Chart configuration matching https://www.tradingview.com/chart/
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: selectedSymbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: theme === 'dark' ? 'dark' : 'light',
      style: '1', // 1 = Candlestick chart
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true, // Allows user to search & open any symbol (like on tradingview.com/chart)
      hide_side_toolbar: false, // Shows drawing tools (trendlines, fibonacci, brushes, etc.)
      withdateranges: true, // 1D, 5D, 1M, 3M, 6M, 1Y, 5Y, All
      hide_volume: false,
      studies: [
        'STD;RSI',
        'STD;MACD',
      ],
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      support_host: 'https://www.tradingview.com',
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [selectedSymbol, theme]);

  return (
    <div className={`tradingview-pro-wrapper transition-all duration-300 ${
      isFullscreen
        ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col'
        : 'bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl'
    }`} style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
      {/* ── TradingView Pro Header Bar ── */}
      <div className="p-3 sm:p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
            <BarChart2 size={16} className="sm:w-[20px] sm:h-[20px]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white text-sm sm:text-lg flex items-center gap-2">
                TradingView Advanced Real-Time Terminal
              </h3>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 mt-0.5 max-w-xl">
              Full technical analysis suite with candlesticks, indicators, drawing tools &amp; instant symbol search
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.tradingview.com/chart/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 transition"
          >
            TradingView.com ↗
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand to Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 size={14} className="sm:w-[15px] sm:h-[15px]" /> <span className="hidden xs:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 size={14} className="sm:w-[15px] sm:h-[15px]" /> <span className="hidden xs:inline">Full</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Quick Crypto Symbol Selector Pills ── */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1 mr-0.5 sm:mr-1">
          <TrendingUp size={12} className="text-blue-400" /> Quick Pairs:
        </span>
        {POPULAR_SYMBOLS.map((item) => (
          <button
            key={item.symbol}
            onClick={() => setSelectedSymbol(item.symbol)}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-extrabold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              selectedSymbol === item.symbol
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-750'
            }`}
          >
            <span className="opacity-70">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── Chart Container with True TradingView Canvas ── */}
      <div
        className="chart-scroll-shell w-full relative"
        style={{
          height: isFullscreen ? 'calc(100vh - 140px)' : '420px',
          minHeight: '320px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{
            width: '100%',
            minWidth: '100%',
            height: '100%',
            maxWidth: 'none',
            overflow: 'hidden',
          }}
        />
      </div>

      {/* ── Terminal Footer Info ── */}
      <div className="px-3 py-2 sm:px-5 sm:py-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium whitespace-nowrap">
            <ShieldCheck size={12} className="text-emerald-400 sm:w-[14px] sm:h-[14px]" />
            <span className="truncate">Official TradingView Charting Engine</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="text-slate-400 whitespace-nowrap">UTC</span>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewChart);
