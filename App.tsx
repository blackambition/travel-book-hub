
import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import InfoOverlay from './components/InfoOverlay';
import { generateItinerary } from './services/geminiService';
import { Itinerary, ProtocolInputs } from './types';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Added readonly to match the global declaration provided by the environment.
    readonly aistudio: AIStudio;
  }
}

export type ViewType = 'home' | 'nodes' | 'protocols' | 'network';

const SHA_DEMO: Itinerary = {
  id: "demo_sha",
  itinerary_name: "The Alicante Sequence",
  destination: "Alicante, Spain",
  biological_goal: "Cellular Regeneration",
  cellular_optimization_score: 94,
  days: [
    {
      day_number: 1,
      date: "Nov 14, 2025",
      focus: "Baseline Calibration & Neuro-Priming",
      total_recovery_score: 88,
      activities: [
        {
          time: "09:00 AM",
          type: "Protocol",
          activity: "Advanced Diagnostics",
          location: "SHA Wellness Clinic",
          description: "Cognitive performance testing and baseline biological age assessment using epigenetic markers.",
          biological_impact: "Biological Age Indexing",
          biological_load: 4,
          duration_mins: 120,
          clinical_grade: true,
          cost_estimate: "Included in Gold Suite",
          suitability_tags: ["Medical", "Non-Invasive"],
          verification_url: "https://shawellness.com/"
        },
        {
          time: "11:30 AM",
          type: "Recovery",
          activity: "Hyperbaric Oxygen Session",
          location: "Wellness Floor B",
          description: "1.5 ATA oxygen saturation to stimulate mitochondrial repair and stem cell mobilization.",
          biological_impact: "Cellular Hypoxia Mitigation",
          biological_load: -3,
          duration_mins: 60,
          clinical_grade: true,
          cost_estimate: "Included",
          suitability_tags: ["Restorative", "Stem Cell"]
        }
      ]
    }
  ],
  longevity_hacks: ["Hyper-hydrate with structured water.", "Sleep sequence starts 2 hours post-sunset.", "Limit blue-light exposure to 0% after 8 PM."]
};

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSequence = async (inputs: ProtocolInputs) => {
    setIsLoading(true);
    try {
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      const result = await generateItinerary(inputs);
      setItinerary(result);
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes("Requested entity was not found")) {
        await window.aistudio.openSelectKey();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-cyan-500/40">
      {/* Ultra-High-End Navigation */}
      <header className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'h-20 bg-black/80 backdrop-blur-2xl border-b border-white/10' : 'h-32 bg-transparent'}`}>
        <div className="max-w-[1600px] mx-auto h-full px-12 flex items-center justify-between">
          <button 
            onClick={() => { setItinerary(null); setActiveView('home'); }}
            className="flex items-center gap-6 group"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-cyan-500 rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] group-hover:rotate-90 transition-all duration-700">
                <div className="w-4 h-4 bg-black -rotate-45"></div>
              </div>
              <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">AuraNodes<span className="text-cyan-500">.</span></h1>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Sovereign Biological Travel</span>
            </div>
          </button>
          
          <nav className="hidden lg:flex gap-16">
            {['nodes', 'protocols', 'network'].map((view) => (
              <button 
                key={view}
                onClick={() => setActiveView(view as any)}
                className="relative text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-colors group"
              >
                {view}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-cyan-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Interface Status</span>
              <span className="text-[10px] font-mono text-slate-400">ENCRYPTION: AES-256 ACTIVE</span>
            </div>
            <button className="relative px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-500 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-95 group overflow-hidden">
              <span className="relative z-10">Access Concierge</span>
              <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </header>

      {activeView !== 'home' && <InfoOverlay type={activeView} onClose={() => setActiveView('home')} />}

      <main className="relative z-10">
        {!itinerary ? (
          <section className="pt-56 pb-32 px-12 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
              
              {/* Left Column: The Vision & Strategy */}
              <div className="lg:col-span-7 space-y-20">
                <div className="space-y-10 animate-in slide-in-from-left-20 duration-1000">
                  <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Molecular Deployment v5.0</span>
                  </div>
                  
                  <h2 className="text-[clamp(4rem,10vw,8.5rem)] font-black text-white tracking-tighter leading-[0.78] uppercase">
                    Build Your <br/>
                    <span className="text-cyan-500 text-glow">Longest Life.</span>
                  </h2>
                  
                  <p className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                    AuraNodes is the world's first <span className="text-white">Biological Travel Strategist</span>. We architect high-performance itineraries around the planet's most advanced clinical hubs.
                  </p>
                </div>

                {/* The Intelligence Matrix (Service Breakdown) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/10">
                  <div className="space-y-6 group">
                    <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 text-xl font-black group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">01</div>
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">Node Scouting</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">AI-driven identification of clinics with high-density longevity technology.</p>
                  </div>
                  <div className="space-y-6 group">
                    <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 text-xl font-black group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">02</div>
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">Molecular Protocol</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Precision sequences including NAD+, Stem Cells, and Exosome therapy.</p>
                  </div>
                  <div className="space-y-6 group">
                    <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 text-xl font-black group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">03</div>
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">Sovereign Logistics</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Hyper-personalized travel management focused on cellular repair.</p>
                  </div>
                </div>

                {/* Vision Statement (Cinematic) */}
                <div className="relative p-16 rounded-[4rem] overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent border border-white/10 group-hover:from-cyan-500/20 transition-all duration-1000"></div>
                  <div className="relative z-10 space-y-8">
                    <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">The Sovereign Mandate</div>
                    <blockquote className="text-4xl font-black text-white tracking-tight leading-tight uppercase">
                      "Traditional travel focuses on the destination. <span className="text-cyan-500">Sovereign travel</span> focuses on the biological upgrade of the traveler."
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Interactive Terminal (Form) */}
              <div className="lg:col-span-5 lg:sticky lg:top-44 animate-in slide-in-from-right-20 duration-1000">
                <TripForm onSubmit={handleSequence} isLoading={isLoading} onDemo={() => handleSequence({
                  destination: "Alicante, Spain",
                  startDate: "2025-11-14",
                  endDate: "2025-11-21",
                  biologicalGoal: "Cellular Regeneration",
                  medicalProtocol: "SHA Signature Sequence",
                  luxuryTier: "Sovereign",
                  specificNeeds: ["Epigenetic focus"]
                })} />
                
                <div className="mt-12 flex justify-center gap-16">
                  <div className="text-center">
                    <div className="text-4xl font-black text-white font-mono tracking-tighter">140+</div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">Verified Hubs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-white font-mono tracking-tighter">99.9%</div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">Data Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="pt-44 pb-32 px-12 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
             <div className="flex flex-col lg:flex-row justify-between items-end border-b border-white/10 pb-16 mb-20 gap-10">
                <div className="space-y-6">
                  <button onClick={() => setItinerary(null)} className="flex items-center gap-4 text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] hover:opacity-70 transition-all group">
                    <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span> TERMINATE SEQUENCE
                  </button>
                  <h1 className="text-8xl md:text-[10rem] font-black text-white tracking-tighter uppercase leading-[0.75]">{itinerary.itinerary_name}</h1>
                  <div className="flex flex-wrap gap-10 pt-4">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Node</div>
                      <div className="text-white font-black text-sm uppercase">{itinerary.destination}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Biological Intent</div>
                      <div className="text-cyan-500 font-black text-sm uppercase">{itinerary.biological_goal}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System ID</div>
                      <div className="text-slate-400 font-mono text-xs uppercase">#{itinerary.id}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="px-12 py-6 bg-slate-900 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:border-cyan-500/50 transition-all">Secure Full Dataset</button>
                </div>
             </div>
             <ItineraryDisplay itinerary={itinerary} onProAction={() => {}} />
          </section>
        )}
      </main>

      {/* Global Security Footer */}
      <footer className="h-16 bg-black/90 backdrop-blur-3xl border-t border-white/5 flex items-center justify-between px-12 fixed bottom-0 w-full z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Link Secure</span>
          </div>
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] hidden sm:block">Deployment Engine v5.0.12 - Clinical Standard Verified</span>
        </div>
        <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">© 2025 AuraNodes Sovereignty Systems</div>
      </footer>
    </div>
  );
};

export default App;
