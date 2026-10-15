import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  FileText,
  Clock,
  Briefcase,
  BookOpen,
  Shield,
  LifeBuoy,
  Lock,
} from 'lucide-react';
import { UserRole, IncidentDetails } from './types';
import { Header } from './components/Header';
import { ChatTab } from './components/ChatTab';
import { ScreenerTab } from './components/ScreenerTab';
import { ComplaintDrafterTab } from './components/ComplaintDrafterTab';
import { TimelineTab } from './components/TimelineTab';
import { CommitteeToolkitTab } from './components/CommitteeToolkitTab';
import { LegalFaqTab } from './components/LegalFaqTab';
import { HelplineModal } from './components/HelplineModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('complainant');
  const [activeTab, setActiveTab] = useState<'chat' | 'screener' | 'drafter' | 'timeline' | 'toolkit' | 'faqs'>('chat');
  const [discretionMode, setDiscretionMode] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [prefilledDraftData, setPrefilledDraftData] = useState<Partial<IncidentDetails>>({});

  // Global Esc key listener for Quick Exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.replace('https://www.google.com');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTransferToDraft = (data: {
    incidentTypes: string[];
    respondentDesignation: string;
    narrative: string;
    locations: string;
  }) => {
    setPrefilledDraftData({
      incidentTypes: data.incidentTypes,
      respondentDesignation: data.respondentDesignation,
      detailedNarrative: data.narrative,
      incidentLocations: data.locations,
    });
    setActiveTab('drafter');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${discretionMode ? 'bg-slate-100 text-slate-800' : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'}`}>
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        discretionMode={discretionMode}
        onToggleDiscretion={() => setDiscretionMode(!discretionMode)}
        onOpenHelpline={() => setIsHelplineOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-5">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-1 gap-1.5 p-1.5 bg-slate-200/80 dark:bg-slate-900/80 rounded-2xl border border-slate-300 dark:border-slate-800 shrink-0">
          
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('screener')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'screener'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Incident Screener</span>
          </button>

          <button
            onClick={() => setActiveTab('drafter')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'drafter'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Draft Complaint</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timelines</span>
          </button>

          <button
            onClick={() => setActiveTab('toolkit')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'toolkit'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Committee Toolkit</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Rights & FAQs</span>
          </button>

        </div>

        {/* Tab Views */}
        <div className="flex-1">
          {activeTab === 'chat' && (
            <ChatTab
              currentRole={currentRole}
              onNavigateToDraft={() => setActiveTab('drafter')}
              onNavigateToScreener={() => setActiveTab('screener')}
              onNavigateToTimeline={() => setActiveTab('timeline')}
            />
          )}

          {activeTab === 'screener' && (
            <ScreenerTab onTransferToDraft={handleTransferToDraft} />
          )}

          {activeTab === 'drafter' && (
            <ComplaintDrafterTab initialData={prefilledDraftData} />
          )}

          {activeTab === 'timeline' && <TimelineTab />}

          {activeTab === 'toolkit' && <CommitteeToolkitTab />}

          {activeTab === 'faqs' && <LegalFaqTab />}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Statutory Secrecy: Mandated under Section 16 & 17 of the POSH Act, 2013</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Esc</kbd> for Quick Exit</span>
            <button
              onClick={() => setIsHelplineOpen(true)}
              className="text-teal-700 dark:text-teal-400 hover:underline font-semibold"
            >
              Emergency Helplines (112 / 1091)
            </button>
          </div>
        </div>
      </footer>

      {/* Helpline Modal */}
      <HelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
      />

    </div>
  );
}
