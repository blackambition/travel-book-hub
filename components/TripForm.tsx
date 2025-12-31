
import React, { useState } from 'react';
import { TripInputs } from '../types';

interface TripFormProps {
  onSubmit: (inputs: TripInputs) => void;
  isLoading: boolean;
  onDemo?: () => void; // Added to resolve the prop being passed from App.tsx.
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, onDemo }) => {
  const [inputs, setInputs] = useState<TripInputs>({
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    interests: [],
    travelStyle: 'Balanced',
    budget: 'Moderate',
    travelerType: 'Solo',
    pace: 'Balanced',
    hotelLocation: ''
  });

  const [currentInterest, setCurrentInterest] = useState('');

  const handleAddInterest = () => {
    if (currentInterest && !inputs.interests.includes(currentInterest)) {
      setInputs({ ...inputs, interests: [...inputs.interests, currentInterest] });
      setCurrentInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInputs({ ...inputs, interests: inputs.interests.filter(i => i !== interest) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.destination) return alert("Where would you like to go?");
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/80 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-black text-white">Your Trip Details</h2>
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">Inclusive AI</span>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Destination</label>
          <input
            type="text"
            placeholder="e.g. Rome, Bali, Tokyo"
            aria-label="Travel Destination"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white font-bold transition-all placeholder:text-slate-700"
            value={inputs.destination}
            onChange={(e) => setInputs({ ...inputs, destination: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Who is going?</label>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white font-bold"
              value={inputs.travelerType}
              onChange={(e) => setInputs({ ...inputs, travelerType: e.target.value })}
            >
              <option>Solo Traveler</option>
              <option>Couple</option>
              <option>Family with Kids</option>
              <option>Seniors (65+)</option>
              <option>Mobility Assisted</option>
              <option>Group of Friends</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Desired Pace</label>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white font-bold"
              value={inputs.pace}
              onChange={(e) => setInputs({ ...inputs, pace: e.target.value })}
            >
              <option>Leisurely (Relaxed)</option>
              <option>Balanced</option>
              <option>Active (Busy)</option>
              <option>Intense (Full Days)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Budget</label>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white font-bold"
              value={inputs.budget}
              onChange={(e) => setInputs({ ...inputs, budget: e.target.value })}
            >
              <option>Shoestring (Free/Cheap)</option>
              <option>Budget (Mindful)</option>
              <option>Moderate (Comfort)</option>
              <option>Luxury (Premium)</option>
              <option>Ultra-Luxe (Exclusive)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Travel Style</label>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white font-bold"
              value={inputs.travelStyle}
              onChange={(e) => setInputs({ ...inputs, travelStyle: e.target.value })}
            >
              <option>Backpacker</option>
              <option>Cultural/History</option>
              <option>Foodie</option>
              <option>Nature & Outdoor</option>
              <option>Photography</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Interests & Needs</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Ramen, Accessibility, Low Sensory"
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white font-bold"
              value={currentInterest}
              onChange={(e) => setCurrentInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-2xl font-black transition-all"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {inputs.interests.map((interest) => (
              <span key={interest} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                {interest}
                <button type="button" onClick={() => handleRemoveInterest(interest)} className="hover:text-white transition-colors">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-cyan-950/50 active:scale-95"
        >
          {isLoading ? "Tailoring your trip..." : "Create My Plan"}
        </button>
        
        {onDemo && (
          <button
            type="button"
            onClick={onDemo}
            className="w-full text-slate-500 hover:text-cyan-400 text-[11px] font-black uppercase tracking-[0.2em] py-2 transition-colors"
          >
            Just show me a demo
          </button>
        )}
      </div>
    </form>
  );
};

export default TripForm;
