import { useState } from 'react';
import { Mail, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Disclaimer from '@/components/ui/Disclaimer';
import { generateEmail } from '@/lib/emailGenerator';
import { simulateLatency } from '@/lib/simulateLatency';
import { Audience, EmailInput, EmailOutput, EmailPurpose, Tone } from '@/types';

const AUDIENCES: Audience[] = ['Client', 'Manager', 'Colleague', 'Team', 'Executive', 'Vendor', 'Job Applicant', 'Customer Support'];
const TONES: Tone[] = ['Formal', 'Professional', 'Friendly', 'Persuasive', 'Apologetic', 'Urgent', 'Assertive'];
const PURPOSES: EmailPurpose[] = ['Follow-up', 'Request', 'Introduction', 'Apology', 'Thank You', 'Meeting Request', 'Status Update', 'Proposal'];

const initialInput: EmailInput = {
  senderName: '',
  recipientName: '',
  audience: 'Client',
  tone: 'Professional',
  purpose: 'Follow-up',
  keyPoints: '',
};

export default function EmailGenerator() {
  const [input, setInput] = useState<EmailInput>(initialInput);
  const [output, setOutput] = useState<EmailOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    const result = await simulateLatency(() => generateEmail(input));
    setOutput(result);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(`Subject: ${output.subject}\n\n${output.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = input.keyPoints.trim().length > 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Draft polished, tone-appropriate emails in seconds — set the audience and tone, add your key points, and let AI handle the wording."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Details</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Name</label>
                <input
                  type="text"
                  value={input.senderName}
                  onChange={(e) => setInput({ ...input, senderName: e.target.value })}
                  placeholder="Jordan Lee"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Recipient Name</label>
                <input
                  type="text"
                  value={input.recipientName}
                  onChange={(e) => setInput({ ...input, recipientName: e.target.value })}
                  placeholder="Sam Rivera"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Audience</label>
                <select
                  value={input.audience}
                  onChange={(e) => setInput({ ...input, audience: e.target.value as Audience })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {AUDIENCES.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tone</label>
                <select
                  value={input.tone}
                  onChange={(e) => setInput({ ...input, tone: e.target.value as Tone })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Purpose</label>
              <select
                value={input.purpose}
                onChange={(e) => setInput({ ...input, purpose: e.target.value as EmailPurpose })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {PURPOSES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Key Points</label>
              <textarea
                value={input.keyPoints}
                onChange={(e) => setInput({ ...input, keyPoints: e.target.value })}
                placeholder={'One point per line, e.g.\nProject is on track for Friday\nNeed sign-off on the new budget'}
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <Button onClick={handleGenerate} loading={loading} disabled={!canGenerate} className="w-full">
              {!loading && <Sparkles className="h-4 w-4" />}
              {loading ? 'Generating email…' : 'Generate Email'}
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Generated Draft</h2>
            {output && (
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Regenerate"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {!output && !loading && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-16 text-center">
              <Mail className="mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">Your generated email will appear here.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center py-16">
              <Sparkles className="mb-3 h-8 w-8 animate-pulse text-blue-400" />
              <p className="text-sm text-slate-400">Drafting your email…</p>
            </div>
          )}

          {output && !loading && (
            <div className="flex-1 space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Subject</p>
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">{output.subject}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Body</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-700">
                  {output.body}
                </pre>
              </div>
              <Disclaimer />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
