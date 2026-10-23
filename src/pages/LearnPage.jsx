import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, ChevronDown, Play, Video, ChevronLeft, ChevronRight, AlertCircle, Award } from 'lucide-react';

const LESSONS = [
  {
    id: 0,
    title: 'What is cryptocurrency?',
    tag: 'Fundamentals',
    color: 'bg-blue-100 text-bluechip-700',
    summary: 'Digital assets, ownership and the core basics.',
    content: 'Cryptocurrency is a digital asset designed to work as a medium of exchange using cryptographic networks. Rather than relying on a central authority like a bank, crypto transactions are recorded on distributed public ledgers. Prices fluctuate rapidly, and safe storage is key.',
    quiz: {
      question: "Is a cryptocurrency's price guaranteed to rise constantly?",
      options: [
        { text: 'Yes, crypto always goes up', correct: false },
        { text: 'No, prices can rise or fall sharply', correct: true },
        { text: 'Guaranteed 20% return daily', correct: false }
      ]
    }
  },
  {
    id: 1,
    title: 'How does blockchain work?',
    tag: 'Technology',
    color: 'bg-violet-100 text-violet-700',
    summary: 'A shared, immutable record of transactions.',
    content: 'A blockchain is a chronological chain of transaction records maintained by a decentralized computer network. Once a block is validated and added to the chain, modifying previous data requires consensus from the network, making it highly secure against tampering.',
    quiz: {
      question: 'What does a blockchain primarily maintain?',
      options: [
        { text: 'A shared, tamper-resistant transaction record', correct: true },
        { text: 'A private database owned by one company', correct: false },
        { text: 'A loan system with zero risk', correct: false }
      ]
    }
  },
  {
    id: 2,
    title: 'Wallets & private keys',
    tag: 'Security',
    color: 'bg-emerald-100 text-emerald-700',
    summary: 'The golden rules of access and custody.',
    content: 'A crypto wallet does not literally store coins inside your phone; it securely holds your private keys and seed phrase. Your 12 or 24-word recovery phrase controls full access to your funds. Anyone with your seed phrase can steal everything. Never type it on a website or send it to anyone claiming to be support.',
    quiz: {
      question: 'Should you ever share your 12-word seed phrase with support staff?',
      options: [
        { text: 'Yes, if they need to verify my wallet', correct: false },
        { text: 'Never share it with anyone under any circumstances', correct: true },
        { text: 'Only if they send an official email', correct: false }
      ]
    }
  },
  {
    id: 3,
    title: 'Networks & transaction fees',
    tag: 'Transfers',
    color: 'bg-amber-100 text-amber-700',
    summary: 'Why selecting the right network matters.',
    content: 'Tokens like USDT exist across multiple separate blockchains (e.g. TRC20 on Tron, ERC20 on Ethereum, BEP20 on BNB Chain). Sending funds to an incompatible address or network may result in permanent loss. Always double-check recipient address and network before executing transfers.',
    quiz: {
      question: 'Before sending crypto, what must you verify?',
      options: [
        { text: 'Both the recipient address and the blockchain network', correct: true },
        { text: 'Only the token logo', correct: false },
        { text: 'Just the dollar amount', correct: false }
      ]
    }
  },
  {
    id: 4,
    title: 'Scams, safety & smart habits',
    tag: 'Protection',
    color: 'bg-rose-100 text-rose-700',
    summary: 'Red flags to recognize before money moves.',
    content: 'Common crypto scams include guaranteed doubling schemes, impersonator accounts in DMs, fake investment pools, and phishing websites. Bluechip will never contact you from unofficial phone numbers or promise guaranteed trading profits. When in doubt, call the official hotline first.',
    quiz: {
      question: 'Someone in your DMs promises to double your crypto today. What should you do?',
      options: [
        { text: 'Send a small amount to test them', correct: false },
        { text: 'Block them immediately — it is 100% a scam', correct: true },
        { text: 'Give them your wallet password', correct: false }
      ]
    }
  }
];

