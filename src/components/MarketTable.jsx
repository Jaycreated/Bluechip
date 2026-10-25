import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, RefreshCw, Flame, ArrowUpRight, ArrowDownRight, Layers, SlidersHorizontal } from 'lucide-react';

const CACHE_KEY = 'bluechip_cmc_market_data_v2';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache

// 25+ realistic default coins (both big gainers and losers) for instant and fallback rendering
const FALLBACK_COINS = [
  // Big Gainers
  { id: 'pepe', symbol: 'pepe', name: 'Pepe', market_cap_rank: 22, current_price: 0.0000185, price_change_percentage_1h_in_currency: 2.15, price_change_percentage_24h_in_currency: 28.45, price_change_percentage_7d_in_currency: 42.10, total_volume: 2450000000, market_cap: 7800000000, image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.png', sparkline_in_7d: { price: [0.000013, 0.000014, 0.0000145, 0.000016, 0.000017, 0.0000185] } },
  { id: 'sui', symbol: 'sui', name: 'Sui', market_cap_rank: 14, current_price: 3.42, price_change_percentage_1h_in_currency: 1.40, price_change_percentage_24h_in_currency: 21.80, price_change_percentage_7d_in_currency: 35.60, total_volume: 1850000000, market_cap: 9850000000, image: 'https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png', sparkline_in_7d: { price: [2.5, 2.65, 2.8, 3.0, 3.2, 3.42] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', market_cap_rank: 5, current_price: 188.5, price_change_percentage_1h_in_currency: 0.85, price_change_percentage_24h_in_currency: 18.25, price_change_percentage_7d_in_currency: 24.30, total_volume: 8900000000, market_cap: 89500000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', sparkline_in_7d: { price: [155, 160, 168, 175, 181, 188.5] } },
  { id: 'near', symbol: 'near', name: 'NEAR Protocol', market_cap_rank: 18, current_price: 6.85, price_change_percentage_1h_in_currency: 0.65, price_change_percentage_24h_in_currency: 16.40, price_change_percentage_7d_in_currency: 28.10, total_volume: 920000000, market_cap: 8250000000, image: 'https://assets.coingecko.com/coins/images/10365/large/near.png', sparkline_in_7d: { price: [5.4, 5.7, 6.0, 6.3, 6.6, 6.85] } },
  { id: 'render-token', symbol: 'render', name: 'Render', market_cap_rank: 29, current_price: 9.15, price_change_percentage_1h_in_currency: 1.10, price_change_percentage_24h_in_currency: 14.80, price_change_percentage_7d_in_currency: 19.50, total_volume: 710000000, market_cap: 4750000000, image: 'https://assets.coingecko.com/coins/images/11636/large/render.png', sparkline_in_7d: { price: [7.8, 8.1, 8.4, 8.7, 9.0, 9.15] } },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', market_cap_rank: 7, current_price: 0.295, price_change_percentage_1h_in_currency: 0.95, price_change_percentage_24h_in_currency: 13.50, price_change_percentage_7d_in_currency: 21.20, total_volume: 4800000000, market_cap: 43200000000, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', sparkline_in_7d: { price: [0.24, 0.25, 0.26, 0.275, 0.285, 0.295] } },
  { id: 'fantom', symbol: 'ftm', name: 'Fantom / Sonic', market_cap_rank: 42, current_price: 0.95, price_change_percentage_1h_in_currency: 0.45, price_change_percentage_24h_in_currency: 11.90, price_change_percentage_7d_in_currency: 18.20, total_volume: 450000000, market_cap: 2680000000, image: 'https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png', sparkline_in_7d: { price: [0.80, 0.83, 0.87, 0.90, 0.92, 0.95] } },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', market_cap_rank: 6, current_price: 2.45, price_change_percentage_1h_in_currency: 0.35, price_change_percentage_24h_in_currency: 10.40, price_change_percentage_7d_in_currency: 22.80, total_volume: 9800000000, market_cap: 140000000000, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', sparkline_in_7d: { price: [2.01, 2.12, 2.24, 2.32, 2.40, 2.45] } },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', market_cap_rank: 9, current_price: 33.80, price_change_percentage_1h_in_currency: 0.40, price_change_percentage_24h_in_currency: 9.20, price_change_percentage_7d_in_currency: 14.50, total_volume: 890000000, market_cap: 13800000000, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', sparkline_in_7d: { price: [29.5, 30.2, 31.0, 32.1, 33.0, 33.8] } },
  { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', market_cap_rank: 10, current_price: 0.0000224, price_change_percentage_1h_in_currency: 0.30, price_change_percentage_24h_in_currency: 8.60, price_change_percentage_7d_in_currency: 12.40, total_volume: 1200000000, market_cap: 13200000000, image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', sparkline_in_7d: { price: [0.0000195, 0.0000205, 0.000021, 0.0000218, 0.0000224] } },
  
  // Large Cap Stalwarts
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1, current_price: 96800, price_change_percentage_1h_in_currency: 0.20, price_change_percentage_24h_in_currency: 4.15, price_change_percentage_7d_in_currency: 9.40, total_volume: 48500000000, market_cap: 1915000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', sparkline_in_7d: { price: [91000, 92500, 93800, 95200, 96100, 96800] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', market_cap_rank: 2, current_price: 2795, price_change_percentage_1h_in_currency: 0.15, price_change_percentage_24h_in_currency: 3.20, price_change_percentage_7d_in_currency: 6.80, total_volume: 24200000000, market_cap: 337000000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', sparkline_in_7d: { price: [2610, 2650, 2690, 2740, 2770, 2795] } },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', market_cap_rank: 4, current_price: 652.0, price_change_percentage_1h_in_currency: 0.10, price_change_percentage_24h_in_currency: 2.45, price_change_percentage_7d_in_currency: 5.10, total_volume: 1950000000, market_cap: 95100000000, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', sparkline_in_7d: { price: [625, 632, 638, 645, 648, 652] } },
  { id: 'tether', symbol: 'usdt', name: 'Tether USD', market_cap_rank: 3, current_price: 1.00, price_change_percentage_1h_in_currency: 0.01, price_change_percentage_24h_in_currency: 0.01, price_change_percentage_7d_in_currency: 0.03, total_volume: 68000000000, market_cap: 129000000000, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', sparkline_in_7d: { price: [1, 1, 1, 1, 1, 1] } },

  // Big Losers / Dips of the Day
  { id: 'worldcoin-wld', symbol: 'wld', name: 'Worldcoin', market_cap_rank: 68, current_price: 2.15, price_change_percentage_1h_in_currency: -1.25, price_change_percentage_24h_in_currency: -15.80, price_change_percentage_7d_in_currency: -22.40, total_volume: 420000000, market_cap: 1450000000, image: 'https://assets.coingecko.com/coins/images/31062/large/worldcoin.png', sparkline_in_7d: { price: [2.85, 2.72, 2.60, 2.45, 2.30, 2.15] } },
  { id: 'celestia', symbol: 'tia', name: 'Celestia', market_cap_rank: 55, current_price: 4.80, price_change_percentage_1h_in_currency: -0.85, price_change_percentage_24h_in_currency: -13.40, price_change_percentage_7d_in_currency: -18.90, total_volume: 380000000, market_cap: 1850000000, image: 'https://assets.coingecko.com/coins/images/31967/large/tia.png', sparkline_in_7d: { price: [5.8, 5.6, 5.4, 5.1, 4.95, 4.80] } },
  { id: 'sei-network', symbol: 'sei', name: 'Sei', market_cap_rank: 62, current_price: 0.46, price_change_percentage_1h_in_currency: -0.60, price_change_percentage_24h_in_currency: -11.90, price_change_percentage_7d_in_currency: -16.50, total_volume: 290000000, market_cap: 1650000000, image: 'https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png', sparkline_in_7d: { price: [0.55, 0.53, 0.51, 0.49, 0.47, 0.46] } },
  { id: 'injective-protocol', symbol: 'inj', name: 'Injective', market_cap_rank: 48, current_price: 21.20, price_change_percentage_1h_in_currency: -0.75, price_change_percentage_24h_in_currency: -10.50, price_change_percentage_7d_in_currency: -14.20, total_volume: 310000000, market_cap: 2100000000, image: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png', sparkline_in_7d: { price: [24.5, 23.8, 23.0, 22.4, 21.8, 21.2] } },
  { id: 'aptos', symbol: 'apt', name: 'Aptos', market_cap_rank: 26, current_price: 11.40, price_change_percentage_1h_in_currency: -0.55, price_change_percentage_24h_in_currency: -9.80, price_change_percentage_7d_in_currency: -12.10, total_volume: 480000000, market_cap: 5800000000, image: 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png', sparkline_in_7d: { price: [13.2, 12.8, 12.4, 12.0, 11.6, 11.4] } },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot', market_cap_rank: 16, current_price: 7.15, price_change_percentage_1h_in_currency: -0.40, price_change_percentage_24h_in_currency: -8.70, price_change_percentage_7d_in_currency: -11.00, total_volume: 520000000, market_cap: 10400000000, image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', sparkline_in_7d: { price: [8.0, 7.8, 7.6, 7.45, 7.25, 7.15] } },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink', market_cap_rank: 15, current_price: 17.60, price_change_percentage_1h_in_currency: -0.30, price_change_percentage_24h_in_currency: -7.90, price_change_percentage_7d_in_currency: -9.50, total_volume: 680000000, market_cap: 11000000000, image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', sparkline_in_7d: { price: [19.5, 19.0, 18.6, 18.2, 17.8, 17.6] } },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', market_cap_rank: 8, current_price: 0.81, price_change_percentage_1h_in_currency: -0.25, price_change_percentage_24h_in_currency: -6.80, price_change_percentage_7d_in_currency: -4.20, total_volume: 1650000000, market_cap: 29100000000, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', sparkline_in_7d: { price: [0.89, 0.87, 0.85, 0.84, 0.82, 0.81] } },
  { id: 'uniswap', symbol: 'uni', name: 'Uniswap', market_cap_rank: 23, current_price: 10.80, price_change_percentage_1h_in_currency: -0.35, price_change_percentage_24h_in_currency: -5.90, price_change_percentage_7d_in_currency: -8.10, total_volume: 380000000, market_cap: 6500000000, image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png', sparkline_in_7d: { price: [11.8, 11.5, 11.3, 11.1, 10.9, 10.8] } },
  { id: 'polygon-ecosystem-token', symbol: 'pol', name: 'Polygon', market_cap_rank: 35, current_price: 0.52, price_change_percentage_1h_in_currency: -0.20, price_change_percentage_24h_in_currency: -5.20, price_change_percentage_7d_in_currency: -7.50, total_volume: 240000000, market_cap: 4200000000, image: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png', sparkline_in_7d: { price: [0.57, 0.56, 0.55, 0.54, 0.53, 0.52] } }
];

// Helper to format currency
function formatPrice(val, currency = 'usd') {
  if (val === undefined || val === null) return '-';
  const isNgn = currency.toLowerCase() === 'ngn';
  const prefix = isNgn ? '₦' : '$';
  if (val < 0.0001) return prefix + val.toFixed(8);
  if (val < 1) return prefix + val.toFixed(4);
  return prefix + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

// Compact numbers (e.g. $48.5B)
function formatCompact(val, currency = 'usd') {
  if (!val) return '-';
  const isNgn = currency.toLowerCase() === 'ngn';
  const prefix = isNgn ? '₦' : '$';
  if (val >= 1e12) return prefix + (val / 1e12).toFixed(2) + 'T';
  if (val >= 1e9) return prefix + (val / 1e9).toFixed(2) + 'B';
  if (val >= 1e6) return prefix + (val / 1e6).toFixed(2) + 'M';
  if (val >= 1e3) return prefix + (val / 1e3).toFixed(1) + 'K';
  return prefix + val.toLocaleString();
}

// Mini SVG Sparkline Component (Last 7 Days)
function Sparkline({ data, isPositive }) {
  if (!data || data.length < 2) {
    return <div className="h-8 w-20 flex items-center justify-center text-[10px] text-slate-400">---</div>;
  }

  const step = Math.max(1, Math.floor(data.length / 25));
  const sampled = [];
  for (let i = 0; i < data.length; i += step) {
    sampled.push(data[i]);
  }
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1]);
  }

  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  const width = 110;
  const height = 32;
  const padding = 2;

  const points = sampled.map((val, idx) => {
    const x = padding + (idx / (sampled.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const strokeColor = isPositive ? '#16c784' : '#ea3943';
  const fillColor = isPositive ? 'rgba(22, 199, 132, 0.08)' : 'rgba(234, 57, 67, 0.08)';

  const firstPoint = points.split(' ')[0];
  const lastPoint = points.split(' ')[points.split(' ').length - 1];
  const lastX = lastPoint.split(',')[0];
  const firstX = firstPoint.split(',')[0];
  const fillPoints = `${points} ${lastX},${height} ${firstX},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <defs>
        <linearGradient id={`grad-${isPositive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#grad-${isPositive ? 'pos' : 'neg'})`} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Dedicated Ranked Mini-Table for Gainers or Losers
function Top10Card({ title, icon, subtitle, coins, type = 'gainer', currency }) {
  const isGainer = type === 'gainer';
  const headerBg = isGainer ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  const badgeColor = isGainer ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200';
  const [visibleCount, setVisibleCount] = useState(10);
  const options = [10, 25, 50, 100];
  const displayCoins = coins.slice(0, Math.min(visibleCount, coins.length));

  useEffect(() => {
    setVisibleCount((current) => Math.min(current, coins.length || 10));
  }, [coins.length]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col justify-between transition hover:border-slate-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl grid place-items-center border ${headerBg}`}>
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-bluechip-950 text-base sm:text-lg tracking-tight">{title}</h3>
              <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only">Select visible count</label>
            <select
              value={visibleCount}
              onChange={(e) => setVisibleCount(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-bluechip-500/20"
            >
              {options.map((option) => (
                <option key={option} value={option}>Top {option}</option>
              ))}
            </select>
            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${badgeColor}`}>
              Top {visibleCount} Today
            </span>
          </div>
        </div>

        {/* Top Movers List */}
        <div className="divide-y divide-slate-100">
          {displayCoins.map((coin, index) => {
            const change24h = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
            const tradeLink = `https://wa.me/2347037629149?text=${encodeURIComponent(`Hello Bluechip, I want to trade ${coin.name} (${coin.symbol.toUpperCase()}). Please give me current rates.`)}`;

            return (
              <div
                key={coin.id}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition group"
              >
                {/* Left: Rank & Coin info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-5 text-center text-xs font-black shrink-0 ${index < 3 ? (isGainer ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold') : 'text-slate-400'}`}>
                    {index + 1}
                  </span>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-7 h-7 rounded-full object-contain shrink-0 shadow-2xs"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png';
                    }}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-extrabold text-xs text-bluechip-950 group-hover:text-bluechip-600 transition truncate">
                        {coin.name}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase bg-slate-100 px-1 py-0.5 rounded shrink-0">
                        {coin.symbol}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Vol: {formatCompact(coin.total_volume, currency)}
                    </span>
                  </div>
                </div>

                {/* Right: Price, Change %, and Quick Trade */}
                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <p className="font-extrabold text-xs text-bluechip-950">
                      {formatPrice(coin.current_price, currency)}
                    </p>
                    <p className={`text-[11px] font-black inline-flex items-center justify-end gap-0.5 ${isGainer ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                      {isGainer ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
                      {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                    </p>
                  </div>
                  <a
                    href={tradeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-lg bg-bluechip-50 text-bluechip-700 hover:bg-bluechip-600 hover:text-white transition shadow-2xs"
                    title={`Trade ${coin.symbol.toUpperCase()}`}
                  >
                    Trade
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>24-Hour Price Movement</span>
        <span className="font-bold text-bluechip-600">Hotline Ready ☎</span>
      </div>
    </div>
  );
}

export default function MarketTable({ currency = 'usd', onCurrencyToggle, onSparklinesUpdate }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'gainers' | 'losers' | 'top10'
  const [lastUpdated, setLastUpdated] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [moversView, setMoversView] = useState('both'); // 'both' | 'gainers' | 'losers' (for mobile tabs)

  // Helper to notify parent of sparklines for BTC, ETH, SOL, BNB, USDT
  const notifySparklines = (list) => {
    if (typeof onSparklinesUpdate === 'function' && Array.isArray(list)) {
      const map = {};
      list.forEach((c) => {
        if (c.symbol && c.sparkline_in_7d?.price?.length) {
          map[c.symbol.toUpperCase()] = c.sparkline_in_7d.price;
        }
      });
      if (Object.keys(map).length > 0) onSparklinesUpdate(map);
    }
  };

  // Fetch top 50 cryptocurrencies from CoinGecko
  const fetchMarketData = async (force = false) => {
    setIsRefreshing(true);

    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(`${CACHE_KEY}_${currency}`));
        if (cached && Array.isArray(cached.data) && Date.now() - cached.timestamp < CACHE_TTL) {
          setCoins(cached.data);
          notifySparklines(cached.data);
          setLastUpdated(new Date(cached.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setLoading(false);
          setIsRefreshing(false);
          return;
        }
      } catch (e) {
        // ignore cache parse errors
      }
    }

    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      
      if (!res.ok) {
        throw new Error(`CoinGecko HTTP ${res.status}`);
      }
      
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCoins(data);
        notifySparklines(data);
        const now = Date.now();
        setLastUpdated(new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        localStorage.setItem(`${CACHE_KEY}_${currency}`, JSON.stringify({ data, timestamp: now }));
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      console.warn('Live fetch note, falling back to cached or default data:', err.message);
      try {
        const cached = JSON.parse(localStorage.getItem(`${CACHE_KEY}_${currency}`));
        if (cached?.data?.length) {
          setCoins(cached.data);
          notifySparklines(cached.data);
          setLastUpdated('Cached');
        } else {
          setCoins(FALLBACK_COINS);
          notifySparklines(FALLBACK_COINS);
          setLastUpdated('Updated');
        }
      } catch {
        setCoins(FALLBACK_COINS);
        notifySparklines(FALLBACK_COINS);
        setLastUpdated('Updated');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData(false);
    const interval = setInterval(() => fetchMarketData(false), CACHE_TTL);
    return () => clearInterval(interval);
  }, [currency]);

  // Compute Popular Coins for the top quick-cards strip (BTC, ETH, SOL, BNB, USDT, XRP, DOGE)
  const popularCoins = useMemo(() => {
    const targets = ['btc', 'eth', 'sol', 'bnb', 'usdt', 'xrp', 'doge'];
    const list = [];
    targets.forEach((sym) => {
      const c = coins.find((item) => item.symbol.toLowerCase() === sym);
      if (c) list.push(c);
    });
    return list.length > 0 ? list : coins.slice(0, 6);
  }, [coins]);

  // Compute Top 10 Gainers of the Day
  const top10Gainers = useMemo(() => {
    if (!coins.length) return [];
    return [...coins]
      .filter((c) => typeof (c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h) === 'number')
      .sort((a, b) => {
        const changeA = a.price_change_percentage_24h_in_currency ?? a.price_change_percentage_24h ?? 0;
        const changeB = b.price_change_percentage_24h_in_currency ?? b.price_change_percentage_24h ?? 0;
        return changeB - changeA;
      })
      .slice(0, 10);
  }, [coins]);

  // Compute Top 10 Losers of the Day
  const top10Losers = useMemo(() => {
    if (!coins.length) return [];
    return [...coins]
      .filter((c) => typeof (c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h) === 'number')
      .sort((a, b) => {
        const changeA = a.price_change_percentage_24h_in_currency ?? a.price_change_percentage_24h ?? 0;
        const changeB = b.price_change_percentage_24h_in_currency ?? b.price_change_percentage_24h ?? 0;
        return changeA - changeB;
      })
      .slice(0, 10);
  }, [coins]);

  const top100Gainers = useMemo(() => {
    if (!coins.length) return [];
    return [...coins]
      .filter((c) => typeof (c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h) === 'number')
      .sort((a, b) => {
        const changeA = a.price_change_percentage_24h_in_currency ?? a.price_change_percentage_24h ?? 0;
        const changeB = b.price_change_percentage_24h_in_currency ?? b.price_change_percentage_24h ?? 0;
        return changeB - changeA;
      })
      .slice(0, 100);
  }, [coins]);

  const top100Losers = useMemo(() => {
    if (!coins.length) return [];
    return [...coins]
      .filter((c) => typeof (c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h) === 'number')
      .sort((a, b) => {
        const changeA = a.price_change_percentage_24h_in_currency ?? a.price_change_percentage_24h ?? 0;
        const changeB = b.price_change_percentage_24h_in_currency ?? b.price_change_percentage_24h ?? 0;
        return changeA - changeB;
      })
      .slice(0, 100);
  }, [coins]);

  // Filtered Coins for the main CoinMarketCap table
  const filteredCoins = useMemo(() => {
    let list = [...coins];

    if (activeTab === 'gainers') {
      return top10Gainers;
    } else if (activeTab === 'losers') {
      return top10Losers;
    } else if (activeTab === 'top10') {
      list = list.slice(0, 10);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }

    return list;
  }, [coins, activeTab, search, top10Gainers, top10Losers]);

  return (
    <section className="cmc-section max-w-7xl mx-auto px-4 pt-12 pb-16" id="markets">
      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-bluechip-600 border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live CoinMarketCap Feed
            </span>
            <span className="text-xs text-slate-400 font-medium">Top 50 Cryptocurrencies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-bluechip-950 mt-2 tracking-tight">
            Crypto Market Watch &amp; Daily Movers
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Real-time prices, top 10 daily gainers &amp; losers, plus 7-day sparklines.
          </p>
        </div>

        {/* Global Action & Currency Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-end">
          <button
            onClick={() => fetchMarketData(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
            title="Refresh prices"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-bluechip-600' : ''} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>

          <button
            onClick={onCurrencyToggle}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-bluechip-800 bg-bluechip-50 border border-bluechip-200 rounded-xl hover:bg-bluechip-100 transition shadow-xs"
          >
            {currency === 'usd' ? '🇳🇬 Show ₦ NGN' : '🇺🇸 Show $ USD'}
          </button>
        </div>
      </div>

      {/* ── Popular Asset Quick Cards Strip (BTC, ETH, SOL, BNB, USDT, XRP...) ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Popular Assets At A Glance</span>
          <span className="text-xs text-bluechip-600 font-bold">Swipe to view more →</span>
        </div>
        <div className="coin-scroll-wrap">
          <div className="coin-scroll-track">
            {popularCoins.map((coin) => {
              const change = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
              const spark = coin.sparkline_in_7d?.price || [];
              const isPositive = (spark.length >= 2 ? spark[spark.length - 1] >= spark[0] : change >= 0);

              return (
                <div
                  key={coin.id}
                  className="coin-scroll-card bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-soft transition flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full object-contain shrink-0 shadow-2xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png';
                      }}
                    />
                    <div className="truncate">
                      <p className="font-extrabold text-bluechip-950 text-sm leading-tight truncate">{coin.symbol.toUpperCase()}</p>
                      <p className="text-[11px] text-slate-400 truncate">{coin.name}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="font-extrabold text-base text-bluechip-950 leading-tight">
                      {formatPrice(coin.current_price, currency)}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[11px] font-bold ${change >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                        {change >= 0 ? '▲ +' : '▼ '}{Math.abs(change).toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">24h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Top 10 Gainers & Top 10 Losers Showcase ── */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-bluechip-950 tracking-tight flex items-center gap-2">
              <span>🔥 Top Gainers &amp; Losers of the Day</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">The biggest percentage climbers and decliners in the last 24 hours. Start with the first 10, then expand for more.</p>
          </div>

          {/* Mobile switcher (Show Gainers / Show Losers / Show Both) */}
          <div className="flex lg:hidden items-center p-1 bg-slate-100 rounded-xl self-start">
            <button
              onClick={() => setMoversView('both')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${moversView === 'both' ? 'bg-white text-bluechip-950 shadow-xs' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setMoversView('gainers')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${moversView === 'gainers' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              🚀 Gainers (10)
            </button>
            <button
              onClick={() => setMoversView('losers')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${moversView === 'losers' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              📉 Losers (10)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top 10 Gainers Card */}
          {(moversView === 'both' || moversView === 'gainers') && (
            <Top10Card
              title="Top Gainers"
              icon={<TrendingUp size={20} />}
              subtitle="Highest percentage increase in 24 hours"
              coins={top100Gainers}
              type="gainer"
              currency={currency}
            />
          )}

          {/* Top 10 Losers Card */}
          {(moversView === 'both' || moversView === 'losers') && (
            <Top10Card
              title="Top Losers"
              icon={<TrendingDown size={20} />}
              subtitle="Biggest percentage dip in 24 hours"
              coins={top100Losers}
              type="loser"
              currency={currency}
            />
          )}
        </div>
      </div>

      {/* ── Main CoinMarketCap Table Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 pt-4 border-t border-slate-100">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'all'
                ? 'bg-bluechip-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Cryptos ({coins.length})
          </button>
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'gainers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🚀 Top 10 Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'losers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📉 Top 10 Losers
          </button>
          <button
            onClick={() => setActiveTab('top10')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === 'top10'
                ? 'bg-bluechip-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Top 10 Market Cap
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coin (e.g. BTC, Solana, Doge)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-bluechip-500/20 focus:border-bluechip-600 transition"
          />
        </div>
      </div>

      {/* ── CoinMarketCap Full Responsive Table ── */}
      <div className="cmc-table-wrapper bg-white border border-slate-200/80 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4 text-right">Price</th>
                <th className="py-3.5 px-3 text-right">1h %</th>
                <th className="py-3.5 px-3 text-right">24h %</th>
                <th className="py-3.5 px-3 text-right">7d %</th>
                <th className="py-3.5 px-4 text-right">24h Volume</th>
                <th className="py-3.5 px-4 text-right">Market Cap</th>
                <th className="py-3.5 px-4 text-center">Last 7 Days</th>
                <th className="py-3.5 px-4 text-center">Hotline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {loading && !coins.length ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4 text-center text-slate-300">{i + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div className="space-y-1">
                          <div className="w-20 h-3.5 bg-slate-200 rounded"></div>
                          <div className="w-10 h-2.5 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right"><div className="w-16 h-3 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="py-4 px-3 text-right"><div className="w-10 h-3 bg-slate-100 rounded ml-auto"></div></td>
                    <td className="py-4 px-3 text-right"><div className="w-12 h-3 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="py-4 px-3 text-right"><div className="w-12 h-3 bg-slate-100 rounded ml-auto"></div></td>
                    <td className="py-4 px-4 text-right"><div className="w-16 h-3 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="py-4 px-4 text-right"><div className="w-20 h-3 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="py-4 px-4 text-center"><div className="w-24 h-8 bg-slate-100 rounded mx-auto"></div></td>
                    <td className="py-4 px-4 text-center"><div className="w-16 h-7 bg-slate-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filteredCoins.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No cryptocurrencies match your search.</p>
                    <button
                      onClick={() => { setSearch(''); setActiveTab('all'); }}
                      className="mt-2 text-xs font-bold text-bluechip-600 hover:underline"
                    >
                      Reset filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin, index) => {
                  const rank = coin.market_cap_rank || index + 1;
                  const change1h = coin.price_change_percentage_1h_in_currency;
                  const change24h = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
                  const change7d = coin.price_change_percentage_7d_in_currency ?? 0;
                  const sparklineData = coin.sparkline_in_7d?.price || [];
                  const is7dPositive = (sparklineData.length >= 2 ? sparklineData[sparklineData.length - 1] >= sparklineData[0] : change24h >= 0);

                  const tradeLink = `https://wa.me/2347037629149?text=${encodeURIComponent(`Hello Bluechip, I would like to check current rates and trade ${coin.name} (${coin.symbol.toUpperCase()}).`)}`;

                  return (
                    <tr
                      key={coin.id}
                      className="cmc-table-row hover:bg-slate-50/80 transition group"
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                        {rank}
                      </td>

                      {/* Name & Icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-7 h-7 rounded-full object-contain shrink-0 shadow-2xs"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png';
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-bluechip-950 text-sm group-hover:text-bluechip-600 transition">
                                {coin.name}
                              </span>
                              <span className="text-[11px] font-extrabold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                {coin.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-extrabold text-bluechip-950 text-sm">
                        {formatPrice(coin.current_price, currency)}
                      </td>

                      {/* 1h % */}
                      <td className="py-3.5 px-3 text-right font-bold text-xs whitespace-nowrap">
                        {change1h !== undefined && change1h !== null ? (
                          <span className={change1h >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}>
                            {change1h >= 0 ? '▲ ' : '▼ '}
                            {Math.abs(change1h).toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* 24h % */}
                      <td className="py-3.5 px-3 text-right font-bold text-xs whitespace-nowrap">
                        <span className={change24h >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}>
                          {change24h >= 0 ? '▲ ' : '▼ '}
                          {Math.abs(change24h).toFixed(2)}%
                        </span>
                      </td>

                      {/* 7d % */}
                      <td className="py-3.5 px-3 text-right font-bold text-xs whitespace-nowrap">
                        {change7d !== undefined && change7d !== null ? (
                          <span className={change7d >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}>
                            {change7d >= 0 ? '▲ ' : '▼ '}
                            {Math.abs(change7d).toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-600 text-xs whitespace-nowrap">
                        {formatCompact(coin.total_volume, currency)}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-600 text-xs whitespace-nowrap">
                        {formatCompact(coin.market_cap, currency)}
                      </td>

                      {/* Last 7 Days Sparkline */}
                      <td className="py-2 px-4 text-center">
                        <Sparkline data={sparklineData} isPositive={is7dPositive} />
                      </td>

                      {/* Action / Hotline */}
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={tradeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-bluechip-50 text-bluechip-700 hover:bg-bluechip-600 hover:text-white transition shadow-2xs"
                        >
                          Trade <ArrowUpRight size={12} />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50/75 border-t border-slate-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>
            Showing {filteredCoins.length} cryptocurrencies · Sorted by {activeTab === 'gainers' ? 'Top 24h Gainers' : activeTab === 'losers' ? 'Top 24h Losers' : 'Market Capitalization'}
          </span>
          <span className="flex items-center gap-2">
            <span>CoinMarketCap Standard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </section>
  );
}
