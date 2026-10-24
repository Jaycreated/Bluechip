import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck, CheckCircle2, PhoneCall, HelpCircle } from 'lucide-react';

export default function ServicesPage({ currency }) {
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  const [tradeType, setTradeType] = useState('buy'); // 'buy' | 'sell'
  const [amount, setAmount] = useState('');

  const supportedAssets = [
    { symbol: 'USDT', name: 'Tether USD', icon: '₮', network: 'TRC20 / BEP20 / ERC20', color: 'bg-emerald-50 text-emerald-600' },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', network: 'Bitcoin Mainnet', color: 'bg-amber-50 text-amber-600' },
    { symbol: 'SOL', name: 'Solana', icon: '≋', network: 'Solana Network', color: 'bg-teal-50 text-teal-600' },
    { symbol: 'BNB', name: 'BNB', icon: '◆', network: 'BNB Smart Chain', color: 'bg-yellow-50 text-yellow-600' },
    { symbol: 'ETH', name: 'Ethereum', icon: '◆', network: 'ERC20 / Arbitrum / Base', color: 'bg-indigo-50 text-indigo-600' },
  ];


  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* ── Page Header ── */}
      <div className="max-w-3xl mb-12">
        <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Service Hotline</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bluechip-950 mt-2">
          Buy &amp; Sell Crypto with Confidence
        </h1>
        <p className="mt-4 text-slate-500 leading-relaxed text-base sm:text-lg">
          No automated confusion. Request live daily exchange rates directly through our hotline and execute transactions with real human verification.
        </p>
      </div>

      {/* ── Interactive Rate Request & Hotline Box ── */}
      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 mb-16 items-start">
        {/* Left: Trade Calculator / Inquiry Builder */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <h2 className="text-xl font-extrabold text-bluechip-950">Ask For Today's Rate</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Hotline Active
            </span>
          </div>

          {/* Buy or Sell Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                tradeType === 'buy' ? 'bg-bluechip-900 text-white shadow-xs' : 'text-slate-600 hover:text-bluechip-950'
              }`}
            >
              I Want to Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                tradeType === 'sell' ? 'bg-bluechip-900 text-white shadow-xs' : 'text-slate-600 hover:text-bluechip-950'
              }`}
            >
              I Want to Sell
            </button>
          </div>

          {/* Asset Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
              Select Cryptocurrency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {supportedAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    selectedAsset === asset.symbol
                      ? 'border-bluechip-600 bg-blue-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl grid place-items-center font-black text-sm ${asset.color}`}>
                    {asset.icon}
                  </span>
                  <div className="truncate">
                    <p className="font-extrabold text-xs text-bluechip-950">{asset.symbol}</p>
                    <p className="text-[10px] text-slate-400 truncate">{asset.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Approximate Amount ({selectedAsset}) (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. 500 ${selectedAsset}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-bluechip-500/20 focus:border-bluechip-600"
            />
          </div>

          {/* Direct WhatsApp Hotline Action link */}
          <a
            href={`https://wa.me/2347037629149?text=${encodeURIComponent(`Hello Bluechip Hotline (+234 703 762 9149), I would like to ${tradeType.toUpperCase()} ${amount ? amount + ' ' : ''}${selectedAsset}. What is your current rate?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
          >
            Ask Rate on WhatsApp (+234 703 762 9149) ↗
          </a>
          <p className="text-[11px] text-center text-slate-400 mt-3 font-medium">
            Opens WhatsApp directly to <strong>+234 703 762 9149</strong>. Rates confirmed before any transfer occurs.
          </p>
        </div>

        {/* Right: How It Works & Hotline Guarantee */}
        <div className="space-y-6">
          <div className="bg-bluechip-950 text-white rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck size={16} /> Official Hotline Procedure
            </div>
            <h3 className="text-2xl font-extrabold">3 Steps to Trade Safely</h3>

            <div className="mt-6 space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 grid place-items-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-bold text-sm text-white">Ask for today's rate</p>
                  <p className="text-xs text-blue-100/70 mt-1 leading-relaxed">
                    Message us on WhatsApp (+234 703 762 9149). We provide the exact confirmed exchange rate for your volume.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 grid place-items-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-bold text-sm text-white">Verify recipient &amp; network</p>
                  <p className="text-xs text-blue-100/70 mt-1 leading-relaxed">
                    Confirm wallet address and blockchain network (e.g. TRC20 vs ERC20) to ensure zero transfer mistakes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 grid place-items-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-bold text-sm text-white">Instant settlement</p>
                  <p className="text-xs text-blue-100/70 mt-1 leading-relaxed">
                    Once blockchain confirmation or bank deposit is acknowledged, funds are sent immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
            <h4 className="font-extrabold text-bluechip-950 text-sm mb-2 flex items-center gap-1.5">
              <HelpCircle size={16} className="text-bluechip-600" /> Need Help First?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If this is your first time dealing with crypto wallets or blockchain networks, you can ask our hotline agents any question without pressure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