// Curated Crypto Educational Videos Carousel (ready for custom video URLs)
const VIDEO_SERIES = [
  {
    id: 1,
    title: 'Crypto for Complete Beginners in Nigeria',
    duration: '8 mins',
    instructor: 'Vicky & Jay (Bluechip Academy)',
    description: 'A friendly step-by-step introduction to what crypto is and how to get started safely in Nigeria.',
    badge: 'Episode 1'
  },
  {
    id: 2,
    title: 'How to Set Up a Non-Custodial Wallet Safely',
    duration: '11 mins',
    instructor: 'Alex (Dev Team)',
    description: 'Learn how to write down your seed phrase offline and avoid the most common wallet drainer traps.',
    badge: 'Episode 2'
  },
  {
    id: 3,
    title: 'Understanding USDT: TRC20 vs ERC20 vs BEP20',
    duration: '6 mins',
    instructor: 'Bluechip Hotline Team',
    description: 'Avoid permanent loss by understanding network fees and address formats when transferring stablecoins.',
    badge: 'Episode 3'
  },
  {
    id: 4,
    title: 'Top 5 Crypto Scams Targeting Nigerians & How to Spot Them',
    duration: '14 mins',
    instructor: 'Tunde (Community Lead)',
    description: 'Real examples of Ponzi schemes, Telegram impersonators, and how to verify legitimate channels.',
    badge: 'Episode 4'
  }
];

