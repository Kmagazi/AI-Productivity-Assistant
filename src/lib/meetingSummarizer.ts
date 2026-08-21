import { ActionItem, MeetingSummary } from '@/types';

/*
 * Structured prompt engineering: the summarizer is instructed (via these
 * heuristics) to separate meeting notes into four fixed sections — key
 * points, decisions, action items with an owner and deadline, and next
 * steps — mirroring how a well-formed "summarize this meeting" prompt
 * would be scoped for an AI assistant.
 */

const DECISION_KEYWORDS = ['decided', 'agreed', 'approved', 'concluded', 'finalized', 'confirmed that'];
const ACTION_KEYWORDS = ['will ', 'needs to', 'should ', 'to do', 'action item', 'follow up', 'follow-up', 'due ', 'by ', 'must '];
const DEADLINE_PATTERN =
  /\b(today|tomorrow|tonight|eod|end of day|next week|next month|monday|tuesday|wednesday|thursday|friday|saturday|sunday|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}|\d{1,2}\/\d{1,2}(\/\d{2,4})?)\b/i;
const OWNER_PATTERN = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b(?=\s+(?:will|to|needs|should|must))|(?:by|for|assigned to)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/;

function splitIntoSentences(notes: string): string[] {
  return notes
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

function extractDeadline(sentence: string): string {
  const match = sentence.match(DEADLINE_PATTERN);
  return match ? match[0].replace(/^\w/, (c) => c.toUpperCase()) : 'TBD';
}

function extractOwner(sentence: string): string {
  const match = sentence.match(OWNER_PATTERN);
  const name = match?.[1] || match?.[2];
  return name || 'Unassigned';
}

export function summarizeMeetingNotes(notes: string): MeetingSummary {
  const sentences = splitIntoSentences(notes);

  const decisions: string[] = [];
  const actionItems: ActionItem[] = [];
  const keyPoints: string[] = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const isDecision = DECISION_KEYWORDS.some((kw) => lower.includes(kw));
    const isAction = ACTION_KEYWORDS.some((kw) => lower.includes(kw));

    if (isDecision) {
      decisions.push(sentence.replace(/\.$/, ''));
    } else if (isAction) {
      actionItems.push({
        task: sentence.replace(/\.$/, ''),
        owner: extractOwner(sentence),
        deadline: extractDeadline(sentence),
      });
    } else {
      keyPoints.push(sentence.replace(/\.$/, ''));
    }
  }

  const nextSteps =
    actionItems.length > 0
      ? `Schedule a follow-up to review progress on the ${actionItems.length} action item${
          actionItems.length > 1 ? 's' : ''
        } above and confirm any dates marked "TBD".`
      : 'Share this summary with attendees and confirm there are no outstanding follow-ups.';

  return {
    keyPoints: keyPoints.slice(0, 8),
    decisions,
    actionItems,
    nextSteps,
  };
}
