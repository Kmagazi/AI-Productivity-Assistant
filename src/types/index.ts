export type View = 'dashboard' | 'email' | 'notes' | 'tasks' | 'research' | 'chat';

export type Tone = 'Formal' | 'Professional' | 'Friendly' | 'Persuasive' | 'Apologetic' | 'Urgent' | 'Assertive';

export type Audience =
  | 'Client'
  | 'Manager'
  | 'Colleague'
  | 'Team'
  | 'Executive'
  | 'Vendor'
  | 'Job Applicant'
  | 'Customer Support';

export type EmailPurpose =
  | 'Follow-up'
  | 'Request'
  | 'Introduction'
  | 'Apology'
  | 'Thank You'
  | 'Meeting Request'
  | 'Status Update'
  | 'Proposal';

export interface EmailInput {
  senderName: string;
  recipientName: string;
  audience: Audience;
  tone: Tone;
  purpose: EmailPurpose;
  keyPoints: string;
}

export interface EmailOutput {
  subject: string;
  body: string;
}

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

export interface MeetingSummary {
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  nextSteps: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface PlannerTask {
  id: string;
  title: string;
  durationMinutes: number;
  deadline: string;
  priority: TaskPriority;
}

export interface ScheduledTask extends PlannerTask {
  score: number;
  slot: string;
  timeBlock: string;
  rationale: string;
}

export interface ResearchFocus {
  marketTrends: boolean;
  competitors: boolean;
  bestPractices: boolean;
  statistics: boolean;
  risks: boolean;
}

export interface ResearchOutput {
  overview: string;
  insights: string[];
  considerations: string[];
  nextSteps: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
