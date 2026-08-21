import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Disclaimer from '@/components/ui/Disclaimer';
import { generateChatReply } from '@/lib/chatbot';
import { simulateLatency } from '@/lib/simulateLatency';
import { ChatMessage } from '@/types';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm your workplace productivity assistant. Ask me about drafting emails, summarizing meetings, planning your tasks, or researching a topic.",
};

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    const turnCount = messages.filter((m) => m.role === 'user').length;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    const reply = await simulateLatency(() => generateChatReply(text, turnCount), 500, 1100);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
    setTyping(false);
  };

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <PageHeader
        icon={MessageSquare}
        title="AI Chatbot"
        description="Ask a question or describe what you're working on — I'll help or point you to the right tool."
      />

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your workday…"
              className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <Disclaimer />
      </div>
    </div>
  );
}
