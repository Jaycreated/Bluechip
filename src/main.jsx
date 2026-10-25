import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sun, Moon, Menu, X, ArrowUpRight, Star } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import MarketsPage from './pages/MarketsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import LearnPage from './pages/LearnPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import './styles.css';

const VALID_PAGES = ['home', 'markets', 'services', 'learn', 'community', 'about', 'contact'];

const HEADER_TESTIMONIALS = [
  '“Bluechip helped me start my crypto journey with confidence!” – Jane Johnson',
  '“Fast settlement and honest rates for USDT. No delays or ghosting.” – Daniel A.',
  '“The Learn lessons helped me avoid a fake Telegram investment group.” – Chidinma O.',
  '“A real person answers the hotline and explains everything clearly.” – Maxwell T.',
];

function getInitialPage() {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (VALID_PAGES.includes(hash)) return hash;

  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  if (VALID_PAGES.includes(path)) return path;

  return 'home';
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [theme, setTheme] = useState(() => localStorage.getItem('bluechip-theme') || 'light');
  const [currency, setCurrency] = useState(() => localStorage.getItem('bluechip-currency') || 'usd');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sparklines, setSparklines] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('bluechip-theme', theme);
  }, [theme]);

  // Sync currency
  useEffect(() => {
    document.documentElement.dataset.currency = currency;
    localStorage.setItem('bluechip-currency', currency);
  }, [currency]);

  // Browser history sync (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Scroll reveal animation for sections and cards
  useEffect(() => {
    const revealTargets = document.querySelectorAll('section, article, .glass, .team-card, .coin-scroll-card, .asset-chart, .cmc-table-wrapper, .market-card, .feature-card, .info-card, .stat-card');

    if (!revealTargets.length) return;

    revealTargets.forEach((el, index) => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${index * 60}ms`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealTargets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage, theme, currency]);

  const navigate = (page) => {
    // Start fade-out animation
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      setMobileMenuOpen(false);
      window.location.hash = page === 'home' ? '' : `#${page}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Fade back in
      setIsAnimating(false);
    }, 300); // match Tailwind transition duration-300
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'markets', label: 'Markets', badge: 'Live 50+' },
    { id: 'services', label: 'Buy & Sell' },
    { id: 'learn', label: 'Learn Crypto' },
    { id: 'community', label: 'Community' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#071225] text-slate-200' : 'bg-white text-slate-800'
      }`}
    >
      {/* ── Nigeria Crypto Top Ribbon ── */}
      <div className="bg-bluechip-950 text-white text-xs py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1.5 font-medium">
            <span>🇳🇬</span> Built for Nigeria's Crypto Community
          </span>
          <div className="flex items-center gap-4 text-[11px] text-blue-200/80 font-semibold">
            <span className="hidden sm:inline">Learn first. Trade smarter. Stay safe.</span>
            <button
              onClick={() => setCurrency((cur) => (cur === 'usd' ? 'ngn' : 'usd'))}
              className="text-white hover:text-blue-300 transition underline cursor-pointer"
            >
              Currency: {currency.toUpperCase()} ({currency === 'usd' ? '$' : '₦'})
            </button>
          </div>
        </div>
      </div>

      {/* ── Community Testimonial Marquee Banner ── */}
      <div className="cw-banner px-4 py-2.5 bg-blue-900 text-white text-xs overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
          <span className="cw-star text-base shrink-0">⭐</span>

          <div className="cw-marquee flex-1 min-w-0">
            <div className="cw-track">
              {[...HEADER_TESTIMONIALS, ...HEADER_TESTIMONIALS].map((quote, index) => (
                <span key={`${quote}-${index}`} className="cw-quote inline-flex items-center text-blue-50">
                  <span className="cw-title font-extrabold text-blue-200 mr-2">Community:</span>
                  {quote}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('community')}
            className="text-[11px] font-extrabold text-amber-300 hover:text-white transition shrink-0 cursor-pointer hidden sm:inline"
          >
            Read More →
          </button>
        </div>
      </div>

      {/* ── Main Persistent Header ── */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#0b1830]/95 border-slate-700 shadow-lg' : 'bg-white/95 border-slate-100 shadow-2xs'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white grid place-items-center shadow-md border border-slate-100">
              <img
                alt="Bluechip Exchange logo"
                className="w-full h-full object-cover"
                src="/bluechip-logo.jpg"
              />
            </div>
            <div>
              <div className="brand font-black tracking-tight text-bluechip-950 text-base leading-tight">
                BLUECHIP <span className="text-bluechip-600">CRYPTO</span>
              </div>
              <div className="text-[9px] uppercase tracking-[.2em] text-slate-400 font-bold">
                Trade with clarity
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-bluechip-50 text-bluechip-700 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-bluechip-950 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Toolbar (Theme/Currency) & Hotline CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={() => setCurrency((cur) => (cur === 'usd' ? 'ngn' : 'usd'))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="Switch currency"
            >
              {currency === 'usd' ? '₦ NGN' : '$ USD'}
            </button>

            <button
              onClick={() => navigate('contact')}
              className="bg-bluechip-700 hover:bg-bluechip-800 text-white rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-md shadow-blue-700/15 transition flex items-center gap-1.5 cursor-pointer"
            >
              Hotline <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 grid place-items-center text-bluechip-950 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-white border-b border-slate-200 shadow-xl">
            <div className="grid gap-1 text-sm font-bold">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`text-left px-4 py-3 rounded-xl transition cursor-pointer flex items-center justify-between ${
                      isActive ? 'bg-bluechip-50 text-bluechip-700 font-black' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                <button
                  onClick={() => setCurrency((cur) => (cur === 'usd' ? 'ngn' : 'usd'))}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-center cursor-pointer"
                >
                  {currency === 'usd' ? 'Show ₦ NGN' : 'Show $ USD'}
                </button>
              </div>

              <button
                onClick={() => navigate('contact')}
                className="mt-3 w-full py-3 bg-bluechip-700 text-white text-xs font-extrabold rounded-xl text-center shadow-md cursor-pointer"
              >
                Call Hotline: +234 703 762 9149 ↗
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Active Page Content ── */}
      <main className={`flex-1 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {currentPage === 'home' && (
          <HomePage onNavigate={navigate} currency={currency} />
        )}

        {currentPage === 'markets' && (
          <MarketsPage
            currency={currency}
            onCurrencyToggle={() => setCurrency((cur) => (cur === 'usd' ? 'ngn' : 'usd'))}
            theme={theme}
            sparklines={sparklines}
            onSparklinesUpdate={(map) => setSparklines((prev) => ({ ...prev, ...map }))}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage currency={currency} />
        )}

        {currentPage === 'learn' && (
          <LearnPage />
        )}

        {currentPage === 'community' && (
          <CommunityPage />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* ── Shared Persistent Footer ── */}
      <footer
        className={`mt-auto border-t transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#0b1830] border-slate-700' : 'bg-white border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1 */}
            <div className="col-span-2 md:col-span-1">
              <button
                onClick={() => navigate('home')}
                className="flex items-center gap-2.5 text-left cursor-pointer mb-3"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden grid place-items-center">
                  <img alt="Bluechip logo" className="w-full h-full object-cover" src="/bluechip-logo.jpg" />
                </div>
                <span className="font-black text-bluechip-950 text-sm">BLUECHIP CRYPTO</span>
              </button>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nigeria's trusted crypto hotline and educational academy. Honest exchange rates and human guidance.
              </p>
              <p className="text-xs font-extrabold text-bluechip-700 mt-3">
                Hotline: +234 703 762 9149
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Sections</p>
              <ul className="space-y-2 text-xs font-bold text-slate-600">
                <li><button onClick={() => navigate('home')} className="hover:text-bluechip-600 cursor-pointer">Home</button></li>
                <li><button onClick={() => navigate('markets')} className="hover:text-bluechip-600 cursor-pointer">Live Markets</button></li>
                <li><button onClick={() => navigate('services')} className="hover:text-bluechip-600 cursor-pointer">Buy &amp; Sell Crypto</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Education &amp; People</p>
              <ul className="space-y-2 text-xs font-bold text-slate-600">
                <li><button onClick={() => navigate('learn')} className="hover:text-bluechip-600 cursor-pointer">Academy Lessons</button></li>
                <li><button onClick={() => navigate('community')} className="hover:text-bluechip-600 cursor-pointer">Community &amp; Reviews</button></li>
                <li><button onClick={() => navigate('about')} className="hover:text-bluechip-600 cursor-pointer">About the Team</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Hotline Support</p>
              <ul className="space-y-2 text-xs font-bold text-slate-600">
                <li><button onClick={() => navigate('contact')} className="hover:text-bluechip-600 cursor-pointer">Contact Hotline</button></li>
                <li><a href="https://wa.me/2347037629149" target="_blank" rel="noopener noreferrer" className="hover:text-bluechip-600">WhatsApp Channel ↗</a></li>
                <li><a href="https://instagram.com/the_bluechipexchange" target="_blank" rel="noopener noreferrer" className="hover:text-bluechip-600">Instagram ↗</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} Bluechip Crypto Exchange. All rights reserved.</p>
            <p>Confirm applicable Nigerian regulatory disclosures before transferring funds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
