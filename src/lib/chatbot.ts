/*
 * Structured prompt engineering: the assistant is scoped to workplace
 * productivity — it recognizes intent keywords and routes the reply toward
 * the relevant tool, falling back to general guidance otherwise.
 */

interface Intent {
  keywords: string[];
  reply: string;
}

const INTENTS: Intent[] = [
  {
    keywords: ['email', 'write to', 'reply to', 'message my'],
    reply:
      "For drafting emails, the Email Generator tab can help — pick an audience and tone, add a few key points, and it'll structure the whole message for you. What's the email about?",
  },
  {
    keywords: ['meeting', 'notes', 'minutes', 'action item'],
    reply:
      'Paste your raw meeting notes into the Meeting Notes tab and I\'ll pull out the key points, decisions, and action items with owners and deadlines automatically.',
  },
  {
    keywords: ['task', 'schedule', 'prioriti', 'plan my day', 'to-do', 'todo'],
    reply:
      "The Task Planner tab can rank your tasks by urgency and importance and lay out a realistic day-by-day schedule. Add your tasks there and I'll generate the plan.",
  },
  {
    keywords: ['research', 'summarize', 'insight', 'analyze', 'trend'],
    reply:
      'For research, head to the Research Assistant tab — give me a topic and the angles you care about (trends, risks, best practices) and I\'ll put together a structured summary.',
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    reply: "Hi! I'm your workplace productivity assistant. Ask me about emails, meeting notes, task planning, or research — or tell me what you're working on.",
  },
  {
    keywords: ['thank'],
    reply: "You're welcome! Let me know if there's anything else you'd like help with today.",
  },
];

const FALLBACKS = [
  "I can help with emails, meeting notes, task planning, and research summaries. Which one sounds closest to what you need?",
  "That's outside what I can act on directly, but I'm great with workplace tasks like drafting emails, summarizing meetings, planning your day, or researching a topic. Want to try one of those?",
  "Tell me a bit more about the task — is it about writing something, summarizing something, planning your time, or researching a topic?",
];

export function generateChatReply(message: string, turnCount: number): string {
  const lower = message.toLowerCase();

  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return intent.reply;
    }
  }

  return FALLBACKS[turnCount % FALLBACKS.length];
}
