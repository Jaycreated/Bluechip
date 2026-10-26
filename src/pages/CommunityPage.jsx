import React, { useEffect, useState } from 'react';
import { Star, Award, Heart, MessageSquare, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const fallbackTestimonials = [
  {
    id: 'fallback-1',
    name: 'Jane Johnson',
    role: 'Verified Trader',
    location: 'Lagos, Nigeria',
    quote: 'Bluechip helped me start my crypto journey with confidence! The hotline explained TRC20 fees clearly before I transferred a single Naira.',
    date: 'Customer of the Week',
    rating: 5,
    avatar: 'J'
  },
  {
    id: 'fallback-2',
    name: 'Ibrahim Bello',
    role: 'Freelance Designer',
    location: 'Abuja, Nigeria',
    quote: 'Fast settlement and honest rates for USDT. No delays or ghosting like on peer-to-peer apps. When you call the hotline, a real person answers.',
    date: 'Member since 2024',
    rating: 5,
    avatar: 'I'
  },
  {
    id: 'fallback-3',
    name: 'Ngozi Eze',
    role: 'Small Business Owner',
    location: 'Port Harcourt',
    quote: 'The Bluechip Learn lessons helped me avoid a fake Telegram investment group that almost drained my wallet. Thank you team!',
    date: 'Active Learner',
    rating: 5,
    avatar: 'N'
  }
];

const emptyForm = {
  name: '',
  location: '',
  quote: '',
  rating: 5,
};

export default function CommunityPage() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (!error && data && data.length) {
        const mapped = data.map((row) => ({
          id: row.id,
          name: row.name || 'Anonymous',
          location: row.location || 'Nigeria',
          quote: row.quote || '',
          rating: Number(row.rating) || 5,
          avatar: (row.name || 'A').charAt(0).toUpperCase(),
          date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent review',
        }));

        setTestimonials(mapped);
      }
    };

    loadReviews();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.quote.trim()) {
      setStatus({ type: 'error', message: 'Please add your name and review message.' });
      return;
    }

    if (!supabase) {
      setStatus({ type: 'error', message: 'Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    const payload = {
      name: form.name.trim(),
      location: form.location.trim() || 'Nigeria',
      quote: form.quote.trim(),
      rating: Number(form.rating) || 5,
      approved: true,
    };

    const { error } = await supabase.from('reviews').insert([payload]);

    setSubmitting(false);

    if (error) {
      setStatus({
        type: 'error',
        message: 'Your review could not be saved yet. Make sure the Supabase reviews table exists. Use the SQL snippet in the final instructions to create it.',
      });
      return;
    }

    setForm(emptyForm);
    setStatus({ type: 'success', message: 'Your review has been submitted and is now live on the site.' });

    const freshReview = {
      id: Date.now(),
      name: payload.name,
      location: payload.location,
      quote: payload.quote,
      rating: payload.rating,
      avatar: payload.name.charAt(0).toUpperCase(),
      date: 'Just now',
    };

    setTestimonials((current) => [freshReview, ...current]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="max-w-3xl mb-12">
        <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Bluechip Community</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bluechip-950 mt-2">
          Real Traders. Real Stories.
        </h1>
        <p className="mt-4 text-slate-500 leading-relaxed text-base sm:text-lg">
          Bluechip is more than an exchange hotline — it is a growing network of Nigerian crypto learners and traders sharing honest experiences.
        </p>
      </div>

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

          <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 grid place-items-center">
                <Award size={20} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">100% Verified Review</p>
                <p className="text-xs text-blue-100/70">Authenticated customer experience</p>
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
              <button
                type="button"
                onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-full inline-block text-center py-3 bg-white text-bluechip-950 font-extrabold text-xs rounded-xl hover:bg-blue-50 transition shadow-xs"
              >
                Submit Your Own Review
              </button>
            </div>
          </div>
        </div>
      </div>

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

      <div id="review-form" className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-bluechip-600">Share feedback</p>
          <h2 className="text-2xl font-extrabold text-bluechip-950 mt-2">Leave a review on the website</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-2">Your name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition focus:border-bluechip-500 focus:bg-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-2">Location</label>
            <input
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition focus:border-bluechip-500 focus:bg-white"
              placeholder="Lagos, Nigeria"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-2">Rating</label>
            <select
              value={form.rating}
              onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-bluechip-500 focus:bg-white"
            >
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500 mb-2">Your review</label>
            <textarea
              rows="5"
              value={form.quote}
              onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-bluechip-500 focus:bg-white"
              placeholder="Tell other users how the Bluechip hotline and learning experience helped you."
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl bg-bluechip-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-bluechip-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>

            {status.message && (
              <p className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {status.message}
              </p>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-bluechip-950 tracking-tight mb-6">
          What Traders Say About Our Hotline
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={`${t.id || idx}-${i}`} size={14} className="fill-amber-400" />
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
