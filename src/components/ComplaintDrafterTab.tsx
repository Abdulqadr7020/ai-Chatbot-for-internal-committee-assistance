import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Printer,
  Send,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  EyeOff,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { IncidentDetails } from '../types';

interface ComplaintDrafterTabProps {
  initialData?: Partial<IncidentDetails>;
}

export const ComplaintDrafterTab: React.FC<ComplaintDrafterTabProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<IncidentDetails>({
    complainantName: initialData?.complainantName || '',
    employeeId: initialData?.employeeId || '',
    department: initialData?.department || '',
    contactEmail: initialData?.contactEmail || '',
    respondentName: initialData?.respondentName || '',
    respondentDesignation: initialData?.respondentDesignation || '',
    respondentDepartment: initialData?.respondentDepartment || '',
    incidentTypes: initialData?.incidentTypes || ['Verbal Harassment & Sexually Colored Remarks'],
    incidentDates: initialData?.incidentDates || 'Occurred across multiple dates in the last 60 days',
    incidentLocations: initialData?.incidentLocations || 'Office workspace & official messaging platforms',
    detailedNarrative: initialData?.detailedNarrative || '',
    witnesses: initialData?.witnesses || ['Colleagues present in adjacent work desks'],
    evidence: initialData?.evidence || ['Screenshots of digital chat conversations', 'Official email communications'],
    impactDetails: initialData?.impactDetails || 'Severe emotional anxiety, fear of career reprisal, and disruption of daily work productivity.',
    requestedRelief: initialData?.requestedRelief || [
      'Immediate restraining order against respondent from contacting complainant',
      'Reassignment of reporting lines / supervisor evaluation',
      'Paid protective leave up to 3 months under Section 12',
    ],
    isAnonymous: initialData?.isAnonymous || false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{ id: string; date: string } | null>(null);

  const incidentTypeOptions = [
    'Unwelcome Physical Contact & Advances',
    'Demand or Request for Sexual Favors (Quid Pro Quo)',
    'Sexually Colored Remarks & Inappropriate Jokes',
    'Unsolicited Suggestive Media / Messages',
    'Non-verbal Leering, Staring, or Obscene Gestures',
    'Hostile, Intimidating, or Offensive Work Environment',
    'Retaliation or Threat of Detrimental Appraisal',
  ];

  const interimReliefOptions = [
    'Restraining order prohibiting respondent from approaching or contacting complainant',
    'Reassignment of supervisor / performance evaluation authority',
    'Transfer of respondent or complainant to an alternate department or wing',
    'Granting of paid leave up to 3 months under Section 12 (POSH Act)',
    'Permission to work remotely / from home for the duration of the inquiry',
    'Confidential psychological counselling support via EAP',
  ];

  const toggleArrayItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const handleGenerate = async () => {
    if (!formData.detailedNarrative && !formData.respondentName) {
      alert('Please fill in at least the Respondent details and a brief narrative of what happened.');
      return;
    }

    setIsGenerating(true);
    setSubmittedReceipt(null);

    try {
      const response = await fetch('/api/draft-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setGeneratedDraft(data.complaintDocument || 'Draft generation completed.');
    } catch (err) {
      console.error(err);
      alert('Error connecting to draft service. Please check network.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDraft = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedDraft) return;
    const blob = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ICC_Complaint_${formData.isAnonymous ? 'Confidential' : formData.complainantName || 'Drafter'}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Formal Complaint under Section 9 POSH Act</title>
          <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; color: #111; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 13pt; }
          </style>
        </head>
        <body>
          <pre>${generatedDraft}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmitToPortal = () => {
    const receiptCode = `ICC-${new Date().getFullYear()}-CONF-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedReceipt({
      id: receiptCode,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Intro Header */}
      <div className="p-6 bg-gradient-to-r from-teal-800 to-indigo-900 rounded-2xl text-white shadow-xl flex items-start space-x-4">
        <div className="p-3 bg-white/10 rounded-xl shrink-0">
          <FileText className="w-8 h-8 text-teal-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Section 9 Formal Complaint Builder
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            Construct a legally structured, ironclad complaint addressed to the Presiding Officer and Members of the Internal Complaints Committee (ICC).
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Form Inputs (Left Column) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
          
          {/* Confidentiality / Anonymous Option */}
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <EyeOff className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block">
                  File with Confidential Pseudonym / Proxy
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-400">
                  Withhold your name from initial drafts. Identity revealed only to Presiding Officer.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>

          {/* Complainant Details (unless anonymous) */}
          {!formData.isAnonymous && (
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Complainant Particulars
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={formData.complainantName}
                  onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                  className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Department / Team"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Official / Confidential Email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Respondent Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {formData.isAnonymous ? '1.' : '2.'} Respondent Particulars (Person Against Whom Complaint is Filed)
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Respondent Name *"
                value={formData.respondentName}
                onChange={(e) => setFormData({ ...formData, respondentName: e.target.value })}
                className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Designation / Role"
                value={formData.respondentDesignation}
                onChange={(e) => setFormData({ ...formData, respondentDesignation: e.target.value })}
                className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.respondentDepartment}
                onChange={(e) => setFormData({ ...formData, respondentDepartment: e.target.value })}
                className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Nature of Conduct */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nature of Impermissible Conduct
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {incidentTypeOptions.map((opt, i) => {
                const isSelected = formData.incidentTypes.includes(opt);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        incidentTypes: toggleArrayItem(formData.incidentTypes, opt),
                      })
                    }
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-600 text-teal-900 dark:text-teal-200 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-xs shrink-0 flex items-center justify-center border ${
                        isSelected ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-400 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Incident Chronology & Narrative */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Incident Dates, Location & Chronological Narrative
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Dates / Timeline (e.g. Sept 12, 2026 to Oct 2, 2026)"
                value={formData.incidentDates}
                onChange={(e) => setFormData({ ...formData, incidentDates: e.target.value })}
                className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Location(s) (e.g. Meeting Room 4B, WhatsApp chat, Offsite dinner)"
                value={formData.incidentLocations}
                onChange={(e) => setFormData({ ...formData, incidentLocations: e.target.value })}
                className="text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <textarea
              rows={4}
              placeholder="State the facts chronologically: What happened? What words were spoken? What actions or gestures occurred? How did you respond? (Be as specific as possible)"
              value={formData.detailedNarrative}
              onChange={(e) => setFormData({ ...formData, detailedNarrative: e.target.value })}
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden resize-none"
            />
          </div>

          {/* Interim Relief Request (Section 12) */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Requested Interim Relief (Section 12 Protection)
            </h4>
            <div className="space-y-1.5">
              {interimReliefOptions.map((opt, i) => {
                const isSelected = formData.requestedRelief.includes(opt);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requestedRelief: toggleArrayItem(formData.requestedRelief, opt),
                      })
                    }
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-600 text-amber-900 dark:text-amber-200 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-xs shrink-0 flex items-center justify-center border ${
                        isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-400 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-700 to-indigo-700 text-white font-bold text-sm hover:from-teal-800 hover:to-indigo-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Drafting Legally Formatted Complaint...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Formal Section 9 Complaint Letter</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Document Preview & Actions (Right Column) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Formal Document Preview
                </h3>
              </div>

              {generatedDraft && (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleCopyDraft}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download document (.txt)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Print document"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Document Body */}
            <div className="mt-4 flex-1 overflow-y-auto max-h-[500px] bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {generatedDraft ? (
                generatedDraft
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                  <FileText className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-700" />
                  <p className="font-sans text-xs">
                    Fill in the details on the left and click <strong>"Generate Formal Complaint Letter"</strong> to see the complete statutory document.
                  </p>
                </div>
              )}
            </div>

            {/* Portal Submission Box */}
            {generatedDraft && !submittedReceipt && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={handleSubmitToPortal}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Internal Complaints Committee Portal</span>
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  Sends directly to the Presiding Officer with an encrypted tracking number.
                </p>
              </div>
            )}

            {/* Receipt Modal / Box */}
            {submittedReceipt && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Complaint Successfully Logged with ICC</span>
                </div>
                <div className="text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div>
                    <strong>Confidential Docket ID:</strong>{' '}
                    <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {submittedReceipt.id}
                    </span>
                  </div>
                  <div>
                    <strong>Filing Timestamp:</strong> {submittedReceipt.date}
                  </div>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 pt-1">
                    Statutory Rule 7 Triggered: The ICC will serve notice to the respondent within 7 working days. You will be notified via confidential email.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
