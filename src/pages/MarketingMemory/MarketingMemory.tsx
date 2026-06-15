import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Brain, Rocket, BarChart3, Lightbulb, Users } from 'lucide-react';
import { getMemories, getMemorySummary } from '../../services/api';
import type { AIMemory } from '../../types';
import './MarketingMemory.css';

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  insight: { icon: Lightbulb, color: 'var(--warning)', label: 'Insight' },
  strategy: { icon: Brain, color: 'var(--accent-violet)', label: 'Strategy' },
  campaign_result: { icon: Rocket, color: 'var(--info)', label: 'Campaign' },
  channel_performance: { icon: BarChart3, color: 'var(--success)', label: 'Channel' },
  customer_behavior: { icon: Users, color: 'var(--accent-cyan)', label: 'Behavior' },
};

export default function MarketingMemory() {
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getMemories(filter || undefined).then(m => { setMemories(m); setLoading(false); }).catch(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    getMemorySummary().then(setSummary).catch(() => {});
  }, []);

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="page-title">Marketing Memory</h1>
          <p className="page-subtitle">The AI's accumulated knowledge and learnings</p>
        </div>

        {summary && (
          <div className="memory-summary card" style={{ marginBottom: 24 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <Brain size={16} color="var(--accent-violet)" />
              <span className="text-md font-semibold">AI Knowledge Base</span>
            </div>
            <div className="grid-4">
              <div className="mini-stat"><span className="mini-label">Total Memories</span><span className="mini-value">{summary.totalMemories}</span></div>
              <div className="mini-stat"><span className="mini-label">Avg Confidence</span><span className="mini-value">{Math.round(summary.avgConfidence * 100)}%</span></div>
              {summary.topLearnings?.slice(0, 2).map((l: any, i: number) => (
                <div key={i} className="mini-stat"><span className="mini-label">{l.impact} impact</span><span className="mini-value text-sm">{l.title.slice(0, 30)}...</span></div>
              ))}
            </div>
          </div>
        )}

        <div className="memory-filters">
          <button className={`chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
          {Object.entries(TYPE_CONFIG).map(([key, val]) => (
            <button key={key} className={`chip ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{val.label}</button>
          ))}
        </div>

        <div className="memory-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton skeleton-card" />)
          ) : memories.length === 0 ? (
            <div className="empty-state"><Database size={40} /><p>Your AI is still learning. Launch campaigns to build memory.</p></div>
          ) : memories.map((m, i) => {
            const config = TYPE_CONFIG[m.type] || TYPE_CONFIG.insight;
            const Icon = config.icon;
            const isExpanded = expanded === m.id;

            return (
              <motion.div key={m.id} className="memory-card card card-interactive"
                onClick={() => setExpanded(isExpanded ? null : m.id)}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <div className="memory-card-header">
                  <div className="memory-type-badge" style={{ background: `${config.color}15`, color: config.color }}>
                    <Icon size={12} /> {config.label}
                  </div>
                  <span className="memory-confidence">
                    <span className="confidence-bar"><span className="confidence-fill" style={{ width: `${m.confidence * 100}%`, background: config.color }} /></span>
                    {Math.round(m.confidence * 100)}%
                  </span>
                </div>
                <h3 className="memory-title">{m.title}</h3>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <p className="memory-content">{m.content}</p>
                    <div className="memory-meta">
                      <span className="badge badge-neutral">{m.source}</span>
                      <span className="badge" style={{ background: m.impact === 'high' ? 'var(--success-bg)' : 'var(--warning-bg)', color: m.impact === 'high' ? 'var(--success)' : 'var(--warning)' }}>
                        {m.impact} impact
                      </span>
                      <span className="text-xs text-muted">{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
