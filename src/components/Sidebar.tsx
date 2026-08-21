import { Sparkles, LayoutDashboard, Mail, FileText, ListChecks, Search, MessageSquare, X } from 'lucide-react';
import { View } from '@/types';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { view: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'email', label: 'Email Generator', icon: Mail },
  { view: 'notes', label: 'Meeting Notes', icon: FileText },
  { view: 'tasks', label: 'Task Planner', icon: ListChecks },
  { view: 'research', label: 'Research Assistant', icon: Search },
  { view: 'chat', label: 'AI Chatbot', icon: MessageSquare },
];

export default function Sidebar({ activeView, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">AI Workplace</p>
              <p className="text-xs leading-tight text-slate-500">Productivity Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map(({ view, label, icon: Icon }) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                onClick={() => {
                  onNavigate(view);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-6 py-5">
          <p className="text-xs leading-relaxed text-slate-400">
            All outputs are AI-assisted drafts. Review before sending or acting on them.
          </p>
        </div>
      </aside>
    </>
  );
}
