export type UserRole = 'complainant' | 'icc_member' | 'manager' | 'witness';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface IncidentDetails {
  complainantName: string;
  employeeId: string;
  department: string;
  contactEmail: string;
  respondentName: string;
  respondentDesignation: string;
  respondentDepartment: string;
  incidentTypes: string[];
  incidentDates: string;
  incidentLocations: string;
  detailedNarrative: string;
  witnesses: string[];
  evidence: string[];
  impactDetails: string;
  requestedRelief: string[];
  isAnonymous: boolean;
}

export interface TimelineStage {
  id: string;
  dayRange: string;
  title: string;
  statutoryReference: string;
  description: string;
  partiesInvolved: string[];
  criticalRules: string[];
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface LegalFAQ {
  id: string;
  question: string;
  category: 'Definitions' | 'Timelines' | 'Confidentiality' | 'Interim Relief' | 'Inquiry Process' | 'Appeals';
  sectionRef: string;
  shortAnswer: string;
  detailedExplanation: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  targetRole: string;
  legalBasis: string;
  description: string;
  content: string;
}
