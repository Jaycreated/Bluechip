import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Sun, Moon, RefreshCw} from 'lucide-react';
import {pageMarkup} from './markup.jsx';
import AssetChart from './components/AssetChart.jsx';
import './styles.css';

const CACHE_KEY='bluechip-market-cache-v2';
const CACHE_TTL=3*60*1000;
const coins=[{id:'bitcoin',name:'Bitcoin',symbol:'BTC',icon:'₿',color:'#fff1d6',ink:'#b7791f'},{id:'ethereum',name:'Ethereum',symbol:'ETH',icon:'◆',color:'#e9edff',ink:'#627eea'},{id:'solana',name:'Solana',symbol:'SOL',icon:'≋',color:'#e8fff5',ink:'#15966b'},{id:'binancecoin',name:'BNB',symbol:'BNB',icon:'◆',color:'#fff7d6',ink:'#b78b00'},{id:'tether',name:'Tether',symbol:'USDT',icon:'₮',color:'#dffaf0',ink:'#168a68'}];
const money=(n,currency)=>new Intl.NumberFormat('en-NG',{style:'currency',currency,maximumFractionDigits:n<1?5:2}).format(n);
function App(){
 const [theme,setTheme]=useState(()=>localStorage.getItem('bluechip-theme')||'light');
 const [currency,setCurrency]=useState(()=>localStorage.getItem('bluechip-currency')||'usd');
 const [toast,setToast]=useState('');
 const [sparklines,setSparklines]=useState({});
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('bluechip-theme',theme)},[theme]);
 useEffect(()=>{document.documentElement.dataset.currency=currency;localStorage.setItem('bluechip-currency',currency)},[currency]);
 useEffect(()=>{
  let toastTimer;
  const notify=(msg)=>{setToast(msg);clearTimeout(toastTimer);toastTimer=setTimeout(()=>setToast(''),2800)};
  const root=document.getElementById('root');
  const menuBtn=document.getElementById('menuBtn'),menu=document.getElementById('mobileMenu');
  const toggleMenu=()=>{if(menu)menu.style.display=menu.style.display==='block'?'none':'block'};
  menuBtn?.addEventListener('click',toggleMenu);menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.style.display='none'));
  const coinsUrl=(cur)=>`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${cur}&ids=${coins.map(c=>c.id).join(',')}&price_change_percentage=24h&sparkline=true`;
  const status=(message,color)=>{const el=document.getElementById('marketStatus'),dot=document.getElementById('marketDot');if(el)el.textContent=message;if(dot)dot.className=`w-2 h-2 rounded-full ${color}`};
  const render=(data,cur)=>{
   const grid=document.getElementById('coinGrid');if(!grid)return;
   const byId=Object.fromEntries(data.map(d=>[d.id,d]));
   grid.innerHTML=coins.map(c=>{const d=byId[c.id];if(!d||typeof d.current_price!=='number')return '';const change=d.price_change_percentage_24h??0;return `<article class="market-card bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-soft transition"><div class="flex items-center gap-3"><div class="coin-icon" style="background:${c.color};color:${c.ink}">${c.icon}</div><div><p class="font-extrabold text-bluechip-950">${c.symbol}</p><p class="text-xs text-slate-400">${c.name}</p></div></div><p class="market-price text-xl font-extrabold text-bluechip-950 mt-5">${money(d.current_price,cur.toUpperCase())}</p><p class="text-xs font-bold mt-1 ${change>=0?'text-emerald-600':'text-rose-600'}">${change>=0?'▲':'▼'} ${Math.abs(change).toFixed(2)}% <span class="font-normal text-slate-400">24h</span></p></article>`}).join('');
   const movers=data.filter(c=>typeof c.price_change_percentage_24h==='number').sort((a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h);
   const row=c=>`<div class="flex items-center justify-between py-3 border-b last:border-0 border-slate-100"><div class="flex items-center gap-3"><span class="w-8 h-8 rounded-lg bg-slate-100 grid place-items-center text-xs font-extrabold">${c.symbol.toUpperCase()}</span><span class="font-bold text-bluechip-950">${c.name}</span></div><span class="font-extrabold ${c.price_change_percentage_24h>=0?'text-emerald-600':'text-rose-600'}">${c.price_change_percentage_24h>=0?'+':''}${c.price_change_percentage_24h.toFixed(2)}%</span></div>`;
   const gain=document.getElementById('gainers'),loss=document.getElementById('losers');if(gain)gain.innerHTML=movers.slice(0,3).reverse().map(row).join('')||'Not enough data yet.';if(loss)loss.innerHTML=movers.slice(-3).reverse().map(row).join('')||'Not enough data yet.';
  };
  const loadMarket=async(force=false)=>{
   let cached=null;try{cached=JSON.parse(localStorage.getItem(CACHE_KEY)||'null')}catch{}
   if(!force&&cached?.currency===currency&&Array.isArray(cached.data)&&Date.now()-cached.savedAt<CACHE_TTL){render(cached.data,currency);status('Cached data · refreshed within 3 min','bg-sky-500');return}
   status('Refreshing market data…','bg-amber-400');
   try{const response=await fetch(coinsUrl(currency),{headers:{accept:'application/json'}});if(!response.ok){const err=new Error(`HTTP ${response.status}`);err.status=response.status;throw err}const data=await response.json();if(!Array.isArray(data)||data.length<1)throw new Error('No market data returned');const record={currency,data,savedAt:Date.now()};localStorage.setItem(CACHE_KEY,JSON.stringify(record));render(data,currency);status('Live data · updated just now','bg-emerald-400');
    const sl={};data.forEach(d=>{const sym=coins.find(c=>c.id===d.id)?.symbol;if(sym&&d.sparkline_in_7d?.price?.length){sl[sym]=d.sparkline_in_7d.price;}});if(Object.keys(sl).length)setSparklines(sl);}
   catch(err){const good=cached?.currency===currency&&Array.isArray(cached.data)&&cached.data.length;
    if(good){render(cached.data,currency);status(err.status===429?'Rate limited · showing last good prices':'Connection issue · showing last good prices','bg-amber-400')}
    else{status(err.status===429?'Rate limited · no saved prices yet':'Market data unavailable','bg-rose-400');const grid=document.getElementById('coinGrid');if(grid)grid.innerHTML='<div class="sm:col-span-2 lg:col-span-5 rounded-2xl bg-white border border-slate-100 p-6 text-sm text-slate-500">Prices could not load and no saved prices are available for this currency yet. Please try Refresh shortly.</div>';for(const id of ['gainers','losers']){const el=document.getElementById(id);if(el)el.textContent='Market data unavailable. Please refresh.'}}
   }
  };
  const onRefresh=()=>loadMarket(true);const onCurrency=()=>setCurrency(v=>v==='usd'?'ngn':'usd');
  // Wire the existing market controls once per effect cycle.
  const oldRefresh=[...document.querySelectorAll('#markets button')].find(b=>b.textContent.trim().includes('Refresh'));
  if(oldRefresh){oldRefresh.innerHTML='<span class="inline-flex items-center gap-1"><span>↻</span> Refresh</span>';oldRefresh.addEventListener('click',onRefresh)}
  const currencyBtn=document.getElementById('currencyToggle');currencyBtn?.addEventListener('click',onCurrency);
  const oldCurrency=document.getElementById('currencyToggle');if(oldCurrency)oldCurrency.textContent=currency==='usd'?'Show ₦ NGN':'Show $ USD';
  const updateCurrencyLabel=()=>{const b=document.getElementById('currencyToggle');if(b)b.textContent=currency==='usd'?'Show ₦ NGN':'Show $ USD'};updateCurrencyLabel();
  loadMarket(false);const interval=setInterval(()=>loadMarket(false),CACHE_TTL);
  let completed=[];try{completed=JSON.parse(localStorage.getItem('bluechipCompleted')||'[]')}catch{completed=[]}
  const updateProgress=()=>{document.querySelectorAll('.lesson').forEach(card=>{const i=Number(card.dataset.lesson),done=completed.includes(i),check=card.querySelector('.lesson-check');if(check){check.textContent=done?'✓':'○';check.className='lesson-check text-xl '+(done?'text-emerald-600':'text-slate-300')}});const t=document.getElementById('progressText'),bar=document.getElementById('progressBar');if(t)t.textContent=`${completed.length} of 5 lessons complete`;if(bar)bar.style.width=(completed.length/5*100)+'%';localStorage.setItem('bluechipCompleted',JSON.stringify(completed))};updateProgress();
  const handleClick=e=>{const target=e.target.closest('button');if(!target)return;
   if(target.classList.contains('lesson-toggle')){target.parentElement.querySelector('.lesson-body')?.classList.toggle('hidden');return}
   if(target.classList.contains('quiz-option')){const feedback=target.closest('.lesson-body').querySelector('.quiz-feedback'),correct=target.dataset.correct==='true';feedback.textContent=correct?'Correct! Safety and understanding come first.':'Not quite. Give it another thought.';feedback.className='quiz-feedback mt-2 text-xs font-bold '+(correct?'text-emerald-600':'text-rose-600');target.parentElement.querySelectorAll('.quiz-option').forEach(b=>{b.classList.remove('border-bluechip-600','bg-blue-50');b.classList.add('border-slate-200')});target.classList.add('border-bluechip-600','bg-blue-50');return}
   if(target.classList.contains('complete-lesson')){const i=Number(target.closest('.lesson').dataset.lesson);if(!completed.includes(i))completed.push(i);updateProgress();target.textContent='Lesson completed ✓';notify('Progress saved on this device.');return}
   if(target.textContent.includes('(soon)')||target.textContent.trim()==='Login'){notify('Member login is on the roadmap. Stay tuned!')}
  };
  document.addEventListener('click',handleClick);const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  return()=>{clearInterval(interval);clearTimeout(toastTimer);document.removeEventListener('click',handleClick);menuBtn?.removeEventListener('click',toggleMenu);oldRefresh?.removeEventListener('click',onRefresh);currencyBtn?.removeEventListener('click',onCurrency)};
 },[currency]);
 const ASSETS = [
  {name:'Bitcoin',symbol:'BTC'},{name:'Ethereum',symbol:'ETH'},
  {name:'Solana',symbol:'SOL'},{name:'BNB',symbol:'BNB'},{name:'Tether',symbol:'USDT'},
 ];
 const TEAM = [
  {name:'Vicky Nwankwo',role:'Founder'},
  {name:'Alex Johnson',role:'Dev'},
  {name:'Tunde Adeyemi',role:'Community Manager'},
  {name:'Chidinma Oke',role:'Social-Media Manager'},
  {name:'Emeka Okafor',role:'CFO'},
 ];
 const enhanced=React.cloneElement(pageMarkup,{},pageMarkup.props.children);
 return <>
  <div className="site-toolbar" aria-label="Display preferences">
   <span className="toolbar-label">Appearance</span>
   <button className="theme-toggle" onClick={()=>setTheme(t=>t==='light'?'dark':'light')} aria-label={`Switch to ${theme==='light'?'dark':'light'} mode`}>
    {theme==='light'?<Moon size={17}/>:<Sun size={17}/>}<span>{theme==='light'?'Dark mode':'Light mode'}</span>
   </button>
   <button className="currency-toggle" onClick={()=>{const next=currency==='usd'?'ngn':'usd';setCurrency(next);}}>
    {currency==='usd'?'₦ Show Naira':'$ Show USD'}
   </button>
  </div>
  {/* ── Best Customer of the Week ── */}
  <div className="cw-banner">
   <span className="cw-star">⭐</span>
   <div>
    <p className="cw-title">Best Customer of the Week</p>
    <p className="cw-quote">"Bluechip helped me start my crypto journey with confidence!" – <strong>Jane Doe</strong></p>
   </div>
  </div>
  <div className="legacy-page">{enhanced}</div>
  {/* ── Asset Charts ── */}
  <section id="top-charts" className="charts-section">
   <div className="max-w-7xl mx-auto px-4 py-14">
    <p className="text-bluechip-600 uppercase tracking-[.18em] text-xs font-extrabold">Live charts</p>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-bluechip-950 mt-2 mb-8">Top asset price charts</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {ASSETS.map(a=><AssetChart key={a.symbol} title={a.name} symbol={a.symbol} theme={theme} currency={currency} sparklineData={sparklines[a.symbol]}/>)}
    </div>
   </div>
  </section>
  {/* ── Team ── */}
  <section id="team" className="team-section">
   <div className="max-w-7xl mx-auto px-4 py-14">
    <p className="text-blue-300 uppercase tracking-[.18em] text-xs font-extrabold">The people behind Bluechip</p>
    <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-8">A note from the team</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
     {TEAM.map(m=>(
      <div key={m.name} className="team-card">
       <div className="team-avatar">{m.name.charAt(0)}</div>
       <div><p className="font-extrabold text-white">{m.name}</p><p className="text-sm text-blue-300 mt-1">{m.role}</p></div>
      </div>
     ))}
    </div>
    <blockquote className="team-quote mt-10">"We want Bluechip to be a place where you can ask questions, understand your options and take your time. The crypto space moves fast. Good decisions start with clear information."</blockquote>
   </div>
  </section>
  {toast&&<div className="toast-message" role="status">{toast}</div>}
 </>;
}

createRoot(document.getElementById('root')).render(<App/>);
