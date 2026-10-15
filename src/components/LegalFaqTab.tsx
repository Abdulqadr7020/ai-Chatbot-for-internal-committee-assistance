import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Scale,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Tag,
} from 'lucide-react';
import { LEGAL_FAQS } from '../data/iccData';

export const LegalFaqTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string>('faq-1');

  const categories = ['All', 'Definitions', 'Confidentiality', 'Timelines', 'Interim Relief', 'Inquiry Process'];

  const filteredFaqs = LEGAL_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.detailedExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.sectionRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-teal-800 to-indigo-900 rounded-2xl text-white shadow-xl flex items-start space-x-4">
        <div className="p-3 bg-white/10 rounded-xl shrink-0">
          <BookOpen className="w-8 h-8 text-teal-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            POSH Act & ICC Legal Rights Handbook
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            Authoritative, plain-English legal explanations and statutory citations for employees, managers, and committee members.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search questions by keyword, topic, or section e.g., 'quid pro quo', '90 days', 'false complaint'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No matching questions found for "{searchQuery}". Try searching with different keywords or ask the AI Chat assistant.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaqId(isExpanded ? '' : faq.id)}
                  className="w-full p-5 text-left flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {faq.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {faq.sectionRef}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {faq.shortAnswer}
                    </p>
                  </div>

                  <div className="p-1 text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-3">
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-200 font-medium">
                      <strong>Executive Summary:</strong> {faq.shortAnswer}
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {faq.detailedExplanation}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-700">
                      <span>Statutory Reference: {faq.sectionRef}</span>
                      <span className="text-teal-700 dark:text-teal-400 font-medium">
                        POSH Act, 2013 & Supreme Court Guidelines
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
