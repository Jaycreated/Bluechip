import React from 'react';
import { Star, Award, Heart, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';

export default function CommunityPage() {
  const testimonials = [
    {
      name: 'Jane Johnson',
      role: 'Verified Trader',
      location: 'Lagos, Nigeria',
      quote: 'Bluechip helped me start my crypto journey with confidence! The hotline explained TRC20 fees clearly before I transferred a single Naira.',
      date: 'Customer of the Week',
      rating: 5,
      avatar: 'J'
    },
    {
      name: 'Ibrahim Bello',
      role: 'Freelance Designer',
      location: 'Abuja, Nigeria',
      quote: 'Fast settlement and honest rates for USDT. No delays or ghosting like on peer-to-peer apps. When you call the hotline, a real person answers.',
      date: 'Member since 2024',
      rating: 5,
      avatar: 'I'
    },
    {
      name: 'Ngozi Eze',
      role: 'Small Business Owner',
      location: 'Port Harcourt',
      quote: 'The Bluechip Learn lessons helped me avoid a fake Telegram investment group that almost drained my wallet. Thank you team!',
      date: 'Active Learner',
      rating: 5,
      avatar: 'N'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* ── Page Header ── */}
      <div className="max-w-3xl mb-12">
        <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Bluechip Community</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bluechip-950 mt-2">
          Real Traders. Real Stories.
        </h1>
        <p className="mt-4 text-slate-500 leading-relaxed text-base sm:text-lg">
          Bluechip is more than an exchange hotline — it is a growing network of Nigerian crypto learners and traders sharing honest experiences.
        </p>
      </div>

      {/* ── Customer of the Week Hero Feature ── */}
      <div className="bg-gradient-to-br from-bluechip-950 via-bluechip-900 to-bluechip-800 text-white rounded-3xl p-7 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-4">
              <Star size={14} className="fill-amber-300" />
              CUSTOMER OF THE WEEK SPOTLIGHT
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              "Bluechip helped me start my crypto journey with confidence!"
            </h2>
            <p className="text-blue-100/80 text-sm sm:text-base mt-4 leading-relaxed font-medium">
              Every week, the Bluechip team honors one outstanding customer who exemplifies safe crypto habits and community participation.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-bluechip-950 font-black text-xl grid place-items-center">
                J
              </div>
              <div>
                <p className="font-extrabold text-base text-white">Jane Johnson</p>
                <p className="text-xs text-blue-200/70">Verified Customer · Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          {/* Testimonial Stats Box */}
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 grid place-items-center">
                <Award size={20} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">100% Verified Review</p>
                <p className="text-xs text-blue-100/70">Authenticated transaction on hotline</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-400 grid place-items-center">
                <Star size={20} className="fill-amber-400" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">5-Star Customer Rating</p>
                <p className="text-xs text-blue-100/70">Fast settlement &amp; clear communication</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/2347037629149?text=Hello%20Bluechip,%20I%20would%20like%20to%20share%20my%20review%20or%20trade!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center py-3 bg-white text-bluechip-950 font-extrabold text-xs rounded-xl hover:bg-blue-50 transition shadow-xs"
              >
                Submit Your Own Review ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Community Spotlights Grid ── */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-bluechip-600 grid place-items-center mb-5">
            <Sparkles size={24} />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-bluechip-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Spotlight
          </span>
          <h3 className="font-extrabold text-xl text-bluechip-950 mt-3">Learner of the Week</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Honoring students who complete our 5 Bluechip Academy lessons and actively ask questions on safety and blockchain.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mb-5">
            <Heart size={24} />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Recognition
          </span>
          <h3 className="font-extrabold text-xl text-bluechip-950 mt-3">Community Builder</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Shout-outs for members who share helpful educational resources and guide beginners away from dangerous scam DMs.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center mb-5">
            <MessageSquare size={24} />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            Integrity
          </span>
          <h3 className="font-extrabold text-xl text-bluechip-950 mt-3">Verified Stories</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            We feature authentic customer feedback only with direct permission. Zero fabricated testimonials or fake trading profits.
          </p>
        </div>
      </div>

      {/* ── All Reviews & Feedback List ── */}
      <div>
        <h2 className="text-2xl font-extrabold text-bluechip-950 tracking-tight mb-6">
          What Traders Say About Our Hotline
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic font-medium">"{t.quote}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-bluechip-100 text-bluechip-800 font-extrabold text-sm grid place-items-center">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-xs text-bluechip-950">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
