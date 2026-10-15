import React from 'react';
import { Shield, EyeOff, Eye, LogOut, PhoneCall, UserCheck, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  discretionMode: boolean;
  onToggleDiscretion: () => void;
  onOpenHelpline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  discretionMode,
  onToggleDiscretion,
  onOpenHelpline,
}) => {
  // Quick Exit function for safety & privacy
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-teal-500/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                {discretionMode ? 'Sanskriti Advisory' : 'Sanskriti ICC Desk'}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                100% Confidential
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {discretionMode ? 'Internal Policy & Process Guidance' : 'Internal Complaints Committee & POSH Assistance'}
            </p>
          </div>
        </div>

        {/* Center / Role Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 hidden md:inline">
              Role:
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden py-1 px-2 rounded-lg cursor-pointer"
            >
              <option value="complainant" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                Aggrieved / Complainant
              </option>
              <option value="icc_member" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                ICC Committee Member
              </option>
              <option value="manager" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                Manager / HR Lead
              </option>
              <option value="witness" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                Colleague / Witness
              </option>
            </select>
          </div>
        </div>

        {/* Right Action Tools: Discretion, Helplines, Quick Exit */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Discretion toggle */}
          <button
            onClick={onToggleDiscretion}
            title={discretionMode ? 'Disable Discretion Mode' : 'Enable Discretion Mode (Neutral styling for open spaces)'}
            className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 ${
              discretionMode
                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {discretionMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden lg:inline text-xs">
              {discretionMode ? 'Discreet On' : 'Discreet'}
            </span>
          </button>

          {/* Emergency Helplines Button */}
          <button
            onClick={onOpenHelpline}
            className="p-2 rounded-xl text-xs font-medium bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center space-x-1.5"
            title="Helplines & Emergency Support"
          >
            <PhoneCall className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span className="hidden sm:inline font-semibold">Helplines</span>
          </button>

          {/* Quick Panic / Exit Button */}
          <button
            onClick={handleQuickExit}
            className="p-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-rose-600 dark:text-white hover:bg-slate-800 dark:hover:bg-rose-700 transition-all flex items-center space-x-1.5 shadow-sm"
            title="Instantly exit page to Google for privacy"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Exit</span>
          </button>
        </div>

      </div>
    </header>
  );
};
