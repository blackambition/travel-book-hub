
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { generateItinerary } from './services/geminiService';
import { Itinerary, TripInputs, Activity } from './types';

// Define AIStudio interface to match the environment's expected type
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// Add global window types for AI Studio with compatible modifiers
declare global {
  interface Window {
    readonly aistudio: AIStudio;
  }
}

type ViewState = 'home' | 'features' | 'pricing' | 'showcase';

const getAffiliateLink = (provider: string, query: string) => {
  const providers: Record<string, string> = {
    'Expedia': 'https://www.expedia.com/search?destination=',
    'Booking.com': 'https://www.booking.com/searchresults.html?ss=',
    'Viator': 'https://www.viator.com/search/',
    'Resy': 'https://resy.com/search?query='
  };
  return `${providers[provider] || providers['Expedia']}${encodeURIComponent(query)}`;
};

const TOKYO_DEMO_DATA: Itinerary = {
  id: "trip_demo_tokyo_01",
  trip_name: "Tokyo Discovery Trip",
  destination: "Tokyo, Japan",
  tech_travel_tips: [
    "Use your phone's wallet for easy train travel.",
    "Rent a pocket Wi-Fi at the airport for the best data connection.",
    "Google Maps 'Live View' is great for finding your way in big stations.",
    "Book popular museums at least a month in advance."
  ],
  days: [
    {
      day_number: 1,
      date: "Nov 15, 2025",
      summary: "Welcome to Shinjuku",
      activities: [
        {
          time: "02:00 PM",
          activity: "Arrive at Haneda",
          location: "Haneda Airport",
          duration_mins: 45,
          cost_estimate: "Free",
          reservation_flag: false,
          description: "Clear customs and catch the express train into the city.",
          tech_feature: "Free Airport Wi-Fi",
          efficiency_note: "Fastest route to your hotel",
          provider: "Expedia",
          suitability_tags: ["Family-friendly", "Wheelchair-accessible"],
          accessibility_note: "Modern airport with full elevator access and priority lanes."
        }
      ]
    }
  ]
};

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(true);
  const [slotsRemaining, setSlotsRemaining] = useState(10);
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [showLogs, setShowLogs] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlotsRemaining(prev => Math.max(1, prev - (Math.random() > 0.8 ? 1 : 0)));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const trackAffiliateClick = async (provider: string, activity: Activity) => {
    showToast(`Checking prices on ${provider}...`, 'success');
    const link = getAffiliateLink(provider, `${activity.activity} ${activity.location}`);
    setTimeout(() => window.open(link, '_blank'), 500);
  };

  const handleTripSubmit = async (inputs: TripInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check for API key selection as required for high-tier models
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        showToast("Please select your API key to continue", "info");
        await window.aistudio.openSelectKey();
        // Proceeding after openSelectKey as per instructions to avoid race conditions
      }

      const result = await generateItinerary(inputs);
      setItinerary(result);
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("Your trip is ready!", "success");
    } catch (err: any) {
      if (err.message === 'API_KEY_MISSING') {
        showToast("API Key needed. Please select one.", "warning");
        await window.aistudio.openSelectKey();
      } else {
        setError(err.message || "We couldn't create your trip right now.");
        showToast("Error generating itinerary", "warning");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setItinerary(TOKYO_DEMO_DATA);
      setActiveView('home');
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("Loading sample trip", "info");
    }, 800);
  };

  const handleActionFeedback = (action: string) => {
    if (action.includes('Info:')) {
      showToast(action.replace('Info:', '').trim(), 'info');
    } else {
      showToast(`${action} is available in the Premium version`, 'warning');
    }
  };

  const renderContent = () => {
    if (itinerary && activeView === 'home') {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-10">
            <div className="space-y-4">
              <button 
                onClick={() => setItinerary(null)}
                className="text-cyan-400 text-sm font-medium mb-4 hover:text-cyan-300 flex items-center gap-2 group transition-all"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                Back to Search
              </button>
              <div className="flex items-center gap-4">
                <h1 
                  onClick={() => handleActionFeedback(`Info: Viewing your ${itinerary.trip_name}`)}
                  className="text-5xl font-extrabold text-white tracking-tight cursor-pointer hover:text-cyan-400 transition-colors"
                >
                  {itinerary.trip_name}
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">Ready</span>
              </div>
              <div className="text-slate-400 text-sm flex items-center gap-4 font-medium">
                 <span className="text-slate-200">{itinerary.destination}</span>
                 <span className="text-slate-700">|</span>
                 <span className="text-slate-200">{itinerary.days.length} Day Trip</span>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => handleActionFeedback("Customize Plan")}
                className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm border border-white/5 transition-all"
              >
                Change Details
              </button>
              <button 
                onClick={() => handleActionFeedback("Share Trip")}
                className="flex-1 md:flex-none px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-cyan-900/20 transition-all"
              >
                Share This Trip
              </button>
            </div>
          </div>

          <ItineraryDisplay 
            itinerary={itinerary} 
            onAffiliateClick={trackAffiliateClick} 
            onProAction={handleActionFeedback} 
          />

          <div className="pt-20 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-8">Travel Tips for your Trip</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {itinerary.tech_travel_tips.map((tip, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl group hover:bg-slate-800/60 transition-all shadow-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'features':
        return (
          <div className="py-12 animate-in fade-in slide-in-from-top-4 duration-700 space-y-20">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-5xl font-black text-white tracking-tight">How it Works</h2>
              <p className="text-slate-400 text-lg">Smart planning to help you spend more time exploring.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Efficient Routes', desc: 'We group nearby activities together so you spend less time on trains and buses.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { title: 'Best Prices', desc: 'Get real-time booking links from the world\'s top travel providers.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2' },
                { title: 'Mobile Wallet', desc: 'Sync your boarding passes and entry tickets directly to your phone.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              ].map((f, i) => (
                <div key={i} className="p-8 bg-slate-900 border border-white/5 rounded-3xl shadow-2xl">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon}></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button onClick={() => setActiveView('home')} className="px-10 py-4 bg-cyan-600 rounded-2xl font-bold text-white shadow-2xl shadow-cyan-900/40 hover:scale-105 transition-all">Let's Get Started</button>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="py-12 animate-in fade-in slide-in-from-top-4 duration-700 space-y-20">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-5xl font-black text-white tracking-tight">Choose Your Plan</h2>
              <p className="text-slate-400 text-lg">Pick the version that fits your travel style.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-10 bg-slate-900 border border-white/5 rounded-3xl flex flex-col h-full space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Free</h3>
                  <div className="text-4xl font-black text-white">Free <span className="text-slate-500 text-sm font-normal">Forever</span></div>
                </div>
                <ul className="space-y-4 flex-1">
                  {['3 Trips Per Month', 'Basic AI Planning', 'Printable PDF', 'Standard Support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setActiveView('home')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-all">Keep Current Plan</button>
              </div>

              <div className="p-10 bg-slate-950 border-2 border-cyan-500 rounded-3xl flex flex-col h-full space-y-8 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-cyan-500">Premium</h3>
                  <div className="text-4xl font-black text-white">$49 <span className="text-slate-500 text-sm font-normal">One-time payment</span></div>
                </div>
                <ul className="space-y-4 flex-1">
                  {['Unlimited Trips', 'Best-in-class AI Engine', 'Apple & Google Wallet Sync', 'Calendar Integration', 'Ad-Free Experience'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => showToast("Upgrade complete! (Demo)", "success")}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-bold shadow-xl shadow-cyan-900/40"
                >
                  Get Premium
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-8">
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
                  Plan your trip <br/>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">effortlessly.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
                  We use AI to organize your perfect vacation. Just tell us where you're going, and we'll handle the rest.
                </p>
              </div>
              
              <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl max-w-lg shadow-inner">
                <p className="text-slate-300 italic text-lg leading-relaxed">
                  "I saved hours of planning. The AI grouped everything by location so I didn't waste time traveling between activities."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">— Sarah J., Frequent Traveler</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative lg:sticky lg:top-24">
              <TripForm onSubmit={handleTripSubmit} isLoading={isLoading} onDemo={handleDemo} />
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#0b1120] selection:bg-cyan-500/30">
      {toast && (
        <div className="fixed top-20 right-6 z-[100] animate-in fade-in slide-in-from-right-4">
          <div className={`px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 font-medium text-sm ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {showLogs && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowLogs(false)}>
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
            <div className="space-y-2 text-xs font-mono text-slate-400 overflow-y-auto max-h-60">
              <p className="text-emerald-500">✓ AI Engine Online</p>
              <p>• Connected to Gemini-3-Pro</p>
              <p>• Travel Database Loaded</p>
              <p>• Optimization Algorithm Active</p>
            </div>
          </div>
        </div>
      )}

      {showPromo && !itinerary && (
        <div className="bg-cyan-600 text-white text-xs font-bold py-2 px-4 text-center relative z-50">
          Limited Offer: Get 50% OFF the Premium Lifetime Plan. 
          <button 
            onClick={() => setActiveView('pricing')}
            className="ml-4 underline hover:text-cyan-100"
          >
            Claim Now
          </button>
          <button 
            onClick={() => setShowPromo(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}
      
      <Header onNavigate={(v) => { setActiveView(v); setItinerary(null); }} activeView={activeView} />
      
      <main className="max-w-7xl mx-auto px-4 pt-16">
        {renderContent()}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0b1120]/90 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full shadow-2xl flex items-center gap-8 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Ready</span>
        </div>
        <button 
          onClick={() => setShowLogs(true)}
          className="text-[10px] font-bold text-white hover:text-cyan-400 transition-colors uppercase tracking-widest"
        >
          View Status
        </button>
      </div>
    </div>
  );
};

export default App;
