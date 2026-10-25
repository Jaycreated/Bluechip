import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, ChevronDown, Play, Video, ChevronLeft, ChevronRight, AlertCircle, Award } from 'lucide-react';

const LESSONS = [
  {
    id: 0,
    title: 'What is Blockchain?',
    tag: 'Technology',
    color: 'bg-blue-100 text-bluechip-700',
    summary: 'We’re starting with the tech that powers everything.',
    content: 'A blockchain is a shared digital ledger that records transactions across many computers. Once a block is verified and added, it becomes very difficult to change without the agreement of the network. That makes it useful for transparency and trust, but it also means you still need to be careful with security and scams.',
    quiz: {
      question: 'What is blockchain primarily used for?',
      options: [
        { text: 'To keep a shared record of verified transactions', correct: true },
        { text: 'To guarantee price increases', correct: false },
        { text: 'To replace all banks overnight', correct: false }
      ]
    }
  },
  {
    id: 1,
    title: 'What is Bitcoin?',
    tag: 'Basics',
    color: 'bg-violet-100 text-violet-700',
    summary: 'The first and most well-known cryptocurrency.',
    content: 'Bitcoin is digital money that was created in 2009 by Satoshi Nakamoto. Unlike fiat currency, no government or bank controls it. People can send Bitcoin directly to one another, and every transaction is recorded on its blockchain. Bitcoin was created with a finite supply, and there will only ever be 21 million Bitcoin. Think of it like digital gold — it is limited, and many people hold it for the long term instead of spending it every day.',
    quiz: {
      question: 'What is Bitcoin?',
      options: [
        { text: 'The first and most well-known cryptocurrency', correct: true },
        { text: 'A bank-issued savings account', correct: false },
        { text: 'A guaranteed way to earn daily profits', correct: false }
      ]
    }
  },
  {
    id: 2,
    title: 'What are cryptocurrencies?',
    tag: 'Fundamentals',
    color: 'bg-emerald-100 text-emerald-700',
    summary: 'Digital money beyond Bitcoin, including altcoins and stablecoins.',
    content: 'Cryptocurrencies are digital assets that use blockchain technology. Bitcoin was the first, but thousands of others now exist. • Bitcoin is the original and most valuable. • Altcoins are other cryptocurrencies built after Bitcoin, such as Ethereum and Solana. Some focus on speed, smart contracts, or specific uses. • Stablecoins are cryptocurrencies designed to stay at a steady value, usually pegged to the US dollar, such as USDT or USDC. People use them to avoid volatility when moving money, save digital dollars, and trade cryptocurrencies. To own a crypto asset, you usually have to buy it using a stablecoin or another cryptocurrency. Not all cryptocurrencies are the same. Some are useful, some are risky, and some exist mainly for speculation.',
    quiz: {
      question: 'Which statement is most accurate?',
      options: [
        { text: 'Different cryptocurrencies can serve different functions and carry different risks', correct: true },
        { text: 'All cryptocurrencies are identical', correct: false },
        { text: 'Every coin is guaranteed to rise', correct: false }
      ]
    }
  },
  {
    id: 3,
    title: 'Wallets & Private Keys',
    tag: 'Security',
    color: 'bg-amber-100 text-amber-700',
    summary: 'How you store and control your crypto.',
    content: 'A crypto wallet is what you use to store, send, and receive cryptocurrency. There are two main types: • Hot wallets (connected to the internet) — convenient but less secure. • Cold wallets (offline) — also called hardware wallets or ledgers, and safer for larger amounts. Your private key, or seed phrase, is the most important thing. Whoever has it controls the crypto. Never share it with anyone, and never store it only on your phone or computer. If you lose your private key and have no backup, your crypto is gone forever.',
    quiz: {
      question: 'What should you never do with your seed phrase?',
      options: [
        { text: 'Share it with anyone or enter it into a website', correct: true },
        { text: 'Write it down in a safe place', correct: false },
        { text: 'Keep it offline', correct: false }
      ]
    }
  },
  {
    id: 4,
    title: 'Networks & Transaction Fees',
    tag: 'Transfers',
    color: 'bg-rose-100 text-rose-700',
    summary: 'Always check the network before sending funds.',
    content: 'When you send crypto, you have to choose the right network. For example, USDT can travel on different networks such as TRC20, ERC20, or BEP20. Think of it like sending a package: if you choose the wrong delivery company, the package may not arrive. Sending crypto on the wrong network can mean the money is lost. Fees also change depending on the network. Some networks are cheaper and faster, while others cost more. Always check the network and the fee before you send.',
    quiz: {
      question: 'What should you confirm before sending crypto?',
      options: [
        { text: 'The wallet address and the correct blockchain network', correct: true },
        { text: 'Only the token image', correct: false },
        { text: 'Only the price you saw online', correct: false }
      ]
    }
  },
  {
    id: 5,
    title: 'Scams, Safety & Smart Habits',
    tag: 'Protection',
    color: 'bg-sky-100 text-sky-700',
    summary: 'How to protect yourself in crypto.',
    content: 'In crypto, there is usually no bank that can reverse a payment or recover your money. This is why you have to be careful. Watch out for these red flags: • Anyone promising you high returns every day • People asking for your private key or seed phrase • Random investment groups on Telegram or WhatsApp • Pressure to send money quickly. Good habits: • Never share your private key • Double-check the address and network before sending • Start with small amounts while you are learning • Take your time and verify information yourself. If something feels too good to be true or too rushed, it is safer to walk away.',
    quiz: {
      question: 'What is the safest reaction to a message promising guaranteed crypto profits?',
      options: [
        { text: 'Pause, verify, and check official channels before taking action', correct: true },
        { text: 'Send a small amount to confirm it works', correct: false },
        { text: 'Share your private keys to prove trust', correct: false }
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-10 border-b border-slate-100 mb-12 rounded-2xl">
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
        </div>

        {/* Coming Soon */}
        <div className="bg-bluechip-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative border border-white/10">
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
            <div className="relative aspect-video rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex flex-col justify-center items-center p-6 text-center shadow-inner">
              <div className="w-16 h-16 rounded-full bg-slate-200/10 border border-white/15 text-white grid place-items-center shadow-xl">
                <Play size={28} className="text-blue-200 opacity-60 translate-x-0.5" />
              </div>
              <p className="font-extrabold text-base text-white mt-5">Coming Soon</p>
              <span className="text-xs text-blue-200/70 mt-1">Short crypto education videos are being prepared for launch.</span>
              <span className="absolute bottom-3 right-3 text-[10px] bg-white/10 px-2.5 py-1 rounded-md text-white/80 font-bold border border-white/10">
                COMING SOON
              </span>
            </div>

            <div>
              <span className="text-xs font-extrabold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                Launching soon
              </span>
              <h3 className="text-2xl font-extrabold mt-3 text-white leading-tight">
                Crypto education videos are on the way
              </h3>
              <p className="text-sm text-blue-100/75 mt-3 leading-relaxed">
                We’re preparing bite-sized lessons for beginners in Nigeria covering wallets, scams, stablecoins, and safe crypto habits.
              </p>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-blue-200/60 uppercase tracking-wider font-bold mb-2.5">Preview Topics</p>
                <div className="flex flex-wrap gap-2">
                  {['Wallet safety', 'USDT networks', 'Scam prevention', 'Beginner basics'].map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/10"
                    >
                      {topic}
                    </span>
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
          Crypto Basics
        </h2>
        <p className="text-xs text-slate-500 mb-6">Start with the foundations. Learn the technology, the assets, and the safety habits that matter most.</p>

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
                  className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50/60 transition"
                >
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl grid place-items-center font-extrabold text-xs sm:text-sm shrink-0 ${lesson.color}`}>
                      0{lesson.id + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-bluechip-950 leading-snug">{lesson.title}</h3>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                          {lesson.tag}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{lesson.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle size={12} className="sm:w-[14px] sm:h-[14px]" /> Completed
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:inline">Pending</span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expanded Lesson Content */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 sm:pb-6 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                    <p className="text-slate-700 font-normal leading-6 sm:leading-7 mb-4 sm:mb-5">{lesson.content}</p>

                    {/* Interactive Quiz */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5">
                      <p className="font-extrabold text-[10px] sm:text-xs text-bluechip-950 uppercase tracking-wider mb-2">
                        Quick Knowledge Check:
                      </p>
                      <p className="font-bold text-xs sm:text-sm text-bluechip-900 mb-3">{lesson.quiz.question}</p>

                      <div className="space-y-2">
                        {lesson.quiz.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleQuizAnswer(lesson.id, opt.correct)}
                            className="w-full text-left px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-bluechip-600 hover:bg-blue-50/50 text-[11px] sm:text-xs font-semibold text-slate-700 transition cursor-pointer"
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>

                      {userQuiz !== undefined && (
                        <div className={`mt-3 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 ${userQuiz ? 'text-emerald-600' : 'text-rose-600'}`}>
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
                      className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition cursor-pointer ${
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

      <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-bluechip-50 p-6 sm:p-8">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-bluechip-600">Keep learning</p>
        <h3 className="mt-2 text-2xl font-extrabold text-bluechip-950">Speak with the Bluechip team to get more exclusive lessons.</h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          For deeper guidance, quick questions, or a more personal walkthrough, reach out through our official WhatsApp or email channels.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/2347037629149?text=Hello%20Bluechip,%20I%20want%20to%20keep%20learning%20about%20crypto."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-bluechip-900 px-5 py-3 text-xs font-extrabold text-white shadow-sm hover:bg-bluechip-800 transition"
          >
            WhatsApp: +234 703 762 9149
          </a>
          <a
            href="mailto:support@thebluechipexchange.com"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-extrabold text-bluechip-700 hover:bg-slate-50 transition"
          >
            Email: support@thebluechipexchange.com
          </a>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-200">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Latest threads</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <a
              href="https://x.com/babyflaako/status/2058516307188810176"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-extrabold text-sky-700 hover:bg-sky-100 transition"
            >
              Read thread 1 ↗
            </a>
            <a
              href="https://x.com/babyflaako/status/2099323261125275962?s=12"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-extrabold text-sky-700 hover:bg-sky-100 transition"
            >
              Read thread 2 ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
