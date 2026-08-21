import { useState } from 'react';
import { FileText, Sparkles, CheckCircle2, ListTodo, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Disclaimer from '@/components/ui/Disclaimer';
import { summarizeMeetingNotes } from '@/lib/meetingSummarizer';
import { simulateLatency } from '@/lib/simulateLatency';
import { MeetingSummary } from '@/types';

const SAMPLE_NOTES = `Attendees: Priya, Daniel, and the marketing team.
We discussed the Q3 launch timeline and reviewed current campaign performance.
The team agreed the landing page redesign is ready to ship.
Priya will finalize the press release by Friday.
Daniel needs to update the budget spreadsheet by next Monday.
We decided to postpone the paid ad campaign until the new creative is approved.
Everyone should review the analytics dashboard before next week's meeting.`;

export default function MeetingSummarizer() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    const result = await simulateLatency(() => summarizeMeetingNotes(notes));
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste your raw notes and get key points, decisions, and action items with owners and deadlines pulled out automatically."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Raw Notes</h2>
            <button
              onClick={() => setNotes(SAMPLE_NOTES)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Use sample notes
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes or transcript here…"
            rows={16}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <Button
            onClick={handleSummarize}
            loading={loading}
            disabled={notes.trim().length < 10}
            className="mt-4 w-full"
          >
            {!loading && <Sparkles className="h-4 w-4" />}
            {loading ? 'Summarizing notes…' : 'Summarize Notes'}
          </Button>
        </Card>

        <Card className="flex flex-col">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Summary</h2>

          {!summary && !loading && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-16 text-center">
              <FileText className="mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">Your structured summary will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center py-16">
              <Sparkles className="mb-3 h-8 w-8 animate-pulse text-blue-400" />
              <p className="text-sm text-slate-400">Analyzing the conversation…</p>
            </div>
          )}

          {summary && !loading && (
            <div className="flex-1 space-y-5">
              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <ListTodo className="h-4 w-4 text-blue-500" /> Key Points
                </h3>
                {summary.keyPoints.length > 0 ? (
                  <ul className="space-y-1.5">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">No general discussion points detected.</p>
                )}
              </section>

              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Decisions Made
                </h3>
                {summary.decisions.length > 0 ? (
                  <ul className="space-y-1.5">
                    {summary.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">No explicit decisions detected.</p>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">Action Items</h3>
                {summary.actionItems.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Task</th>
                          <th className="px-3 py-2 text-left font-medium">Owner</th>
                          <th className="px-3 py-2 text-left font-medium">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {summary.actionItems.map((item, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 text-slate-700">{item.task}</td>
                            <td className="px-3 py-2 text-slate-600">{item.owner}</td>
                            <td className="px-3 py-2">
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                {item.deadline}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No action items detected.</p>
                )}
              </section>

              <section className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                {summary.nextSteps}
              </section>

              <Disclaimer />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
