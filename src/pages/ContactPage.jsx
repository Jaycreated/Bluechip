import React, { useState } from 'react';
import { PhoneCall, Mail, MessageCircle, Instagram, Linkedin, Send, ShieldAlert, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyHotline = () => {
    navigator.clipboard?.writeText('+2347037629149');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const channels = [
    {
      title: 'Official Hotline (Phone & WhatsApp)',
      detail: '+234 703 762 9149',
      sub: 'Direct call or instant WhatsApp chat for rates and trades',
      action: 'Call / WhatsApp ↗',
      link: 'https://wa.me/2347037629149',
      icon: <PhoneCall className="text-emerald-600" size={24} />,
      badge: 'Primary Channel'
    },
    {
      title: 'Official Telegram Channel',
      detail: '+234 703 762 9149',
      sub: 'Direct announcements, community discussions and support',
      action: 'Open Telegram ↗',
      link: 'https://t.me/+2347037629149',
      icon: <Send className="text-sky-500" size={24} />,
      badge: 'Direct Chat'
    },
    {
      title: 'Instagram Handle',
      detail: '@the_bluechipexchange',
      sub: 'Follow for daily market summaries, tutorials and announcements',
      action: 'Visit Instagram ↗',
      link: 'https://instagram.com/the_bluechipexchange',
      icon: <Instagram className="text-pink-600" size={24} />,
      badge: 'Social Updates'
    },
    {
      title: 'X (Formerly Twitter)',
      detail: '@bluchipexchange',
      sub: 'Crypto news, rate confirmations, and market updates',
      action: 'Follow on X ↗',
      link: 'https://x.com/bluchipexchange',
      icon: <MessageCircle className="text-slate-800" size={24} />,
      badge: 'Official Account'
    },
    {
      title: 'LinkedIn Company Page',
      detail: 'Bluechip Exchange',
      sub: 'Corporate partnerships, careers, and company updates',
      action: 'Connect on LinkedIn ↗',
      link: 'https://www.linkedin.com/company/bluechipexchange/',
      icon: <Linkedin className="text-blue-700" size={24} />,
      badge: 'Corporate'
    },
    {
      title: 'Customer Support Email',
      detail: 'support@thebluechipexchange.com',
      sub: 'Inquiries, dispute resolution, and formal communications',
      action: 'Send Email ↗',
      link: 'mailto:support@thebluechipexchange.com',
      icon: <Mail className="text-amber-600" size={24} />,
      badge: 'Official Inbox'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* ── Page Header ── */}
      <div className="max-w-3xl mb-12">
        <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Official Hotline</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bluechip-950 mt-2">
          Let's Talk Crypto. We Are Here.
        </h1>
        <p className="mt-4 text-slate-500 leading-relaxed text-base sm:text-lg">
          Need a current rate, help getting started, or have a question answered? Reach out through our official, verified channels below.
        </p>
      </div>

      {/* ── Main Hotline Spotlight Card ── */}
      <div className="bg-gradient-to-br from-bluechip-950 to-bluechip-800 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
            ● 24/7 HOTLINE AVAILABLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            +234 703 762 9149
          </h2>
          <p className="text-blue-100/80 text-sm sm:text-base mt-3 leading-relaxed">
            Save this phone number to your contacts. This is Bluechip's verified hotline for phone calls and WhatsApp messaging.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://wa.me/2347037629149"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-600/20"
            >
              Chat on WhatsApp ↗
            </a>
            <button
              onClick={copyHotline}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition border border-white/20 cursor-pointer"
            >
              {copied ? '✓ Number Copied!' : 'Copy Phone Number'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Verified Communication Channels Grid ── */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-bluechip-950 tracking-tight mb-2">
          All Verified Official Channels
        </h2>
        <p className="text-xs text-slate-500 mb-6">Always double-check handles before initiating transactions.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((ch, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-soft transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 grid place-items-center">
                    {ch.icon}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {ch.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-bluechip-950">{ch.title}</h3>
                <p className="font-bold text-sm text-bluechip-600 mt-1">{ch.detail}</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{ch.sub}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={ch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-extrabold text-bluechip-700 hover:text-bluechip-900 transition"
                >
                  {ch.action}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Security Alert Warning ── */}
      <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-5 items-start">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
          <ShieldAlert size={26} />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-rose-950">Official Security Protocol &amp; Fraud Warning</h3>
          <p className="text-xs text-rose-900/80 mt-1.5 leading-relaxed">
            Bluechip staff will <strong>never</strong> message you first from unknown numbers, ask for your 12-word seed phrase, or ask you to send funds to unverified personal accounts. Always initiate contact directly using the official hotline phone number (<strong>+234 703 762 9149</strong>).
          </p>
        </div>
      </div>
    </div>
  );
}
