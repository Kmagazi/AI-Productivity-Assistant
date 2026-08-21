import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
      <p>AI-generated content may require human review.</p>
    </div>
  );
}
