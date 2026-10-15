import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ArrowRight,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TIMELINE_STAGES } from '../data/iccData';

export const TimelineTab: React.FC = () => {
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [filingDate, setFilingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [expandedStage, setExpandedStage] = useState<string>('stage-1');

  // Helper date add
  const addDays = (dateStr: string, days: number): string => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const addWorkingDays = (dateStr: string, workingDays: number): string => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    let added = 0;
    while (added < workingDays) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        added++;
      }
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-teal-800 to-indigo-900 rounded-2xl text-white shadow-xl flex items-start space-x-4">
        <div className="p-3 bg-white/10 rounded-xl shrink-0">
          <Clock className="w-8 h-8 text-teal-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Statutory Timeline & Procedural Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            Every step of an Internal Complaints Committee inquiry has mandatory legal timeframes under the POSH Act 2013. Use the interactive calculator below to forecast statutory deadlines.
          </p>
        </div>
      </div>

      {/* Interactive Deadline Calculator */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-base pb-3 border-b border-slate-200 dark:border-slate-800">
          <Calendar className="w-5 h-5 text-teal-600" />
          <span>Interactive POSH Statutory Deadline Calculator</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date of Incident (or Last Incident in series):
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Complaint Filing Date with ICC:
            </label>
            <input
              type="date"
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Computed Milestones Grid */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400">
              Filing Limitation (90 Days)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {addDays(incidentDate, 90)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Section 9(1): Normal statutory deadline. Extendable up to {addDays(incidentDate, 180)} with cause.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400">
              Notice to Respondent (7 Work Days)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {addWorkingDays(filingDate, 7)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Rule 7(1): ICC must serve complaint copy to respondent within 7 working days of receipt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400">
              Respondent Reply (10 Work Days)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {addWorkingDays(filingDate, 17)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Rule 7(2): Respondent must submit formal response, documents & witness list.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
              Inquiry Completion (90 Days)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {addDays(filingDate, 90)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Section 11(4): Mandatory deadline for ICC to conclude all hearings & depositions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400">
              Report Submission (10 Days)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {addDays(filingDate, 100)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Section 13(1): Findings report delivered to Employer and shared with both parties.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-400">
              Management Implementation (60 Days)
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {addDays(filingDate, 160)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Section 13(4): Employer must execute the disciplinary actions recommended by ICC.
            </p>
          </div>

        </div>

      </div>

      {/* Visual Roadmap Stages */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>Complete 8-Stage ICC Redressal Lifecycle</span>
        </h3>

        <div className="space-y-3">
          {TIMELINE_STAGES.map((stage, idx) => {
            const isExpanded = expandedStage === stage.id;
            return (
              <div
                key={stage.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedStage(isExpanded ? '' : stage.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {stage.dayRange}
                        </span>
                        <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 hidden sm:inline">
                          {stage.statutoryReference}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {stage.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-850/50 text-xs sm:text-sm">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-3">
                      {stage.description}
                    </p>

                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                        Statutory Rules & Compliance Obligations:
                      </h5>
                      <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-300">
                        {stage.criticalRules.map((rule, rIdx) => (
                          <li key={rIdx} className="leading-relaxed">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-500">
                      <span className="font-semibold">Parties Involved:</span>
                      {stage.partiesInvolved.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
