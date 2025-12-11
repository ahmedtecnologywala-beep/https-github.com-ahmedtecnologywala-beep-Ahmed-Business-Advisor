import React, { useState, useEffect } from 'react';
import { UserProfile, AdvisorResponse, AppState, ViewState, SavedProject } from './types';
import { generateBusinessPlan } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AiAssistant } from './components/AiAssistant';
import { HomePage } from './components/HomePage';
import { SavedProjects } from './components/SavedProjects';
import { OpeningAnimation } from './components/OpeningAnimation';
import { Briefcase, Home, FolderOpen, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('HOME');
  const [results, setResults] = useState<AdvisorResponse | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isCurrentProjectSaved, setIsCurrentProjectSaved] = useState(false);

  // Load saved projects on mount
  useEffect(() => {
    const saved = localStorage.getItem('ahmed_advisor_saved');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved projects", e);
      }
    }
  }, []);

  const handleFormSubmit = async (profile: UserProfile) => {
    setUserProfile(profile);
    setViewState('LOADING');
    setError(null);
    setIsCurrentProjectSaved(false);
    try {
      const data = await generateBusinessPlan(profile);
      setResults(data);
      setViewState('RESULTS');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your API key or try again.");
      setViewState('INPUT'); // Go back to input on error, but maybe show an error toast/message in input
      // For simplicity in this structure, we'll just show the error in the Input page or a separate Error view.
      // Let's stick to a simple error handling for now.
      alert(`Error: ${err.message || "Failed to generate plan."}`);
    }
  };

  const handleSaveProject = () => {
    if (!results || !userProfile) return;

    const newProject: SavedProject = {
      ...results,
      id: Date.now().toString(),
      createdAt: Date.now(),
      userName: userProfile.fullName,
      userCity: userProfile.city,
      userBudget: userProfile.budget
    };

    const updatedProjects = [newProject, ...savedProjects];
    setSavedProjects(updatedProjects);
    localStorage.setItem('ahmed_advisor_saved', JSON.stringify(updatedProjects));
    setIsCurrentProjectSaved(true);
  };

  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('ahmed_advisor_saved', JSON.stringify(updated));
  };

  const handleViewSavedProject = (project: SavedProject) => {
    setResults(project);
    setUserProfile({
        fullName: project.userName,
        city: project.userCity,
        budget: project.userBudget || 'N/A',
        age: '',
        skills: '',
        interests: ''
    }); // Mock profile restoration
    setIsCurrentProjectSaved(true);
    setViewState('RESULTS');
  };

  const startNew = () => {
    setViewState('INPUT');
    setResults(null);
    setUserProfile(null);
    setIsCurrentProjectSaved(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <OpeningAnimation />

      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setViewState('HOME')}>
            <div className="bg-emerald-600 p-2 rounded-lg transition-all group-hover:bg-emerald-700">
                <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden md:inline">Ahmed <span className="text-emerald-600">Business Advisor</span></span>
            <span className="text-xl font-bold text-emerald-600 tracking-tight md:hidden">Ahmed <span className="text-slate-900">Advisor</span></span>
          </div>
          
          <nav className="flex space-x-1 md:space-x-4">
             <button 
               onClick={() => setViewState('HOME')}
               className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${viewState === 'HOME' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               <Home className="w-4 h-4 md:mr-2" />
               <span className="hidden md:inline">Home</span>
             </button>
             <button 
               onClick={startNew}
               className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${viewState === 'INPUT' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               <PlusCircle className="w-4 h-4 md:mr-2" />
               <span className="hidden md:inline">New Plan</span>
             </button>
             <button 
               onClick={() => setViewState('SAVED')}
               className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${viewState === 'SAVED' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               <FolderOpen className="w-4 h-4 md:mr-2" />
               <span className="hidden md:inline">Saved</span>
               {savedProjects.length > 0 && (
                   <span className="ml-2 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{savedProjects.length}</span>
               )}
             </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {viewState === 'HOME' && (
           <HomePage onStart={startNew} />
        )}

        {viewState === 'INPUT' && (
          <div className="animate-fade-in-up">
            <InputForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {viewState === 'LOADING' && (
          <LoadingOverlay />
        )}

        {viewState === 'SAVED' && (
            <SavedProjects 
                projects={savedProjects} 
                onView={handleViewSavedProject} 
                onDelete={handleDeleteProject}
                onCreateNew={startNew}
            />
        )}

        {viewState === 'RESULTS' && results && userProfile && (
          <ResultsDashboard 
            data={results} 
            userName={userProfile.fullName} 
            onReset={startNew}
            onSave={handleSaveProject}
            isSaved={isCurrentProjectSaved}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Ahmed Pakistan Business Advisor.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Disclaimer: AI-generated advice. Please consult with financial and legal experts before making significant investments.
          </p>
        </div>
      </footer>

      {/* AI Assistant Chat Widget */}
      <AiAssistant contextData={results} />
    </div>
  );
};

export default App;