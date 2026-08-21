import { PlannerTask, ScheduledTask } from '@/types';

/*
 * Prioritization model: score = priority weight + urgency weight (based on
 * days until deadline), then tasks are packed into day "buckets" respecting
 * a realistic daily focus capacity, and given concrete time blocks.
 */

const PRIORITY_WEIGHT: Record<PlannerTask['priority'], number> = {
  High: 30,
  Medium: 18,
  Low: 8,
};

const DAILY_CAPACITY_MINUTES = 360;
const DAY_LABELS = ['Today', 'Tomorrow'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function daysUntil(deadline: string): number {
  if (!deadline) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyScore(days: number): number {
  if (days <= 0) return 40;
  return Math.max(0, 32 - days * 4);
}

function rationaleFor(task: PlannerTask, days: number): string {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} — scheduled first.`;
  if (days === 0) return 'Due today — scheduled early to leave room for the unexpected.';
  if (days <= 2) return `Due in ${days} day${days === 1 ? '' : 's'} — prioritized to stay ahead of the deadline.`;
  if (task.priority === 'High') return 'Marked high priority — scheduled early despite a further-out deadline.';
  return 'Lower urgency — scheduled once more time-sensitive work is placed.';
}

function dayLabel(dayIndex: number): string {
  if (dayIndex < DAY_LABELS.length) return DAY_LABELS[dayIndex];
  const date = new Date();
  date.setDate(date.getDate() + dayIndex);
  return `${WEEKDAY_NAMES[date.getDay()]} (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
}

function formatTime(minutesFromNine: number): string {
  const totalMinutes = 9 * 60 + minutesFromNine;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function scheduleTasks(tasks: PlannerTask[]): ScheduledTask[] {
  const scored = tasks.map((task) => {
    const days = daysUntil(task.deadline);
    const score = PRIORITY_WEIGHT[task.priority] + urgencyScore(days);
    return { task, days, score };
  });

  scored.sort((a, b) => b.score - a.score || a.task.durationMinutes - b.task.durationMinutes);

  const dayCursors: number[] = [];
  const scheduled: ScheduledTask[] = [];

  for (const { task, days, score } of scored) {
    let dayIndex = 0;
    while ((dayCursors[dayIndex] ?? 0) + task.durationMinutes > DAILY_CAPACITY_MINUTES && dayIndex < 13) {
      dayIndex++;
    }
    const startMinute = dayCursors[dayIndex] ?? 0;
    dayCursors[dayIndex] = startMinute + task.durationMinutes;

    scheduled.push({
      ...task,
      score,
      slot: dayLabel(dayIndex),
      timeBlock: `${formatTime(startMinute)} – ${formatTime(startMinute + task.durationMinutes)}`,
      rationale: rationaleFor(task, days),
    });
  }

  return scheduled;
}
