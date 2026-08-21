import { Audience, EmailInput, EmailOutput, EmailPurpose, Tone } from '@/types';

/*
 * Structured prompt engineering: each generated email is assembled from a
 * "prompt" built out of audience, tone and purpose so the AI-style output
 * consistently matches who it's for, how it should sound, and why it's being sent.
 */

const GREETINGS: Record<Audience, (name: string) => string> = {
  Client: (name) => `Dear ${name || 'Valued Client'},`,
  Manager: (name) => `Hi ${name || 'there'},`,
  Colleague: (name) => `Hi ${name || 'there'},`,
  Team: () => 'Hi team,',
  Executive: (name) => `Dear ${name || 'there'},`,
  Vendor: (name) => `Hello ${name || 'there'},`,
  'Job Applicant': (name) => `Dear ${name || 'Applicant'},`,
  'Customer Support': (name) => `Hello ${name || 'there'},`,
};

const OPENERS: Record<EmailPurpose, string> = {
  'Follow-up': "I wanted to follow up on our previous conversation and check on where things stand.",
  Request: "I'm reaching out to ask for your help with something.",
  Introduction: "I hope this message finds you well — I wanted to take a moment to introduce myself.",
  Apology: 'I want to sincerely apologize for the trouble this may have caused.',
  'Thank You': 'I wanted to take a moment to say thank you.',
  'Meeting Request': "I'd like to find some time to connect and discuss the details below.",
  'Status Update': "I wanted to share a quick update on where things currently stand.",
  Proposal: "I'm writing to share a proposal I believe could add real value.",
};

const TONE_FLAVOR: Record<Tone, { opener: string; closer: string }> = {
  Formal: {
    opener: 'I trust this email finds you well.',
    closer: 'Please let me know if you require any further information.',
  },
  Professional: {
    opener: '',
    closer: 'Please let me know if you have any questions.',
  },
  Friendly: {
    opener: 'Hope you have been doing well!',
    closer: "Feel free to reach out anytime — happy to chat further.",
  },
  Persuasive: {
    opener: '',
    closer: 'I believe this could make a real difference, and I would love to hear your thoughts.',
  },
  Apologetic: {
    opener: '',
    closer: 'Thank you for your patience and understanding on this.',
  },
  Urgent: {
    opener: 'As this is time-sensitive, I wanted to flag it right away.',
    closer: 'I would appreciate a response at your earliest convenience.',
  },
  Assertive: {
    opener: '',
    closer: 'I look forward to your confirmation.',
  },
};

const SIGN_OFFS: Record<Tone, string> = {
  Formal: 'Kind regards,',
  Professional: 'Best regards,',
  Friendly: 'Cheers,',
  Persuasive: 'Best,',
  Apologetic: 'With apologies,',
  Urgent: 'Thank you,',
  Assertive: 'Regards,',
};

function toBulletParagraph(keyPoints: string): string {
  const points = keyPoints
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  if (points.length === 0) return '';
  if (points.length === 1) return points[0].endsWith('.') ? points[0] : `${points[0]}.`;

  return points.map((p) => `  • ${p}`).join('\n');
}

function buildSubject(purpose: EmailPurpose, keyPoints: string): string {
  const firstPoint = keyPoints.split('\n').map((p) => p.trim()).filter(Boolean)[0];
  const topic = firstPoint ? firstPoint.slice(0, 60) : purpose;

  const prefixes: Record<EmailPurpose, string> = {
    'Follow-up': 'Following up:',
    Request: 'Request:',
    Introduction: 'Introduction:',
    Apology: 'Apology regarding',
    'Thank You': 'Thank you for',
    'Meeting Request': 'Meeting request:',
    'Status Update': 'Status update:',
    Proposal: 'Proposal:',
  };

  return `${prefixes[purpose]} ${topic}`;
}

export function generateEmail(input: EmailInput): EmailOutput {
  const { senderName, recipientName, audience, tone, purpose, keyPoints } = input;

  const greeting = GREETINGS[audience](recipientName.trim());
  const flavor = TONE_FLAVOR[tone];
  const opener = [flavor.opener, OPENERS[purpose]].filter(Boolean).join(' ');
  const bulletBlock = toBulletParagraph(keyPoints);

  const bodyMiddle = bulletBlock
    ? bulletBlock.includes('\n')
      ? `Here is a summary of the key points:\n\n${bulletBlock}`
      : bulletBlock
    : '';

  const paragraphs = [greeting, '', opener];
  if (bodyMiddle) paragraphs.push('', bodyMiddle);
  paragraphs.push('', flavor.closer, '', SIGN_OFFS[tone], senderName.trim() || '[Your Name]');

  return {
    subject: buildSubject(purpose, keyPoints),
    body: paragraphs.join('\n'),
  };
}
