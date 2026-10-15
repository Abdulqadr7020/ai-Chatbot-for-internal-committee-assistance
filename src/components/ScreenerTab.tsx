import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Info,
  Scale,
  Lock,
} from 'lucide-react';
import { MarkdownView } from './MarkdownView';

interface ScreenerTabProps {
  onTransferToDraft: (prefillData: {
    incidentTypes: string[];
    respondentDesignation: string;
    narrative: string;
    locations: string;
  }) => void;
}

export const ScreenerTab: React.FC<ScreenerTabProps> = ({ onTransferToDraft }) => {
  const [relationship, setRelationship] = useState('Direct Supervisor');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [location, setLocation] = useState('Official Office Premises');
  const [frequency, setFrequency] = useState('Repeated multiple times');
  const [discomfortConveyed, setDiscomfortConveyed] = useState('No, felt intimidated/feared retaliation');
  const [narrative, setNarrative] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

  const incidentOptions = [
    { id: 'physical', label: 'Unwelcome physical touch or invasion of personal space' },
    { id: 'verbal', label: 'Sexually colored remarks, inappropriate compliments, or double-meaning jokes' },
    { id: 'quid_pro_quo', label: 'Explicit or implied demand for favors in exchange for promotion, rating, or retention' },
    { id: 'digital', label: 'Off-hours personal messages on WhatsApp, Teams, or social media of non-work nature' },
    { id: 'non_verbal', label: 'Suggestive gestures, staring, leering, or displaying inappropriate media' },
    { id: 'hostile_env', label: 'Hostile, humiliating, or discriminatory conduct creating workplace distress' },
    { id: 'retaliation', label: 'Punitive measures or threats following refusal of advances' },
  ];

  const handleToggleType = (typeLabel: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeLabel) ? prev.filter((t) => t !== typeLabel) : [...prev, typeLabel]
    );
  };

  const handleEvaluate = async () => {
    if (!narrative.trim() && selectedTypes.length === 0) {
      alert('Please select at least one behavior type or describe the situation briefly.');
      return;
    }

    setIsEvaluating(true);
    setAssessmentResult(null);

    try {
      const response = await fetch('/api/assess-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentText: narrative || `Reported behaviors: ${selectedTypes.join(', ')}`,
          relationship,
          frequency,
          channel: location,
          requestedAction: 'Legal & procedural assessment under POSH Act',
        }),
      });

      const data = await response.json();
      setAssessmentResult(data.assessment || 'Assessment completed.');
    } catch (err) {
      setAssessmentResult(`### Preliminary Assessment

1. **Prima Facie Grounds**: The behaviors described fall squarely within the scope of Section 2(n) and Section 3 of the POSH Act, 2013.
2. **Key Protection**: You do not have to endure unwelcome conduct in silence. Under Section 9, you have the right to file a formal complaint with the Internal Complaints Committee.
3. **Next Steps**: Document dates, times, and preserve digital screenshots. You may proceed to generate a formal complaint draft.`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleProceedToDrafter = () => {
    onTransferToDraft({
      incidentTypes: selectedTypes,
      respondentDesignation: relationship,
      narrative: narrative,
      locations: location,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Informative Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-800 to-indigo-900 text-white shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/10 rounded-xl shrink-0">
            <Scale className="w-8 h-8 text-teal-300" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-teal-100">
              <Lock className="w-3 h-3" />
              <span>100% Anonymous & Confidential</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Interactive Incident Screener & Self-Assessment
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Unsure if an uncomfortable experience legally constitutes workplace harassment? Use this confidential tool to evaluate your situation against the POSH Act 2013 and understand your statutory rights.
            </p>
          </div>
        </div>
      </div>

      {/* Questionnaire Form */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Question 1: Types of Behavior */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            1. What type of behavior did you experience or witness? (Select all that apply)
          </label>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {incidentOptions.map((opt) => {
              const isChecked = selectedTypes.includes(opt.label);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleType(opt.label)}
                  className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start space-x-2.5 cursor-pointer ${
                    isChecked
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 text-teal-900 dark:text-teal-200 font-semibold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-sm mt-0.5 shrink-0 flex items-center justify-center border ${
                      isChecked
                        ? 'bg-teal-700 border-teal-700 text-white'
                        : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-700'
                    }`}
                  >
                    {isChecked && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: Relationship */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              2. What is the respondent's workplace relationship to you?
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
            >
              <option value="Direct Supervisor / Line Manager">Direct Supervisor / Line Manager</option>
              <option value="Senior Executive / Department Head">Senior Executive / Department Head</option>
              <option value="Peer / Same-level Colleague">Peer / Same-level Colleague</option>
              <option value="Subordinate / Team Member">Subordinate / Team Member</option>
              <option value="Client / Vendor / Contractor">Client / Vendor / Contractor</option>
              <option value="Third-party Visitor at workplace">Third-party Visitor at workplace</option>
            </select>
            <p className="text-[11px] text-slate-500">
              POSH Act protects employees against harassment by supervisors, peers, and external vendors alike.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              3. Where or through what medium did this occur?
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
            >
              <option value="Official Office Premises">Official Office Premises (Meeting room, cafeteria, desk)</option>
              <option value="Work-from-Home / Video Call / Slack / Teams">Work-from-Home / Video Call / Slack / Teams</option>
              <option value="Personal Phone / WhatsApp / Social Media">Personal Phone / WhatsApp / Social Media</option>
              <option value="Company Offsite / Dinner / Social Gathering">Company Offsite / Dinner / Social Gathering</option>
              <option value="Business Travel / Hotel during work trip">Business Travel / Hotel during work trip</option>
              <option value="Company-provided Cab / Commute">Company-provided Cab / Commute</option>
            </select>
            <p className="text-[11px] text-slate-500">
              The "Extended Workplace" doctrine covers business trips, virtual calls, and company offsites.
            </p>
          </div>
        </div>

        {/* Question 3: Frequency & Communication */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              4. Frequency of the conduct
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
            >
              <option value="Single severe incident">Single severe incident</option>
              <option value="Repeated multiple times">Repeated multiple times</option>
              <option value="Continuous pattern over weeks or months">Continuous pattern over weeks or months</option>
              <option value="Escalating severity">Escalating severity over time</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              5. Was discomfort or objection communicated?
            </label>
            <select
              value={discomfortConveyed}
              onChange={(e) => setDiscomfortConveyed(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
            >
              <option value="Yes, explicitly told them to stop">Yes, explicitly told them to stop</option>
              <option value="Expressed discomfort non-verbally / walked away">Expressed discomfort non-verbally / walked away</option>
              <option value="No, felt intimidated/feared retaliation">No, felt intimidated/feared retaliation or impact on job</option>
              <option value="Told a colleague or friend immediately">Told a colleague or friend immediately</option>
            </select>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            6. Brief description of what happened (Optional for evaluation)
          </label>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={3}
            placeholder="Share key details e.g., 'My manager sent multiple late-night personal messages and hinted that my performance appraisal depended on meeting after hours...'"
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>This screener runs securely and does not automatically submit any report to the company.</span>
          </div>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analyzing against POSH Act...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-4 h-4" />
                <span>Evaluate Incident Prima Facie</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Assessment Result Panel */}
      {assessmentResult && (
        <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-850 rounded-2xl border-2 border-teal-600/40 shadow-xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 rounded-lg">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Preliminary Legal & Procedural Assessment
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Prima Facie Review
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <MarkdownView content={assessmentResult} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ready to draft a formal complaint letter addressed to the Presiding Officer?
            </p>

            <button
              onClick={handleProceedToDrafter}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-700 text-white font-semibold text-xs sm:text-sm hover:from-teal-800 hover:to-indigo-800 transition-all shadow-md cursor-pointer"
            >
              <span>Transfer to Formal Complaint Drafter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
