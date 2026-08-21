import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import EmailGenerator from '@/components/EmailGenerator';
import MeetingSummarizer from '@/components/MeetingSummarizer';
import TaskPlanner from '@/components/TaskPlanner';
import ResearchAssistant from '@/components/ResearchAssistant';
import Chatbot from '@/components/Chatbot';
import { View } from '@/types';

const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  email: 'Email Generator',
  notes: 'Meeting Notes',
  tasks: 'Task Planner',
  research: 'Research Assistant',
  chat: 'AI Chatbot',
};

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeView={view} onNavigate={setView} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-slate-900">{VIEW_TITLES[view]}</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && <Dashboard onNavigate={setView} />}
          {view === 'email' && <EmailGenerator />}
          {view === 'notes' && <MeetingSummarizer />}
          {view === 'tasks' && <TaskPlanner />}
          {view === 'research' && <ResearchAssistant />}
          {view === 'chat' && <Chatbot />}
        </main>
      </div>
    </div>
  );
}

export default App;
