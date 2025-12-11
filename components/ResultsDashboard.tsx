import React from 'react';
import { AdvisorResponse, BusinessIdea } from '../types';
import { CheckCircle, TrendingUp, AlertTriangle, DollarSign, Users, Calendar, Target, ShieldCheck, Lightbulb, ArrowRight, BarChart, MapPin, Image as ImageIcon, Save } from 'lucide-react';

interface ResultsDashboardProps {
  data: AdvisorResponse;
  userName: string;
  onReset: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const IdeaCard: React.FC<{ idea: BusinessIdea; isBest?: boolean }> = ({ idea, isBest }) => (
  <div className={`relative p-6 rounded-2xl border transition-all hover:shadow-lg ${isBest ? 'bg-emerald-50 border-emerald-500 shadow-md' : 'bg-white border-slate-200'}`}>
    {isBest && (
      <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
        Recommended
      </span>
    )}
    <h3 className="text-xl font-bold text-slate-900 mb-2">{idea.title}</h3>
    <p className="text-slate-600 mb-4 text-sm">{idea.description}</p>
    
    <div className="space-y-2 text-sm">
      <div className="flex justify-between items-center py-1 border-b border-slate-100">
        <span className="text-slate-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Profit Est.</span>
        <span className="font-semibold text-emerald-700">{idea.profitEstimate}</span>
      </div>
      <div className="flex justify-between items-center py-1 border-b border-slate-100">
        <span className="text-slate-500 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Risk Level</span>
        <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
          idea.riskLevel === 'Low' ? 'bg-green-100 text-green-700' : 
          idea.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>{idea.riskLevel}</span>
      </div>
      <div className="flex justify-between items-center py-1">
        <span className="text-slate-500 flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Monthly Exp.</span>
        <span className="font-semibold text-slate-700">{idea.monthlyExpenses}</span>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 italic">Why: {idea.suitability}</p>
    </div>
  </div>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, userName, onReset, onSave, isSaved }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Success Roadmap for <span className="text-emerald-600">{userName}</span>
            </h1>
            <p className="text-slate-600">
            Professional AI analysis based on local Pakistani market trends.
            </p>
        </div>
        <div className="flex space-x-3">
             {onSave && (
                <button 
                    onClick={onSave}
                    disabled={isSaved}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition ${isSaved ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'}`}
                >
                    <Save className={`w-5 h-5 mr-2 ${isSaved ? 'text-slate-400' : 'text-emerald-600'}`} />
                    {isSaved ? 'Saved' : 'Save Project'}
                </button>
            )}
            <button 
                onClick={onReset}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
                New Analysis
            </button>
        </div>
      </div>

      {/* The Master Plan (Best Idea) */}
      <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-1">Recommended Business Model</div>
              <h2 className="text-3xl font-bold">{data.bestIdeaPlan.ideaTitle}</h2>
            </div>
            <div className="flex items-center space-x-4 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span className="font-mono">{data.bestIdeaPlan.timeline}</span>
            </div>
          </div>
        </div>

        {/* Generated Image & Location Section */}
        {data.bestIdeaPlan.generatedImageUrl && (
          <div className="w-full h-64 md:h-96 bg-slate-100 relative overflow-hidden group">
            <img 
              src={data.bestIdeaPlan.generatedImageUrl} 
              alt={data.bestIdeaPlan.ideaTitle} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex items-end">
               <div className="text-white w-full">
                  <div className="flex justify-between items-end">
                    <span className="flex items-center text-sm font-semibold text-emerald-300 mb-1">
                        <ImageIcon className="w-4 h-4 mr-2" /> AI Visual Concept
                    </span>
                  </div>
               </div>
            </div>
          </div>
        )}
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Investment Breakdown */}
            <div className="space-y-6">
                
