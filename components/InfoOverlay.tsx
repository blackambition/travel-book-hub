
import React from 'react';
import { ViewType } from '../App';

interface InfoOverlayProps {
  type: ViewType;
  onClose: () => void;
}

const CONTENT = {
  nodes: {
    title: "Global Biological Nodes",
    subtitle: "Strategic hubs where medicine meets geography",
    items: [
      { name: "Alicante, Spain", tag: "Regeneration", desc: "The quiet center of Mediterranean longevity, home to pioneering macrobiotic and clinical integration at SHA." },
      { name: "Zurich, Switzerland", tag: "Diagnostics", desc: "The world's high-tech diagnostic core. Where 7-Tesla MRI and full-genome sequencing are the standard." },
      { name: "Miami, USA", tag: "Performance", desc: "The western nexus for biohacking, cold-plunge culture, and regenerative sports medicine." },
      { name: "Bangkok, Thailand", tag: "Cellular Repair", desc: "A global leader in high-grade stem cell therapy and systemic peptide protocols at competitive tiers." },
      { name: "Lans, Austria", tag: "Metabolic Reset", desc: "The historical foundation of gut-health medicine and intestinal detoxification." }
    ]
  },
  protocols: {
    title: "Precision Protocols",
    subtitle: "Clinical-grade interventions for biological optimization",
    items: [
      { name: "NAD+ Infusions", tag: "Energy", desc: "Cellular fuel replenishment to boost brain function, repair DNA, and clear brain fog instantly." },
      { name: "HBOT (Hyperbaric)", tag: "Stem Cells", desc: "Pressurized oxygen sessions that trigger a 400% increase in circulating stem cells." },
      { name: "Exosome Therapy", tag: "Signaling", desc: "Next-gen cellular signaling that instructs damaged tissue to repair itself at the source." },
      { name: "Epigenetic Screening", tag: "Knowledge", desc: "Testing your biological age vs. your chronological age to find your true health baseline." },
      { name: "Cryo-Sequencing", tag: "Inflammation", desc: "Controlled systemic cold shock to kill inflammation and activate brown adipose fat." }
    ]
  },
  network: {
    title: "Clinical Network",
    subtitle: "Verified facilities under AuraNodes strict supervision",
    items: [
      { name: "SHA Wellness", tag: "The Pioneer", desc: "Consistently ranked as the world's best medical wellness resort for long-term health." },
      { name: "Lanserhof", tag: "The Standard", desc: "German precision applied to medicine, focusing on intestinal health as the core of life." },
      { name: "Clinique La Prairie", tag: "Swiss Luxury", desc: "Ultra-exclusive rejuvenation sequences that have been the choice of world leaders for decades." },
      { name: "Mayo Clinic Executive", tag: "The Benchmark", desc: "The gold standard for full-body screening and preventative medical strategy." },
      { name: "Human Longevity Inc", tag: "The Future", desc: "Data-driven health intelligence using high-resolution imaging and genomics." }
    ]
  }
};

const InfoOverlay: React.FC<InfoOverlayProps> = ({ type, onClose }) => {
  if (type === 'home') return null;
  const content = CONTENT[type as keyof typeof CONTENT];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-[#0f172a] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-500">
        
        {/* Header Section */}
        <div className="p-10 md:p-14 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
          <div>
            <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">AuraNodes Intelligence Matrix</div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">{content.title}</h2>
            <p className="text-slate-400 font-bold mt-4 uppercase text-xs tracking-[0.2em]">{content.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="group w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-90"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1 bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.items.map((item, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-[2.5rem] bg-[#1e293b]/20 border border-white/5 hover:border-cyan-500/40 transition-all hover:bg-[#1e293b]/40 cursor-default"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-cyan-500/20">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors mb-3">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8 items-center">
               <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Session: Secured</div>
               <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Latency: 14ms</div>
            </div>
            <button 
              onClick={onClose}
              className="px-12 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 transition-all shadow-xl active:scale-95"
            >
              Close Database
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default InfoOverlay;
