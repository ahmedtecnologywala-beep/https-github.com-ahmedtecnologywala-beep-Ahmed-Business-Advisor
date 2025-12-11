import React from 'react';
import { ArrowRight, Briefcase, TrendingUp, ShieldCheck, MapPin } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative bg-slate-900 rounded-3xl overflow-hidden mb-12 text-center md:text-left">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 max-w-4xl mx-auto md:mx-0 md:pl-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Launch Your Dream <br />
            <span className="text-emerald-400">Business in Pakistan</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl">
            AI-powered consulting tailored to your city, budget, and market trends. 
            Get a professional roadmap, financial breakdown, and location strategy in seconds.
          </p>
          <button 
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center md:inline-flex"
          >
            Start Your Business Plan <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">Professional Ideas</h3>
          <p className="text-sm text-slate-600">Curated high-potential business models suited to the Pakistani market economy.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Location</h3>
          <p className="text-sm text-slate-600">We analyze your city to recommend the specific markets or areas for maximum footfall.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 text-yellow-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">Financial Forecast</h3>
          <p className="text-sm text-slate-600">Detailed investment breakdown and realistic monthly profit estimates in PKR.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">Legal Roadmap</h3>
          <p className="text-sm text-slate-600">Guidance on SECP registration, NTN, and licenses required for your business type.</p>
        </div>
      </section>
    </div>
  );
};