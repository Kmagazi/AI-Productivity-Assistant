import { useState } from 'react';
import { ListChecks, Plus, Trash2, Sparkles, Clock } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Disclaimer from '@/components/ui/Disclaimer';
import { scheduleTasks } from '@/lib/taskScheduler';
import { simulateLatency } from '@/lib/simulateLatency';
import { PlannerTask, ScheduledTask, TaskPriority } from '@/types';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
};

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export default function TaskPlanner() {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [deadline, setDeadline] = useState(todayISO());
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [schedule, setSchedule] = useState<ScheduledTask[] | null>(null);
  const [loading, setLoading] = useState(false);

  const addTask = () => {
    if (!title.trim()) return;
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title: title.trim(), durationMinutes: duration, deadline, priority },
    ]);
    setTitle('');
    setDuration(30);
    setPriority('Medium');
    setSchedule(null);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setSchedule(null);
  };

  const handlePlan = async () => {
    setLoading(true);
    const result = await simulateLatency(() => scheduleTasks(tasks));
    setSchedule(result);
    setLoading(false);
  };

  const groupedSchedule = schedule?.reduce<Record<string, ScheduledTask[]>>((acc, t) => {
    (acc[t.slot] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Add your tasks and let AI rank them by urgency and importance, then lay out a realistic day-by-day schedule."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Tasks</h2>

          <div className="space-y-3 rounded-lg border border-slate-200 p-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="e.g. Prepare client presentation"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Duration (min)</label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <Button onClick={addTask} variant="secondary" disabled={!title.trim()} className="w-full">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {tasks.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">Add a few tasks to get started.</p>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-400">
                    {task.durationMinutes} min · Due {task.deadline}
                  </p>
                </div>
                <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="flex-shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handlePlan}
            loading={loading}
            disabled={tasks.length === 0}
            className="mt-4 w-full"
          >
            {!loading && <Sparkles className="h-4 w-4" />}
            {loading ? 'Building your plan…' : 'Generate Prioritized Plan'}
          </Button>
        </Card>

        <Card className="flex flex-col">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Prioritized Schedule</h2>

          {!schedule && !loading && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-16 text-center">
              <ListChecks className="mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">Your prioritized schedule will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center py-16">
              <Sparkles className="mb-3 h-8 w-8 animate-pulse text-blue-400" />
              <p className="text-sm text-slate-400">Weighing urgency and importance…</p>
            </div>
          )}

          {groupedSchedule && !loading && (
            <div className="flex-1 space-y-5">
              {Object.entries(groupedSchedule).map(([slot, items]) => (
                <section key={slot}>
                  <h3 className="mb-2 text-sm font-semibold text-slate-800">{slot}</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="rounded-lg border border-slate-100 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[item.priority]}`}>
                            {item.priority}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" /> {item.timeBlock}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.rationale}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              <Disclaimer />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
