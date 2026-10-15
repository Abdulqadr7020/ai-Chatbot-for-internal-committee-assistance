import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Clock,
  FileText,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import { ChatMessage, UserRole } from '../types';
import { MarkdownView } from './MarkdownView';

interface ChatTabProps {
  currentRole: UserRole;
  onNavigateToDraft: () => void;
  onNavigateToScreener: () => void;
  onNavigateToTimeline: () => void;
}

const ROLE_PROMPTS: Record<UserRole, { label: string; prompt: string }[]> = {
  complainant: [
    { label: 'What is considered harassment?', prompt: 'What specific behaviors and conduct qualify as workplace sexual harassment under the POSH Act?' },
    { label: 'How to ask for interim relief?', prompt: 'What immediate interim relief (leaves, transfer, restraining orders) can I request under Section 12 while the inquiry is active?' },
    { label: 'How does the 90-day deadline work?', prompt: 'What is the 90-day limitation period for filing a complaint, and can it be extended?' },
    { label: 'Can I complain anonymously?', prompt: 'How does the ICC handle anonymous complaints, and how is confidentiality protected?' },
    { label: 'Conciliation vs Formal Inquiry', prompt: 'What is the difference between conciliation and formal inquiry, and can money be paid during conciliation?' },
    { label: 'What evidence should I save?', prompt: 'What kind of evidence is admissible, and what if there were no eyewitnesses?' },
  ],
  icc_member: [
    { label: 'Rules of Natural Justice', prompt: 'What are the essential Principles of Natural Justice that the ICC must follow during hearings?' },
    { label: 'ICC Quorum requirements', prompt: 'What is the mandatory quorum and composition for conducting an ICC hearing under Section 4?' },
    { label: 'Timeline for Notice & Reply', prompt: 'What are the statutory deadlines for issuing notice to the respondent and receiving their written reply?' },
    { label: 'Cross-examination rules', prompt: 'How should the ICC conduct cross-examination without causing re-traumatization to the complainant?' },
    { label: 'Standard of Proof', prompt: 'Explain the "Preponderance of Probability" standard versus criminal standard of proof in ICC inquiries.' },
    { label: 'Report & Recommendation rules', prompt: 'What must be included in the Final Inquiry Report under Section 13, and what are permissible recommendations?' },
  ],
  manager: [
    { label: 'Manager immediate duty', prompt: 'An employee verbally shared a harassment incident with me. What is my immediate legal and ethical duty as a manager?' },
    { label: 'Zero-retaliation rules', prompt: 'How do I enforce zero-retaliation protections in my team during an ongoing ICC inquiry?' },
    { label: 'Temporary team adjustments', prompt: 'Can I change project assignments or seating while an ICC matter is being inquired into without penalizing the complainant?' },
  ],
  witness: [
    { label: 'Witness confidentiality', prompt: 'I have been summoned as a witness by the ICC. What are my rights, obligations, and confidentiality protections?' },
    { label: 'Protection against retaliation', prompt: 'What protection do I have against retaliation from the respondent or department leadership?' },
  ],
};

export const ChatTab: React.FC<ChatTabProps> = ({
  currentRole,
  onNavigateToDraft,
  onNavigateToScreener,
  onNavigateToTimeline,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `### Welcome to Sanskriti — Confidential ICC & POSH Assistance

I am your confidential AI advisor, dedicated to assisting employees and the Internal Complaints Committee with **objective, empathetic, and legally compliant guidance** under the POSH Act, 2013 and workplace ethics policies.

**Your Safe Space:**
- **Strict Privacy**: Your inputs are not published or shared. Section 16 of the POSH Act protects the confidentiality of all parties.
- **Empathetic Support**: We can help you understand your legal rights, assess incidents, gather evidence, request interim relief (leaves, transfers, supervisor changes), or draft a formal complaint.
- **Committee Integrity**: For ICC Members, we provide statutory timeline guidance, quorum rules, notice templates, and natural justice protocols.

How can I assist you today? Select a question below or describe your situation in confidence.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech synthesis
  const toggleSpeech = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text.replace(/[#*`_-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: `cleared-${Date.now()}`,
        role: 'model',
        text: `### Conversation Cleared

The chat history has been reset for your privacy. How can I assist you right now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            text: m.text,
          })),
          userRole: currentRole,
        }),
      });

      const data = await response.json();
      const replyContent = data.reply || data.error || 'Unable to retrieve answer. Please consult the Presiding Officer directly.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: `### Connection Notice

We encountered a temporary network delay. You may review the **Rights & FAQs** tab or directly access the **Complaint Drafter** or emergency helplines.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const prompts = ROLE_PROMPTS[currentRole] || ROLE_PROMPTS.complainant;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      {/* Top Banner / Role Status */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Advisory Mode:
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {currentRole === 'complainant'
              ? 'Aggrieved / Complainant'
              : currentRole === 'icc_member'
              ? 'ICC Committee Member'
              : currentRole === 'manager'
              ? 'Manager / HR Lead'
              : 'Witness / Colleague'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToScreener}
            className="text-xs text-teal-700 dark:text-teal-400 hover:underline flex items-center space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Incident Screener</span>
          </button>
          <button
            onClick={onNavigateToDraft}
            className="text-xs text-teal-700 dark:text-teal-400 hover:underline flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Draft Complaint</span>
          </button>
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Clear Chat History for Privacy"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-gradient-to-tr from-amber-600 to-rose-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                  isUser
                    ? 'bg-teal-700 text-white rounded-tr-xs shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700 shadow-xs'
                }`}
              >
                {isUser ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <MarkdownView content={msg.text} />
                )}

                {/* Footer of message */}
                <div
                  className={`mt-2 pt-2 flex items-center justify-between text-[11px] ${
                    isUser
                      ? 'border-t border-teal-600/60 text-teal-100'
                      : 'border-t border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleSpeech(msg.text, msg.id)}
                        className="hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                        title={speakingId === msg.id ? 'Stop audio' : 'Listen to response'}
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs px-5 py-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                <span>Consulting POSH Act, statutory rules & case precedents...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center space-x-2 w-max">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Inquiry:
          </span>
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p.prompt)}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end space-x-2"
        >
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any question regarding ICC inquiry, POSH law, evidence, timelines, or your situation in confidence..."
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all"
            />
            <div className="absolute right-3 bottom-2.5 text-[10px] text-slate-400">
              Shift + Enter for new line
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Zero-retaliation protected. All communications are strictly confidential.
          </span>
          <span className="hidden sm:inline">
            POSH Act 2013 Compliance
          </span>
        </div>
      </div>

    </div>
  );
};
