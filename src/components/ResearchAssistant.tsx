import { useState } from 'react';
import { Search, Sparkles, Lightbulb, ShieldAlert, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Disclaimer from '@/components/ui/Disclaimer';
import { generateResearchSummary } from '@/lib/researchAssistant';
import { simulateLatency } from '@/lib/simulateLatency';
import { ResearchFocus, ResearchOutput } from '@/types';

const FOCUS_OPTIONS: { key: keyof ResearchFocus; label: string }[] = [
  { key: 'marketTrends', label: 'Market Trends' },
  { key: 'competitors', label: 'Competitors' },
  { key: 'bestPractices', label: 'Best Practices' },
  { key: 'statistics', label: 'Statistics' },
  { key: 'risks', label: 'Risks' },
];

const initialFocus: ResearchFocus = {
  marketTrends: true,
  competitors: false,
  bestPractices: true,
  statistics: false,
  risks: false,
};

export default function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [focus, setFocus] = useState<ResearchFocus>(initialFocus);
  const [output, setOutput] = useState<ResearchOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleFocus = (key: keyof ResearchFocus) => {
    setFocus({ ...focus, [key]: !focus[key] });
  };

  const handleResearch = async () => {
    setLoading(true);
    const result = await simulateLatency(() => generateResearchSummary(topic, focus));
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Give it a topic and the angles you care about, and get a structured, decision-ready summary back."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Research Request</h2>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">Topic or Question</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Adopting a four-day work week for a 50-person team"
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">Focus Areas</label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleFocus(key)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  focus[key]
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            onClick={handleResearch}
            loading={loading}
            disabled={topic.trim().length < 3}
            className="mt-5 w-full"
          >
            {!loading && <Sparkles className="h-4 w-4" />}
            {loading ? 'Researching…' : 'Generate Research Summary'}
          </Button>
        </Card>

        <Card className="flex flex-col">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Summary</h2>

          {!output && !loading && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-16 text-center">
              <Search className="mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">Your research summary will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center py-16">
              <Sparkles className="mb-3 h-8 w-8 animate-pulse text-blue-400" />
              <p className="text-sm text-slate-400">Synthesizing insights…</p>
            </div>
          )}

          {output && !loading && (
            <div className="flex-1 space-y-5">
              <p className="text-sm leading-relaxed text-slate-600">{output.overview}</p>

              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <Lightbulb className="h-4 w-4 text-blue-500" /> Key Insights
                </h3>
                <ul className="space-y-1.5">
                  {output.insights.map((insight, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <ShieldAlert className="h-4 w-4 text-amber-500" /> Considerations
                </h3>
                <ul className="space-y-1.5">
                  {output.considerations.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">Suggested Next Steps</h3>
                <ul className="space-y-1.5">
                  {output.nextSteps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                      {step}
                    </li>
                  ))}
                </ul>
              </section>

              <Disclaimer />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
