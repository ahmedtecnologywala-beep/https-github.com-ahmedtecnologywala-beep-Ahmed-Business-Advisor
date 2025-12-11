import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Briefcase, MapPin, DollarSign, User, Heart, Send } from 'lucide-react';

interface InputFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    city: '',
    age: '',
    budget: '',
    skills: '',
    interests: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-emerald-600 p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Build Your Future in Pakistan</h2>
        <p className="text-emerald-100">Tell us about yourself, and our AI will design your perfect business roadmap.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <User className="w-4 h-4 mr-2 text-emerald-600" /> Full Name
            </label>
            <input
              required
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="e.g. Ali Khan"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <User className="w-4 h-4 mr-2 text-emerald-600" /> Age (Optional)
            </label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="e.g. 25"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" /> City of Residence
            </label>
            <input
              required
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              placeholder="e.g. Lahore, Karachi, Multan"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <DollarSign className="w-4 h-4 mr-2 text-emerald-600" /> Budget (PKR)
            </label>
            <input
              required
              type="text" 
              name="budget"
              value={profile.budget}
              onChange={handleChange}
              placeholder="e.g. 50,000 or 5 Lakh"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-700">
            <Briefcase className="w-4 h-4 mr-2 text-emerald-600" /> Skills & Experience
          </label>
          <textarea
            required
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g. Student, Graphic Designer, Good at cooking, Engineer, Housewife..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition h-24 resize-none"
          />
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-700">
            <Heart className="w-4 h-4 mr-2 text-emerald-600" /> Interests & Preferred Business Type
          </label>
          <textarea
            required
            name="interests"
            value={profile.interests}
            onChange={handleChange}
            placeholder="e.g. Food business, Clothing, Tech startup, Online store, Agriculture..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transform transition hover:-translate-y-0.5 ${
            isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Opportunities...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Generate My Business Plan <Send className="ml-2 w-5 h-5" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};