export default function LearnPage() {
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bluechipCompleted') || '[]');
    } catch {
      return [];
    }
  });
  const [openLesson, setOpenLesson] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [videoIndex, setVideoIndex] = useState(0);

  const toggleLesson = (id) => {
    setOpenLesson(openLesson === id ? null : id);
  };

  const handleQuizAnswer = (lessonId, isCorrect) => {
    setQuizAnswers((prev) => ({ ...prev, [lessonId]: isCorrect }));
  };

  const markComplete = (id) => {
    if (!completed.includes(id)) {
      const next = [...completed, id];
      setCompleted(next);
      localStorage.setItem('bluechipCompleted', JSON.stringify(next));
    }
  };

  const nextVideo = () => setVideoIndex((prev) => (prev + 1) % VIDEO_SERIES.length);
  const prevVideo = () => setVideoIndex((prev) => (prev - 1 + VIDEO_SERIES.length) % VIDEO_SERIES.length);

  const progressPercent = Math.round((completed.length / LESSONS.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* ── Page Header & Progress ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-100 mb-12">
        <div>
          <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Bluechip Academy</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bluechip-950 mt-2">
            Learn Crypto Without the Jargon
          </h1>
          <p className="text-slate-500 mt-2 text-base max-w-xl">
            Practical knowledge, real safety habits, and video guides to help you navigate digital assets without fear.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs shrink-0 min-w-[260px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500">Your Academy Progress</span>
            <span className="text-xs font-black text-bluechip-700">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-bluechip-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            {completed.length} of {LESSONS.length} lessons completed
          </p>
        </div>
      </div>

      {/* ── Section: Educational Video Carousel ── */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-bluechip-950 tracking-tight flex items-center gap-2">
              <Video className="text-bluechip-600" size={24} />
              Educational Video Masterclass
            </h2>
            <p className="text-xs text-slate-500 mt-1">Short visual guides created by Vicky, Jay &amp; the Bluechip team.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevVideo}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center text-slate-700 shadow-2xs transition cursor-pointer"
              aria-label="Previous video"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextVideo}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center text-slate-700 shadow-2xs transition cursor-pointer"
              aria-label="Next video"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Video Featured Carousel Player */}
        <div className="bg-bluechip-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative border border-white/10">
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
            {/* Left: Video Player Mockup */}
            <div className="relative aspect-video rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex flex-col justify-center items-center p-6 text-center shadow-inner group">
              <div className="w-16 h-16 rounded-full bg-bluechip-600/90 text-white grid place-items-center shadow-xl group-hover:scale-110 transition duration-300 cursor-pointer">
                <Play size={28} className="translate-x-0.5" />
              </div>
              <p className="font-extrabold text-base text-white mt-4">
                {VIDEO_SERIES[videoIndex].title}
              </p>
              <span className="text-xs text-blue-200/70 mt-1">
                Duration: {VIDEO_SERIES[videoIndex].duration} · Instructor: {VIDEO_SERIES[videoIndex].instructor}
              </span>
              <span className="absolute bottom-3 right-3 text-[10px] bg-black/60 px-2.5 py-1 rounded-md text-white/80 font-bold">
                READY TO EMBED
              </span>
            </div>

            {/* Right: Video Episode Info & Carousel Thumbnails */}
            <div>
              <span className="text-xs font-extrabold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                {VIDEO_SERIES[videoIndex].badge}
              </span>
              <h3 className="text-2xl font-extrabold mt-3 text-white leading-tight">
                {VIDEO_SERIES[videoIndex].title}
              </h3>
              <p className="text-sm text-blue-100/75 mt-3 leading-relaxed">
                {VIDEO_SERIES[videoIndex].description}
              </p>

              {/* Episode selector pills */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-blue-200/60 uppercase tracking-wider font-bold mb-2.5">All Episodes</p>
                <div className="flex flex-wrap gap-2">
                  {VIDEO_SERIES.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setVideoIndex(i)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        videoIndex === i
                          ? 'bg-white text-bluechip-950 font-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {v.badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Interactive Lessons & Quizzes ── */}
      <div>
        <h2 className="text-2xl font-extrabold text-bluechip-950 tracking-tight mb-2 flex items-center gap-2">
          <BookOpen className="text-bluechip-600" size={24} />
          5 Essential Foundation Lessons
        </h2>
        <p className="text-xs text-slate-500 mb-6">Click on any lesson to expand, read, and test your knowledge.</p>

        <div className="space-y-4">
          {LESSONS.map((lesson) => {
            const isOpen = openLesson === lesson.id;
            const isDone = completed.includes(lesson.id);
            const userQuiz = quizAnswers[lesson.id];

            return (
              <div
                key={lesson.id}
                className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-xl grid place-items-center font-extrabold text-sm shrink-0 ${lesson.color}`}>
                      0{lesson.id + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-bluechip-950">{lesson.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                          {lesson.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{lesson.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle size={14} /> Completed
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline">Pending</span>
                    )}
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expanded Lesson Content */}
                {isOpen && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                    <p className="text-slate-700 font-normal leading-7 mb-5">{lesson.content}</p>

                    {/* Interactive Quiz */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5">
                      <p className="font-extrabold text-xs text-bluechip-950 uppercase tracking-wider mb-2">
                        Quick Knowledge Check:
                      </p>
                      <p className="font-bold text-sm text-bluechip-900 mb-3">{lesson.quiz.question}</p>

                      <div className="space-y-2">
                        {lesson.quiz.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleQuizAnswer(lesson.id, opt.correct)}
                            className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-bluechip-600 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition cursor-pointer"
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>

                      {userQuiz !== undefined && (
                        <div className={`mt-3 text-xs font-extrabold flex items-center gap-1.5 ${userQuiz ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {userQuiz ? (
                            <>
                              <CheckCircle size={15} /> Correct! Knowledge is your best protection.
                            </>
                          ) : (
                            <>
                              <AlertCircle size={15} /> Not quite right. Review the lesson and try again!
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => markComplete(lesson.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-bluechip-600 hover:bg-bluechip-700 text-white shadow-xs'
                      }`}
                    >
                      {isDone ? '✓ Lesson Completed' : 'Mark Lesson as Completed ✓'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
