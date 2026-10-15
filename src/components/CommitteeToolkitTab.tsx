import React, { useState } from 'react';
import {
  FileCheck,
  Users,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Scale,
  Shield,
  Layers,
} from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../data/iccData';

export const CommitteeToolkitTab: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DOCUMENT_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  // Quorum Checker State
  const [hasWomanPresidingOfficer, setHasWomanPresidingOfficer] = useState(true);
  const [internalMemberCount, setInternalMemberCount] = useState(2);
  const [hasExternalMember, setHasExternalMember] = useState(true);
  const [womenMemberCount, setWomenMemberCount] = useState(2);
  const [presidingOfficerPresentInHearing, setPresidingOfficerPresentInHearing] = useState(true);
  const [externalMemberPresentInHearing, setExternalMemberPresentInHearing] = useState(true);
  const [totalPresentInHearing, setTotalPresentInHearing] = useState(3);

  const totalMembers = 1 + internalMemberCount + (hasExternalMember ? 1 : 0);
  const womenPercentage = Math.round(((womenMemberCount + (hasWomanPresidingOfficer ? 1 : 0)) / Math.max(totalMembers, 1)) * 100);

  const isCompositionValid =
    hasWomanPresidingOfficer &&
    internalMemberCount >= 2 &&
    hasExternalMember &&
    womenPercentage >= 50;

  const isHearingQuorumValid =
    totalPresentInHearing >= 3 &&
    presidingOfficerPresentInHearing &&
    externalMemberPresentInHearing;

  const currentTemplate = DOCUMENT_TEMPLATES.find((t) => t.id === selectedTemplateId) || DOCUMENT_TEMPLATES[0];

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([currentTemplate.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.id}_template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-teal-800 to-indigo-900 rounded-2xl text-white shadow-xl flex items-start space-x-4">
        <div className="p-3 bg-white/10 rounded-xl shrink-0">
          <Scale className="w-8 h-8 text-teal-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            ICC Panel Toolkit & Statutory Compliance Desk
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            Standard operating procedures, quorum validation calculators, and formal legal notice templates under the POSH Act 2013 for Committee Members and HR Disciplinary Authorities.
          </p>
        </div>
      </div>

      {/* Section 1: Quorum & Panel Composition Validator */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-base pb-3 border-b border-slate-200 dark:border-slate-800">
          <Users className="w-5 h-5 text-teal-600" />
          <span>Section 4 Mandatory Composition & Hearing Quorum Validator</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Panel Constitution Checks */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Overall Committee Constitution</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isCompositionValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isCompositionValid ? 'Statutorily Compliant' : 'Non-Compliant'}
              </span>
            </h4>

            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>Presiding Officer is a Senior Woman Employee:</span>
              <input
                type="checkbox"
                checked={hasWomanPresidingOfficer}
                onChange={(e) => setHasWomanPresidingOfficer(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </label>

            <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Internal Employee Members (Min 2):</span>
              <input
                type="number"
                min={1}
                max={10}
                value={internalMemberCount}
                onChange={(e) => setInternalMemberCount(parseInt(e.target.value) || 0)}
                className="w-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-center text-xs"
              />
            </div>

            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>External Member from NGO / Legal Association:</span>
              <input
                type="checkbox"
                checked={hasExternalMember}
                onChange={(e) => setHasExternalMember(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </label>

            <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Other Women Members (Need ≥50% total):</span>
              <input
                type="number"
                min={0}
                max={10}
                value={womenMemberCount}
                onChange={(e) => setWomenMemberCount(parseInt(e.target.value) || 0)}
                className="w-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-center text-xs"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs font-semibold">
              <span>Women Representation:</span>
              <span className={womenPercentage >= 50 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {womenPercentage}% {womenPercentage >= 50 ? '(Complies with 50% Rule)' : '(Must be at least 50%)'}
              </span>
            </div>
          </div>

          {/* Hearing Quorum Checks */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Hearing Session Quorum (Section 11)</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isHearingQuorumValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isHearingQuorumValid ? 'Quorum Met' : 'Quorum Lacking'}
              </span>
            </h4>

            <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Total Members in Attendance (Min 3):</span>
              <input
                type="number"
                min={1}
                max={10}
                value={totalPresentInHearing}
                onChange={(e) => setTotalPresentInHearing(parseInt(e.target.value) || 0)}
                className="w-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-center text-xs"
              />
            </div>

            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>Presiding Officer is Present in Hearing:</span>
              <input
                type="checkbox"
                checked={presidingOfficerPresentInHearing}
                onChange={(e) => setPresidingOfficerPresentInHearing(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>External Member is Present in Hearing:</span>
              <input
                type="checkbox"
                checked={externalMemberPresentInHearing}
                onChange={(e) => setExternalMemberPresentInHearing(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </label>

            <p className="text-[11px] text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-700">
              <strong>Statutory Quorum Rule:</strong> Any proceeding or witness examination conducted without at least 3 members (including the Presiding Officer and the External Member) is liable to be set aside in judicial review for breach of Section 4(2).
            </p>
          </div>

        </div>
      </div>

      {/* Section 2: Statutory Legal Notice & Order Templates */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-base pb-3 border-b border-slate-200 dark:border-slate-800">
          <FileCheck className="w-5 h-5 text-teal-600" />
          <span>Statutory Notice & Procedural Templates</span>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid sm:grid-cols-4 gap-2">
          {DOCUMENT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplateId(tpl.id)}
              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                selectedTemplateId === tpl.id
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-600 text-teal-900 dark:text-teal-200 font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 font-semibold mb-1">
                {tpl.legalBasis}
              </div>
              <div className="font-semibold truncate">{tpl.title}</div>
            </button>
          ))}
        </div>

        {/* Template Content Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentTemplate.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentTemplate.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyTemplate}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Template'}</span>
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
            {currentTemplate.content}
          </pre>
        </div>
      </div>

      {/* Section 3: Natural Justice & Standard of Proof Principles */}
      <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-teal-600" />
          <span>Core Principles for Conducting Impartial ICC Inquiries</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Preponderance of Probability
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Inquiries do not require criminal proof beyond reasonable doubt. If evidence suggests that the misconduct is more likely to have occurred than not, the charge is legally substantiated.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Non-Adversarial Hearings
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              No advocates or legal practitioners are permitted under Rule 7(6). Cross-examination must be moderated by the Committee to prevent intimidation and re-victimization.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Strict Section 16 Secrecy
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Neither the identities nor findings can be made public. Any breach carries statutory monetary penalties and immediate loss of committee membership.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
