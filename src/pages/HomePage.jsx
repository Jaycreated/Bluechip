import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Sparkles, 
  Flame, 
  Play, 
  Star, 
  CheckCircle2, 
  ArrowDownRight, 
  Send 
} from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const makeFallbackToken = (symbol = 'CRYPTO') => {
  const text = String(symbol).toUpperCase().slice(0, 2) || 'CR';
  const palette = {
    BTC: '#f59e0b',
    ETH: '#627eea',
    SOL: '#14f1d9',
    BNB: '#f3ba2f',
    USDT: '#26a17b',
    XRP: '#2e8cff',
    DOGE: '#f4c20d',
    PEPE: '#7c3aed',
    WLD: '#06b6d4',
    TIA: '#f97316',
    DEFAULT: '#2563eb'
  };
  const fill = palette[String(symbol).toUpperCase()] || palette.DEFAULT;
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <rect width='64' height='64' rx='18' fill='${fill}'/>
      <text x='50%' y='54%' text-anchor='middle' font-size='24' font-weight='700' fill='white' font-family='Arial, sans-serif'>${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const PREVIEW_FALLBACK_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 96800, change: 4.15, icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2795, change: 3.20, icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 188.5, change: 18.25, icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 652.0, change: 2.45, icon: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { id: 'tether', symbol: 'USDT', name: 'Tether USD', price: 1.00, change: 0.01, icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 2.45, change: 10.40, icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.295, change: 13.50, icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
];

const PREVIEW_GAINERS = [
  { symbol: 'PEPE', name: 'Pepe', change: 28.45, price: 0.0000185, icon: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.png' },
  { symbol: 'SUI', name: 'Sui', change: 21.80, price: 3.42, icon: 'https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png' },
  { symbol: 'SOL', name: 'Solana', change: 18.25, price: 188.5, icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
];

const PREVIEW_LOSERS = [
  { symbol: 'WLD', name: 'Worldcoin', change: -15.80, price: 2.15, icon: 'https://assets.coingecko.com/coins/images/31062/large/worldcoin.png' },
  { symbol: 'TIA', name: 'Celestia', change: -13.40, price: 4.80, icon: 'https://assets.coingecko.com/coins/images/31967/large/tia.png' },
  { symbol: 'SEI', name: 'Sei', change: -11.90, price: 0.46, icon: 'https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png' },
];

const FALLBACK_REVIEWS = [
  { id: 'fallback-home-1', name: 'Jane Johnson', location: 'Lagos, Nigeria', quote: 'Bluechip helped me start my crypto journey with confidence!', rating: 5 },
  { id: 'fallback-home-2', name: 'Daniel A.', location: 'Abuja, Nigeria', quote: 'Fast settlement and honest rates for USDT. No delays or ghosting.', rating: 5 },
  { id: 'fallback-home-3', name: 'Chidinma O.', location: 'Port Harcourt', quote: 'The Learn lessons helped me avoid a fake Telegram investment group.', rating: 5 },
];

function formatPrice(val, currency = 'usd') {
  if (!val) return '-';
  const prefix = currency === 'ngn' ? '₦' : '$';
  if (currency === 'ngn') {
    const rate = 1550; // approximate USD to NGN conversion for preview
    const ngnVal = val * rate;
    if (ngnVal < 1) return prefix + ngnVal.toFixed(4);
    return prefix + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(ngnVal);
  }
  if (val < 0.0001) return prefix + val.toFixed(8);
  if (val < 1) return prefix + val.toFixed(4);
  return prefix + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

export default function HomePage({ onNavigate, currency = 'usd' }) {
  const [coins, setCoins] = useState(PREVIEW_FALLBACK_COINS);
  const [selectedTradeAsset, setSelectedTradeAsset] = useState('USDT');
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);

  useEffect(() => {
    const loadReviews = async () => {
      if (!supabase) {
        setReviews(FALLBACK_REVIEWS);
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data && data.length) {
        const mapped = data
          .filter((item) => item.quote && item.name)
          .map((item) => ({
            id: item.id,
            name: item.name,
            location: item.location || 'Nigeria',
            quote: item.quote,
            rating: Number(item.rating) || 5,
          }))
          .slice(0, 3);

        if (mapped.length) {
          setReviews(mapped);
        }
      }
    };

    loadReviews();
  }, []);

  // Keep the homepage preview in sync with the same live CoinGecko feed used on the markets page.
  useEffect(() => {
    const mapPreviewData = (data) => {
      const topSymbols = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'XRP', 'DOGE'];
      const mapped = [];

      topSymbols.forEach((sym) => {
        const match = data.find((c) => c.symbol.toUpperCase() === sym);
        if (match) {
          mapped.push({
            id: match.id,
            symbol: match.symbol.toUpperCase(),
            name: match.name,
            price: match.current_price,
            change: match.price_change_percentage_24h_in_currency ?? match.price_change_percentage_24h ?? 0,
            icon: match.image
          });
        }
      });

      return mapped;
    };

    const loadPreview = async () => {
      const cacheKey = `bluechip_cmc_market_data_v2_${currency}`;

      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (cached?.data?.length && Date.now() - (cached.timestamp || 0) < 3 * 60 * 1000) {
          const mapped = mapPreviewData(cached.data);
          if (mapped.length) {
            setCoins(mapped);
            return;
          }
        }
      } catch (e) {
        // ignore cache parse errors and load live data instead
      }

      try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
        const res = await fetch(url, { headers: { accept: 'application/json' } });

        if (!res.ok) {
          throw new Error(`CoinGecko HTTP ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = mapPreviewData(data);
          if (mapped.length) {
            setCoins(mapped);
            localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
          }
        }
      } catch (e) {
        setCoins(PREVIEW_FALLBACK_COINS);
      }
    };

    loadPreview();
  }, [currency]);

  const liveBtcPrice = coins.find((coin) => coin.symbol === 'BTC')?.price ?? PREVIEW_FALLBACK_COINS.find((coin) => coin.symbol === 'BTC').price;
  const liveUsdtPrice = coins.find((coin) => coin.symbol === 'USDT')?.price ?? PREVIEW_FALLBACK_COINS.find((coin) => coin.symbol === 'USDT').price;

  return (
    <div>
      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden bg-bluechip-950 text-white">
        <div className="absolute inset-0 hero-grid opacity-50"></div>
        <div className="absolute -right-24 -top-32 w-[440px] h-[440px] rounded-full bg-bluechip-600/30 blur-[100px]"></div>
        <div className="absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-cyan-400/10 blur-[80px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-[1.1fr_.9fr] items-center gap-12">
          <div className="rise">
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-3.5 py-2 text-xs font-semibold text-blue-100 bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Your crypto journey starts here
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[60px] leading-[1.08] font-extrabold tracking-tight">
              Premium OTC Crypto for Nigerians.
            </h1>

            <p className="mt-3 text-lg sm:text-2xl font-bold text-blue-200 tracking-tight">
              Fast. Clear. Educational.
            </p>

            <p className="mt-6 max-w-xl text-blue-100/85 text-base sm:text-lg leading-8 font-medium">
              Buy and sell crypto with speed and clarity, plus practical education to help you make better decisions.
            </p>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm max-w-md">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-200/80">Bluechip Trading Rate</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  live
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/20 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200/70">BTC</p>
                  <p className="mt-1 text-lg font-extrabold text-white">₦1,353 / $</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/20 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200/70">USDT / USDC</p>
                  <p className="mt-1 text-lg font-extrabold text-white">₦1,360 / $</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex justify-center items-center gap-2 bg-white text-bluechip-950 hover:bg-blue-50 rounded-xl px-6 py-4 font-extrabold shadow-xl transition cursor-pointer"
              >
                Buy / Sell Crypto <ArrowUpRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('learn')}
                className="inline-flex justify-center items-center gap-2 glass hover:bg-white/15 rounded-xl px-6 py-4 font-bold transition text-white cursor-pointer"
              >
                Start Learning <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-blue-100/80 font-semibold">
              <span>✓ Beginner-friendly</span>
              <span>✓ Human support hotline</span>
              <span>✓ Learn at your pace</span>
            </div>
          </div>

          {/* Right Hero Hub Card */}
          <div className="rise lg:pl-5">
            <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-blue-100/70 text-xs font-semibold uppercase tracking-wider">Live Hotline</p>
                  <h2 className="text-xl font-bold text-white mt-0.5">+234 703 762 9149</h2>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                  ● Active Now
                </span>
              </div>

              <a
                href="mailto:support@thebluechipexchange.com"
                className="group mb-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold text-blue-100 hover:bg-white/10 transition"
              >
                <span className="text-blue-200">✉</span>
                support@thebluechipexchange.com
              </a>

              {/* Quick trade inquiry trigger */}
              <div className="space-y-3">
                <p className="text-xs text-blue-100/70 font-semibold uppercase tracking-wider">Quick Asset Rate Check</p>
                <div className="grid grid-cols-4 gap-2">
                  {['USDT', 'BTC', 'SOL', 'ETH'].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => setSelectedTradeAsset(sym)}
                      className={`py-2 px-1 text-xs font-extrabold rounded-xl transition cursor-pointer text-center ${
                        selectedTradeAsset === sym
                          ? 'bg-white text-bluechip-950 shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                <a
                  href={`https://wa.me/2347037629149?text=${encodeURIComponent(`Hello Bluechip Hotline (+234 703 762 9149), I want to trade ${selectedTradeAsset}. Please confirm today's exchange rate.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 mt-2"
                >
                  Ask Today's {selectedTradeAsset} Rate on WhatsApp (+234 703 762 9149) ↗
                </a>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-blue-100/75">
                <span>Rates confirmed directly</span>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-blue-300 hover:text-white font-bold underline cursor-pointer"
                >
                  All Channels →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Live Market Preview (Coins & Movers Teaser) ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-bluechip-600 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Market Ticker
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-Time Crypto Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-bluechip-950 mt-2 tracking-tight">
              Crypto Market Watch
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Top popular coins and daily price movements before you enter the full market.
            </p>
          </div>

          <button
            onClick={() => onNavigate('markets')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bluechip-900 hover:bg-bluechip-800 text-white text-xs font-extrabold shadow-sm transition self-start md:self-end cursor-pointer"
          >
            Open Full Markets Page (50+ Coins) →
          </button>
        </div>

        {/* Popular Coins Strip */}
        <div className="coin-scroll-wrap mb-8">
          <div className="coin-scroll-track">
            {coins.map((c) => (
              <div
                key={c.id || c.symbol}
                onClick={() => onNavigate('markets')}
                className="coin-scroll-card bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-soft hover:border-bluechip-300 transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={c.icon}
                    alt={c.name}
                    className="w-8 h-8 rounded-full object-contain shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = makeFallbackToken(c.symbol || c.name);
                    }}
                  />
                  <div className="truncate">
                    <p className="font-extrabold text-bluechip-950 text-sm leading-tight">{c.symbol}</p>
                    <p className="text-[11px] text-slate-400 truncate">{c.name}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="font-extrabold text-base text-bluechip-950 leading-tight">
                    {formatPrice(c.price, currency)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[11px] font-black ${c.change >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                      {c.change >= 0 ? '▲ +' : '▼ '}{Math.abs(c.change).toFixed(2)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">24h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Movers Preview: Top Gainers vs Top Losers */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Gainers Teaser */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-bluechip-950 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
                  <TrendingUp size={16} />
                </span>
                🚀 Today's Top Gainers
              </h3>
              <button
                onClick={() => onNavigate('markets')}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                View Top 10 →
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {PREVIEW_GAINERS.map((g) => (
                <div key={g.symbol} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={g.icon}
                      alt={g.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = makeFallbackToken(g.symbol || g.name);
                      }}
                    />
                    <span className="font-extrabold text-xs text-bluechip-950">{g.name} ({g.symbol})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-emerald-600">+{g.change}%</span>
                    <span className="text-[11px] text-slate-400 ml-2">{formatPrice(g.price, currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers Teaser */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-bluechip-950 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 grid place-items-center">
                  <TrendingDown size={16} />
                </span>
                📉 Today's Top Dips
              </h3>
              <button
                onClick={() => onNavigate('markets')}
                className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
              >
                View Top 10 →
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {PREVIEW_LOSERS.map((l) => (
                <div key={l.symbol} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={l.icon}
                      alt={l.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = makeFallbackToken(l.symbol || l.name);
                      }}
                    />
                    <span className="font-extrabold text-xs text-bluechip-950">{l.name} ({l.symbol})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-rose-600">{l.change}%</span>
                    <span className="text-[11px] text-slate-400 ml-2">{formatPrice(l.price, currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Buy & Sell Teaser ── */}
      <section className="bg-slate-50/75 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Instant Hotline</p>
              <h2 className="text-3xl font-extrabold text-bluechip-950 mt-2">
                Need to Buy or Sell Crypto in Nigeria?
              </h2>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                Confirm your exchange rate directly with our desk. We handle transactions for USDT, BTC, SOL, BNB, and ETH with fast bank settlement and full human assistance.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Confirmed rates before funds are transferred
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Supported on TRC20, BEP20, ERC20 &amp; Bitcoin
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Direct hotline call or WhatsApp (+234 703 762 9149)
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3.5 bg-bluechip-900 hover:bg-bluechip-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                >
                  Open Buy &amp; Sell Page →
                </button>
                <a
                  href="https://wa.me/2347037629149?text=Hello%20Bluechip,%20I%20want%20to%20trade%20crypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs"
                >
                  Chat Hotline on WhatsApp ↗
                </a>
              </div>

              <a
                href="mailto:support@thebluechipexchange.com"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-bluechip-700 hover:bg-slate-50 transition"
              >
                <span className="text-base">✉</span>
                support@thebluechipexchange.com
              </a>
            </div>

            {/* Right: Supported Assets Pill Showcase */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft">
              <h3 className="font-extrabold text-bluechip-950 text-base mb-4">Supported Digital Assets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { sym: 'USDT', name: 'Tether USD', tag: 'Fast Settlements', bg: 'bg-emerald-50 text-emerald-700' },
                  { sym: 'BTC', name: 'Bitcoin', tag: 'High Liquidity', bg: 'bg-amber-50 text-amber-700' },
                  { sym: 'SOL', name: 'Solana', tag: 'Low Network Fee', bg: 'bg-teal-50 text-teal-700' },
                  { sym: 'BNB', name: 'BNB Chain', tag: 'Smart Chain', bg: 'bg-yellow-50 text-yellow-700' },
                  { sym: 'ETH', name: 'Ethereum', tag: 'Mainnet & L2s', bg: 'bg-indigo-50 text-indigo-700' },
                  { sym: 'XRP', name: 'Ripple', tag: 'Instant Transfer', bg: 'bg-blue-50 text-blue-700' },
                ].map((item) => (
                  <div key={item.sym} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black ${item.bg}`}>
                      {item.sym}
                    </span>
                    <p className="font-extrabold text-xs text-bluechip-950 mt-1.5">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Bluechip Academy & Videos Teaser ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <div>
            <span className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Education First</span>
            <h2 className="text-3xl font-extrabold text-bluechip-950 mt-2">
              Bluechip Academy: Learn Without Fear
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Understand blockchain, wallet custody, and scam prevention before you invest. Practical lessons designed for Nigerian beginners with zero confusing jargon.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-lg font-black text-bluechip-700">05</span>
                <p className="font-bold text-xs text-bluechip-950 mt-1">Foundation Lessons</p>
                <p className="text-[11px] text-slate-400">With interactive quizzes</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-lg font-black text-emerald-600">Video</span>
                <p className="font-bold text-xs text-bluechip-950 mt-1">Masterclass Series</p>
                <p className="text-[11px] text-slate-400">Created by Vicky &amp; Jay</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('learn')}
              className="mt-8 px-6 py-3.5 bg-bluechip-900 hover:bg-bluechip-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Open Academy &amp; Watch Videos →
            </button>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-bluechip-50 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-bluechip-600">Keep learning</p>
              <p className="mt-2 text-sm font-bold text-bluechip-950">Speak with the Bluechip team to get more exclusive lessons.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/2347037629149?text=Hello%20Bluechip,%20I%20want%20to%20keep%20learning%20about%20crypto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-bluechip-900 px-4 py-2.5 text-[11px] font-extrabold text-white hover:bg-bluechip-800 transition"
                >
                  WhatsApp: +234 703 762 9149
                </a>
                <a
                  href="mailto:support@thebluechipexchange.com"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-extrabold text-bluechip-700 hover:bg-slate-50 transition"
                >
                  Email: support@thebluechipexchange.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Video Teaser Card */}
          <div
            onClick={() => onNavigate('learn')}
            className="bg-bluechip-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 cursor-pointer group"
          >
            <div className="relative aspect-video rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex flex-col justify-center items-center p-6 text-center group-hover:border-blue-400/40 transition">
              <div className="w-16 h-16 rounded-full bg-slate-200/10 border border-white/15 text-white grid place-items-center shadow-xl group-hover:scale-105 transition">
                <Play size={28} className="text-blue-200 opacity-60 translate-x-0.5" />
              </div>
              <p className="font-extrabold text-base text-white mt-5">Coming Soon</p>
              <span className="text-xs text-blue-200/70 mt-1">Short crypto education videos are being prepared for launch.</span>
              <span className="absolute bottom-3 right-3 text-[10px] bg-white/10 px-2.5 py-1 rounded-md text-white/80 font-bold border border-white/10">
                COMING SOON
              </span>
            </div>
            <h3 className="font-extrabold text-lg mt-4 text-white group-hover:text-blue-300 transition">
              Crypto education videos are on the way
            </h3>
            <p className="text-xs text-blue-200/70 mt-1">
              Learn wallets, scam prevention, stablecoins, and safer crypto habits with bite-sized lessons for beginners in Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Roadmap</p>
          <h2 className="text-3xl font-extrabold text-bluechip-950 mt-2">Where Bluechip is going next</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Current', title: 'Premium OTC with education', text: 'Fast, direct crypto buying and selling support. Clear guidance and safe decision-making first.' },
            { label: 'Next', title: 'Secure storage product (ledger)', text: 'A safer custody option built for users who want more control over their assets and recovery process.' },
            { label: 'Later', title: 'Full exchange platform', text: 'A wider trading experience built on trust, liquidity, and strong user education.' },
          ].map((step) => (
            <div key={step.label} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft">
              <span className="inline-flex items-center rounded-full bg-bluechip-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-bluechip-700">
                {step.label}
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-bluechip-950">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Community & Customer of the Week Teaser ── */}
      <section className="bg-slate-50/75 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Community Feedback</p>
              <h2 className="text-3xl font-extrabold text-bluechip-950 mt-1">
                Hear From Real Nigerian Traders
              </h2>
            </div>
            <button
              onClick={() => onNavigate('community')}
              className="text-xs font-extrabold text-bluechip-700 hover:underline cursor-pointer"
            >
              View All Community Spotlights →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => {
              const avatar = (review.name || 'A').charAt(0).toUpperCase();
              const isFeatured = index === 0;

              if (isFeatured) {
                return (
                  <div key={review.id || review.name} className="bg-gradient-to-br from-bluechip-950 to-bluechip-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                        ⭐ Customer of the Week
                      </span>
                      <p className="mt-4 text-sm font-bold text-blue-50 leading-relaxed italic">
                        "{review.quote}"
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-bluechip-950 font-black text-sm grid place-items-center">
                        {avatar}
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-white">{review.name}</p>
                        <p className="text-[10px] text-blue-200/70">Verified Customer · {review.location}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={review.id || review.name} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(review.rating || 5)].map((_, starIndex) => <Star key={`${review.id || review.name}-${starIndex}`} size={14} className="fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                      "{review.quote}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-bluechip-100 text-bluechip-800 font-extrabold text-sm grid place-items-center">
                      {avatar}
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-bluechip-950">{review.name}</p>
                      <p className="text-[10px] text-slate-400">{review.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Team & Leadership Teaser ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Leadership</p>
            <h2 className="text-3xl font-extrabold text-bluechip-950 mt-1">
              Meet the People Behind Bluechip
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Built by Nigerian developers and cryptocurrency specialists.
            </p>
          </div>
          <button
            onClick={() => onNavigate('about')}
            className="text-xs font-extrabold text-bluechip-700 hover:underline cursor-pointer"
          >
            Read Our Full Story →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          {[
            { name: 'Ridwan Yusuf', role: 'Former Founder + CFO', initial: 'R', color: 'bg-blue-600' },
            { name: 'Johnson John', role: 'Lead Developer', initial: 'J', color: 'bg-indigo-600' },
            { name: 'Victoria Shima', role: 'Community + Social Media', initial: 'V', color: 'bg-emerald-600' },
            { name: 'Bluechip Team', role: 'Human Support', initial: 'B', color: 'bg-rose-600' },
          ].map((m) => (
            <div
              key={m.name}
              onClick={() => onNavigate('about')}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-2xs hover:shadow-soft transition cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-xl ${m.color} text-white font-black text-base grid place-items-center mx-auto mb-2`}>
                {m.initial}
              </div>
              <p className="font-extrabold text-xs text-bluechip-950 truncate">{m.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{m.role}</p>
            </div>
          ))}
        </div>

        {/* Founder Quote Banner */}
        <div className="bg-gradient-to-r from-bluechip-950 to-bluechip-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-white/10">
          <div>
            <p className="text-sm font-semibold italic text-blue-100 leading-relaxed">
              "We want Bluechip to be a place where you can ask questions, understand your options, and take your time. Good decisions start with clear information."
            </p>
            <p className="text-xs text-blue-300 font-bold mt-2">
              Ridwan Yusuf &amp; The Bluechip Team
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 bg-white text-bluechip-950 text-xs font-extrabold rounded-xl shrink-0 hover:bg-blue-50 transition cursor-pointer"
          >
            Call Hotline: +234 703 762 9149 ↗
          </button>
        </div>
      </section>
    </div>
  );
}
