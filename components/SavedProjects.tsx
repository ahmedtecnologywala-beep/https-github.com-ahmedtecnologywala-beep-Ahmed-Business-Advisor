import React from 'react';
import { SavedProject } from '../types';
import { Calendar, MapPin, DollarSign, Trash2, ArrowRight, FolderOpen } from 'lucide-react';

interface SavedProjectsProps {
  projects: SavedProject[];
  onView: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const SavedProjects: React.FC<SavedProjectsProps> = ({ projects, onView, onDelete, onCreateNew }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FolderOpen className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Saved Projects</h2>
        <p className="text-slate-500 mb-8">You haven't saved any business plans yet.</p>
        <button 
          onClick={onCreateNew}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Create Your First Plan
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Your Saved Projects</h2>
        <button 
          onClick={onCreateNew}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="relative h-40 bg-slate-100">
               {project.bestIdeaPlan.generatedImageUrl ? (
                   <img src={project.bestIdeaPlan.generatedImageUrl} alt={project.bestIdeaPlan.ideaTitle} className="w-full h-full object-cover" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                       <BriefcaseIcon className="w-10 h-10" />
                   </div>
               )}
               <div className="absolute top-3 right-3">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                    className="p-2 bg-white/90 rounded-full text-red-500 hover:text-red-700 hover:bg-white transition"
                    title="Delete Project"
                   >
                       <Trash2 className="w-4 h-4" />
                   </button>
               </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{project.bestIdeaPlan.ideaTitle}</h3>
              <p className="text-sm text-slate-500 mb-4">For {project.userName}</p>
              
              <div className="space-y-2 text-sm mb-6">
                 <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                    <span className="truncate">{project.userCity}</span>
                 </div>
                 <div className="flex items-center text-slate-600">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>{project.userBudget} (Budget)</span>
                 </div>
                 <div className="flex items-center text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>

              <button 
                onClick={() => onView(project)}
                className="w-full py-2.5 rounded-lg border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 transition flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white"
              >
                View Full Plan <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BriefcaseIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
