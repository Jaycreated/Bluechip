import React from 'react';
import { ShieldCheck, HeartHandshake, Eye, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const TEAM = [
    {
      name: 'Ridwan Yusuf',
      role: 'Founder & Vision Lead',
      bio: 'Leading the mission to make cryptocurrency transparent, accessible, and honest for Nigerians.',
      initial: 'V',
      color: 'bg-blue-600'
    },
    {
      name: 'Johnson John',
      role: 'Lead Developer & Tech',
      bio: 'Engineering the Bluechip platform, data integrations, and security verification tools.',
      initial: 'A',
      color: 'bg-indigo-600'
    },
    {
      name: 'Victoria Shima',
      role: 'Community Manager',
      bio: 'Fostering safe community spaces and organizing educational workshops across Nigeria.',
      initial: 'T',
      color: 'bg-emerald-600'
    },
    {
      name: 'Victoria Shima',
      role: 'Social-Media Manager',
      bio: 'Communicating market trends, security warnings, and updates without hype or jargon.',
      initial: 'C',
      color: 'bg-amber-600'
    },
    {
      name: 'Ridwan Yusuf',
      role: 'Chief Financial Officer (CFO)',
      bio: 'Overseeing liquidity, exchange settlements, and responsible financial risk management.',
      initial: 'E',
      color: 'bg-rose-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* ── Page Header ── */}
      <div className="max-w-3xl mb-12">
        <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">About Bluechip</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bluechip-950 mt-2">
          Crypto Should Feel Clearer, Not Confusing.
        </h1>
        <p className="mt-4 text-slate-500 leading-relaxed text-base sm:text-lg">
          We bring human guidance together with practical education, giving Nigerian traders an approachable, safety-first platform.
        </p>
      </div>

      {/* ── Mission & Standards ── */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-bluechip-600 grid place-items-center mb-5">
            <Eye size={24} />
          </div>
          <h3 className="font-extrabold text-xl text-bluechip-950">Our Mission</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Make crypto education approachable and help everyday people navigate digital assets with genuine confidence.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mb-5">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-extrabold text-xl text-bluechip-950">Our Standard</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Clarity, responsible communication, zero false promises, and verifiable security protocols on every transaction.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 grid place-items-center mb-5">
            <HeartHandshake size={24} />
          </div>
          <h3 className="font-extrabold text-xl text-bluechip-950">Human Hotline</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Instead of automated bots that abandon you when issues arise, our team communicates directly with you via phone and verified chat.
          </p>
        </div>
      </div>

      {/* ── Meet the Team Section ── */}
      <div className="mb-16">
        <div className="mb-8">
          <span className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">The Team</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-bluechip-950 mt-1">
            The People Behind Bluechip
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Meet the developers, managers, and leadership dedicated to safe crypto access.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-soft transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${member.color} text-white font-black text-xl grid place-items-center shadow-md`}>
                    {member.initial}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-bluechip-950">{member.name}</h3>
                    <p className="text-xs font-bold text-bluechip-600">{member.role}</p>
                  </div>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Verified Team Member</span>
                <span className="text-bluechip-600">Bluechip Nigeria</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── A Note from the Team Quote Box ── */}
      <div className="bg-gradient-to-br from-bluechip-950 to-bluechip-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10">
        <div className="max-w-3xl">
          <span className="text-4xl text-blue-300 font-serif leading-none">“</span>
          <p className="text-lg sm:text-2xl font-bold leading-relaxed text-blue-50 mt-2">
            We want Bluechip to be a place where you can ask questions, understand your options, and take your time. The crypto space moves fast. Good decisions start with clear information.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bluechip-600 text-white font-bold grid place-items-center">
              V
            </div>
            <div>
              <p className="font-extrabold text-sm text-white">Ridwan Yusuf &amp; The Bluechip Team</p>
              <p className="text-xs text-blue-200/70">Founders Message · Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