                {/* Location Recommendation */}
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-start">
                    <MapPin className="w-6 h-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-wide mb-1">Recommended Location Strategy</h4>
                        <p className="text-emerald-800 font-medium leading-relaxed">{data.bestIdeaPlan.locationRecommendation}</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 flex items-center border-b pb-2">
                    <DollarSign className="w-5 h-5 mr-2 text-emerald-600" /> Investment Breakdown
                </h3>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <ul className="space-y-3">
                        {data.bestIdeaPlan.investmentBreakdown.map((item, i) => (
                            <li key={i} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">{item.item}</span>
                                <span className="font-bold text-slate-900">{item.cost}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 flex items-center border-b pb-2 pt-4">
                    <Users className="w-5 h-5 mr-2 text-emerald-600" /> Staffing & Resources
                </h3>
                 <p className="text-slate-600">{data.bestIdeaPlan.staffing}</p>
                 <div className="flex flex-wrap gap-2 mt-2">
                    {data.bestIdeaPlan.materials.map((mat, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded border border-slate-200">{mat}</span>
                    ))}
                 </div>
            </div>

            {/* Marketing & Strategy */}
            <div className="space-y-6">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center border-b pb-2">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" /> Marketing Strategy
                </h3>
                <ul className="space-y-4">
                    {data.bestIdeaPlan.marketingStrategy.map((strat, i) => (
                        <li key={i} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{strat}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
      </section>

      {/* Top Ideas Grid */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-emerald-600" /> Other High-Potential Ideas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.businessIdeas.map((idea, idx) => (
            <IdeaCard key={idx} idea={idea} isBest={idea.title === data.bestIdeaPlan.ideaTitle} />
          ))}
        </div>
      </section>

      {/* Market & Legal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Market Analysis */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-emerald-600" /> Local Market Analysis
            </h3>
            <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Demand</h4>
                    <p className="text-blue-800 text-sm">{data.marketAnalysis.demand}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-semibold text-orange-900 text-sm mb-1">Competition</h4>
                    <p className="text-orange-800 text-sm">{data.marketAnalysis.competition}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">How to Win:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                        {data.marketAnalysis.tipsToStandOut.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* Legal Requirements */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" /> Legal Requirements (PK)
            </h3>
            <div className="space-y-4 text-sm">
                <div>
                    <span className="font-semibold text-slate-700 block mb-1">Required Licenses:</span>
                    <div className="flex flex-wrap gap-2">
                         {data.legalRequirements.licenses.map((lic, i) => (
                            <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">{lic}</span>
                        ))}
                    </div>
                </div>
                <div>
                     <span className="font-semibold text-slate-700 block mb-1">Registration:</span>
                     <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{data.legalRequirements.registration}</p>
                </div>
                <div>
                     <span className="font-semibold text-slate-700 block mb-1">Home vs Shop Guidance:</span>
                     <p className="text-slate-600">{data.legalRequirements.guidance}</p>
                </div>
            </div>
        </section>
      </div>

      {/* Smart Tips & Action Plan */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
             <Lightbulb className="w-6 h-6 mr-2 text-yellow-300" /> Smart Tips & 30-Day Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="font-bold text-emerald-100 mb-2 uppercase tracking-wide text-sm">Branding Ideas</h3>
                <div className="mb-4">
                    <p className="text-sm opacity-80 mb-1">Name Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                        {data.smartTips.businessNames.map((name, i) => (
                            <span key={i} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg font-medium">{name}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-sm opacity-80 mb-1">Logo Concepts:</p>
                     <ul className="list-disc list-inside text-sm space-y-1 text-emerald-50">
                        {data.smartTips.logoIdeas.map((logo, i) => <li key={i}>{logo}</li>)}
                    </ul>
                </div>
                <div className="mt-4">
                    <p className="text-sm opacity-80 mb-1">Social Media Strategy:</p>
                    <p className="text-sm bg-white/10 p-3 rounded-lg">{data.smartTips.socialMedia}</p>
                </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" /> 30-Day Action Plan
                </h3>
                <ul className="space-y-3">
                    {data.smartTips.actionPlan.map((step, i) => (
                        <li key={i} className="flex text-sm">
                            <span className="bg-yellow-400 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0">
                                {i + 1}
                            </span>
                            <span className="text-emerald-50">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* Motivational Note */}
      <div className="text-center bg-yellow-50 p-8 rounded-2xl border border-yellow-200">
         <p className="text-xl font-medium text-slate-800 italic">"{data.motivationalNote}"</p>
         <button 
            onClick={onReset}
            className="mt-6 text-emerald-700 font-semibold hover:text-emerald-800 flex items-center justify-center mx-auto"
         >
             Start Over <ArrowRight className="w-4 h-4 ml-1" />
         </button>
      </div>

    </div>
  );
};