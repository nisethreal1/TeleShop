import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Zap, ShieldCheck, CreditCard } from 'lucide-react';

export default function Home() {
  const { phones } = useStore();
  const flashSalePhones = phones.filter(p => p.badges?.includes('Flash Sale'));
  const newArrivals = phones.filter(p => !p.badges?.includes('Flash Sale')).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Editorial Style */}
      <section className="relative overflow-hidden bg-ink text-white pt-20 pb-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=2000" 
            alt="Abstract Phone"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-end justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-sm tracking-[0.2em] uppercase text-accent mb-6 font-semibold">
              The Future is in your hands
            </p>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-8">
              BEYOND <br/><span className="italic font-light text-white/80">SMART</span>
            </h1>
            <p className="text-xl text-white/70 font-sans max-w-md font-light mb-10">
              Discover the latest flagship devices. Premium phones. Refurbished classics. Next-gen technology.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-white text-ink px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-white transition-all group"
            >
              Explore Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-ink/10 py-8 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-ink/10">
            <div className="flex items-center gap-4 md:px-6 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-ink" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">1 Year Warranty</h3>
                <p className="text-xs text-ink/60 mt-1">Official manufacturer guarantee on all new devices.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:px-6 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Zap className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Flash Delivery</h3>
                <p className="text-xs text-ink/60 mt-1">Order before 2 PM for same-day delivery in the city.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:px-6 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                <CreditCard className="text-ink" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Pay Later / Installments</h3>
                <p className="text-xs text-ink/60 mt-1">0% interest up to 12 months with partner banks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      {flashSalePhones.length > 0 && (
        <section className="py-24 bg-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12 border-b border-ink/10 pb-6">
              <div>
                <h2 className="font-serif text-4xl mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 bg-accent rounded-full animate-pulse inline-block"></span>
                  Flash Sale
                </h2>
                <p className="text-ink/60 text-sm font-mono uppercase tracking-widest">Ends in: 04:23:45</p>
              </div>
              <Link to="/shop?sale=true" className="text-sm font-semibold hover:text-accent flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashSalePhones.map(phone => (
                <Link to={`/product/${phone.id}`} key={phone.id} className="group flex flex-col">
                  <div className="bg-white rounded-3xl p-6 aspect-[3/4] mb-4 relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Deal
                      </span>
                    </div>
                    <img 
                      src={phone.images[0]} 
                      alt={phone.model} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{phone.brand} {phone.model}</h3>
                    <div className="flex items-center gap-3 mt-1 font-mono">
                      <span className="text-accent font-bold">${phone.price}</span>
                      {phone.originalPrice && (
                        <span className="text-ink/40 line-through text-sm">${phone.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended / New Arrivals */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-ink/10 pb-6">
            <h2 className="font-serif text-4xl">Trending Now</h2>
            <Link to="/shop" className="text-sm font-semibold hover:text-accent flex items-center gap-1">
              Shop entire catalog <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            {newArrivals.map((phone, idx) => (
              <div key={phone.id} className={`bg-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 ${idx === 0 ? 'md:col-span-2' : ''}`}>
                <div className={`${idx === 0 ? 'w-full md:w-1/2' : 'w-full'} flex-1`}>
                  <p className="text-xs font-mono text-ink/50 uppercase tracking-widest mb-3">{phone.brand}</p>
                  <h3 className={`font-serif leading-tight mb-4 ${idx === 0 ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
                    {phone.model}
                  </h3>
                  <p className="text-ink/70 text-sm mb-8 max-w-md line-clamp-2">
                    {phone.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-lg font-bold">${phone.price}</span>
                    <Link to={`/product/${phone.id}`} className="text-sm font-semibold border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors">
                      Discover
                    </Link>
                  </div>
                </div>
                <div className={`${idx === 0 ? 'w-full md:w-1/2 h-80' : 'w-full h-64'} flex items-center justify-center bg-paper/50 rounded-2xl p-8`}>
                  <img 
                    src={phone.images[0]} 
                    alt={phone.model} 
                    className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Banner */}
      <section className="py-24 bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="max-w-xl relative z-10">
              <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
                Not sure which phone fits you best?
              </h2>
              <p className="text-white/70 font-sans text-lg mb-8 font-light">
                Our AI-powered Phone Recommender analyzes your needs, budget, and preferences to suggest the perfect device.
              </p>
              <Link 
                to="/ai-assistant" 
                className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-medium hover:bg-accent/90 transition-all font-mono text-sm uppercase tracking-wider"
              >
                Try AI Assistant
                <Sparkles size={16} />
              </Link>
            </div>
            
            <div className="relative z-10 w-full md:w-1/3 mt-12 md:mt-0">
               <div className="bg-paper p-6 rounded-2xl text-ink transform rotate-3 shadow-2xl">
                 <div className="flex gap-3 mb-4">
                   <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                     <Sparkles size={14} />
                   </div>
                   <div className="bg-white rounded-2xl rounded-tl-none p-3 text-sm shadow-sm">
                     "I need a phone under $900 that takes great night photos."
                   </div>
                 </div>
                 <div className="flex gap-3 flex-row-reverse">
                   <div className="bg-accent/10 text-accent font-medium rounded-2xl rounded-tr-none p-4 text-sm shadow-sm flex items-center gap-4">
                     {phones[2] && <img src={phones[2].images[0]} alt="Pixel" className="w-10 h-10 object-contain mix-blend-multiply" />}
                     <span>I recommend the <strong>Pixel 8 Pro</strong>. It has incredible computational photography...</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sparkles({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
