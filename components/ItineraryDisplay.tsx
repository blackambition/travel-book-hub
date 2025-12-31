
import React, { useState } from 'react';
import { Itinerary, Activity } from '../types';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onAffiliateClick: (provider: string, activity: Activity) => void;
  onProAction: (action: string) => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onAffiliateClick, onProAction }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Day Selector */}
      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Trip Timeline</h2>
        <div className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {itinerary.days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 lg:w-full text-left p-5 rounded-[2rem] border-2 transition-all ${
                selectedDay === idx
                  ? 'bg-slate-800 border-cyan-500 text-white shadow-2xl shadow-cyan-900/20'
                  : 'bg-slate-900/50 border-slate-800/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-black opacity-40 mb-1 uppercase tracking-widest">Day {day.day_number}</div>
              <div className="font-bold truncate">{day.summary}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Details */}
      <div className="lg:col-span-9">
        <div className="bg-slate-900/80 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="bg-slate-800/30 border-b border-white/5 p-8 lg:p-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none">{itinerary.days[selectedDay].summary}</h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{itinerary.days[selectedDay].date}</p>
              <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-4 py-1.5 rounded-full inline-block border border-emerald-500/20">
                {itinerary.inclusivity_summary}
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-10 space-y-12">
            {itinerary.days[selectedDay].activities.map((activity, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-8 relative">
                {idx !== itinerary.days[selectedDay].activities.length - 1 && (
                  <div className="hidden md:block absolute left-[2.4rem] top-12 bottom-[-3rem] w-px bg-slate-800"></div>
                )}
                
                <div className="md:w-20 flex-shrink-0">
                  <div className="text-xl font-black text-cyan-400 tracking-tighter">{activity.time}</div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-white leading-tight">{activity.activity}</h4>
                      <div className="flex flex-wrap gap-2">
                        {activity.suitability_tags.map(tag => (
                          <span key={tag} className="bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-400 text-base leading-relaxed font-medium max-w-2xl">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                      <span className="text-sm font-black text-white bg-slate-800 px-4 py-1.5 rounded-xl border border-white/5">{activity.cost_estimate}</span>
                      <button 
                        onClick={() => onAffiliateClick(activity.provider || 'Local', activity)}
                        className="w-full sm:w-auto px-6 py-2 bg-white text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-colors uppercase tracking-widest"
                      >
                        Options
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activity.accessibility_note && (
                      <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Accessibility Note</p>
                          <p className="text-slate-300 text-xs font-bold leading-snug">{activity.accessibility_note}</p>
                        </div>
                      </div>
                    )}
                    {activity.tech_feature && (
                      <div className="flex items-start gap-3 bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10">
                        <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <div>
                          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Traveler Pro-Tip</p>
                          <p className="text-slate-300 text-xs font-bold leading-snug">{activity.tech_feature}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
