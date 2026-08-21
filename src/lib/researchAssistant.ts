import { ResearchFocus, ResearchOutput } from '@/types';

/*
 * Structured prompt engineering: the requested focus areas act as explicit
 * prompt instructions ("cover market trends, risks, ..."), so the assistant
 * only produces sections the user actually asked for.
 */

const FOCUS_INSIGHTS: Record<keyof ResearchFocus, (topic: string) => string> = {
  marketTrends: (topic) =>
    `Interest in ${topic} has been shaped by shifting customer expectations and growing digital adoption across the industry.`,
  competitors: (topic) =>
    `Organizations leading on ${topic} tend to differentiate through faster execution, clearer communication, and tighter feedback loops with customers.`,
  bestPractices: (topic) =>
    `Common best practices around ${topic} include setting measurable success criteria up front, iterating based on real feedback, and aligning stakeholders early.`,
  statistics: (topic) =>
    `Quantitative benchmarks for ${topic} — adoption rates, cost impact, time-to-value — should be pulled from recent, dated industry reports rather than assumed.`,
  risks: (topic) =>
    `Key risks tied to ${topic} typically include implementation complexity, resistance to change, and misaligned expectations across teams.`,
};

const DEFAULT_INSIGHTS = (topic: string) => [
  `${topic} touches multiple parts of the business, so framing the specific decision it needs to support will make the research far more actionable.`,
  `A quick scan of recent, credible sources is the fastest way to separate durable facts about ${topic} from short-lived opinions.`,
  `Involving one or two stakeholders early tends to surface blind spots that a solo review of ${topic} would miss.`,
];

export function generateResearchSummary(topic: string, focus: ResearchFocus): ResearchOutput {
  const cleanTopic = topic.trim() || 'this topic';

  const selectedInsights = (Object.keys(focus) as (keyof ResearchFocus)[])
    .filter((key) => focus[key])
    .map((key) => FOCUS_INSIGHTS[key](cleanTopic));

  const insights = selectedInsights.length > 0 ? selectedInsights : DEFAULT_INSIGHTS(cleanTopic);

  return {
    overview: `Here is a structured research summary on "${cleanTopic}", organized to support quick decision-making rather than deep academic review.`,
    insights,
    considerations: [
      'Treat this as a starting point — validate key claims against primary sources or subject-matter experts before acting on them.',
      `Facts about ${cleanTopic} can shift quickly; prioritize sources published within the last 6–12 months.`,
    ],
    nextSteps: [
      'Define the specific decision or question this research needs to support.',
      'Identify two to three credible, recent sources to verify the insights above.',
      'Share the findings with relevant stakeholders and capture their reactions before finalizing next steps.',
    ],
  };
}
