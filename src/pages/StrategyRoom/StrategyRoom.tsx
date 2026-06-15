import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, BarChart3 } from 'lucide-react';
import { askStrategy } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AIStream from '../../components/AIStream/AIStream';
import type { StrategyResponse } from '../../types';
import './StrategyRoom.css';

interface Message { role: 'user' | 'ai'; content: string; data?: StrategyResponse; }

const SUGGESTIONS = [
  'How do I increase repeat purchases?',
  'Which customer segments are most valuable?',
  'What campaign should I run this week?',
  'Why are customers churning?',
  'How do I improve customer engagement?',
];

export default function StrategyRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestData, setLatestData] = useState<StrategyResponse | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (q?: string) => {
    const question = q || input;
    if (!question.trim() || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await askStrategy(question);
      const aiContent = res.analysis + '\n\n' +
        (res.problems?.length ? '**Key Problems:**\n' + res.problems.map((p: string) => `• ${p}`).join('\n') + '\n\n' : '') +
        (res.recommendations?.length ? '**Recommendations:**\n' + res.recommendations.map((r: any) =>
          `→ ${r.title}: ${r.description} (Impact: ${r.estimatedImpact}, Confidence: ${Math.round(r.confidence * 100)}%)`
        ).join('\n\n') : '');

      setMessages(prev => [...prev, { role: 'ai', content: aiContent, data: res }]);
      setLatestData(res);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'I apologize, but I encountered an error analyzing your data. Please try rephrasing your question.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="page-container strategy-room">
      <div className="page-header">
        <h1 className="page-title">AI Strategy Room</h1>
        <p className="page-subtitle">Your autonomous marketing strategist</p>
      </div>

      <div className="strategy-layout">
        <div className="strategy-chat">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <Sparkles size={32} color="var(--accent-violet)" style={{ marginBottom: 16 }} />
                <h3>Ask me anything about your business</h3>
                <p className="text-secondary text-sm">I'll analyze your customer data and provide actionable strategies.</p>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="chip" onClick={() => handleSend(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <motion.div key={i} className={`chat-msg ${m.role}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {m.role === 'ai' ? <AIStream content={m.content} /> : <span>{m.content}</span>}
              </motion.div>
            ))}
            {loading && (
              <div className="chat-msg ai">
                <div className="flex items-center gap-2 text-tertiary text-sm">
                  <div className="spinner" /> Analyzing your data...
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="chat-input-wrapper">
            <input className="chat-input input" placeholder="Ask your AI strategist..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <button className="btn btn-primary" onClick={() => handleSend()} disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="strategy-context">
          <div className="context-panel card">
            <h3 className="flex items-center gap-2 text-md font-semibold" style={{ marginBottom: 16 }}>
              <BarChart3 size={16} color="var(--accent-blue)" /> Context
            </h3>
            {latestData?.chartData ? (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latestData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                    <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="rate" stroke="var(--accent-violet)" strokeWidth={3} dot={{ fill: 'var(--accent-violet)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 32 }}>
                <p className="text-sm text-tertiary">Charts and data will appear here as you chat with the AI strategist.</p>
              </div>
            )}

            {latestData?.recommendations && (
              <div style={{ marginTop: 16 }}>
                <h4 className="text-sm font-semibold" style={{ marginBottom: 8 }}>Top Strategies</h4>
                {latestData.recommendations.map((r, i) => (
                  <div key={i} className="context-strategy">
                    <span className="text-sm">{r.title}</span>
                    <span className="badge badge-accent">{r.estimatedImpact}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
