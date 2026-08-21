import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import { View } from '@/types';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const features: {
  view: View;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    view: 'email',
    icon: Mail,
    title: 'Smart Email Generator',
    description: 'Draft polished emails matched to your audience and tone in seconds.',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    view: 'notes',
    icon: FileText,
    title: 'Meeting Notes Summarizer',
    description: 'Turn raw notes into key points, decisions, and action items.',
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    view: 'tasks',
    icon: ListChecks,
    title: 'AI Task Planner',
    description: 'Prioritize your to-dos and get a realistic day-by-day schedule.',
    accent: 'bg-amber-50 text-amber-600',
  },
  {
    view: 'research',
    icon: Search,
    title: 'AI Research Assistant',
    description: 'Get structured, decision-ready summaries on any topic.',
    accent: 'bg-teal-50 text-teal-600',
  },
  {
    view: 'chat',
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: "Ask questions or get pointed to the right tool for the job.",
    accent: 'bg-rose-50 text-rose-600',
  },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-200">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI Workplace Productivity Assistant</span>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Get more done, with less busywork.</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-blue-100">
            Draft emails, summarize meetings, plan your day, and research topics — all from one dashboard.
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Tools</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ view, icon: Icon, title, description, accent }) => (
          <Card
            key={view}
            className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <button onClick={() => onNavigate(view)} className="flex h-full w-full flex-col text-left">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-slate-900">{title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-500">{description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
                Open tool <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
