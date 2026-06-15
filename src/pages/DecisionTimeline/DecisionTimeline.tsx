import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Rocket, Brain, Zap, Settings, Eye } from 'lucide-react';
import { getEvents } from '../../services/api';
import type { XenoEvent } from '../../types';
import './DecisionTimeline.css';

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  campaign: { icon: Rocket, color: 'var(--accent-violet)' },
  ai_decision: { icon: Brain, color: 'var(--info)' },
  insight: { icon: Zap, color: 'var(--warning)' },
  system: { icon: Settings, color: 'var(--text-tertiary)' },
  delivery: { icon: Eye, color: 'var(--success)' },
};

export default function DecisionTimeline() {
  const [events, setEvents] = useState<XenoEvent[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents(100, filter || undefined).then(e => { setEvents(e); setLoading(false); }).catch(() => setLoading(false));
  }, [filter]);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="page-title">Decision Timeline</h1>
          <p className="page-subtitle">Every action, decision, and event in your marketing system</p>
        </div>

        <div className="timeline-filters">
          <button className={`chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
          {Object.keys(TYPE_CONFIG).map(t => (
            <button key={t} className={`chip ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t.replace('_', ' ')}</button>
          ))}
        </div>

        <div className="timeline">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12, borderRadius: 'var(--radius-md)' }} />)
          ) : events.length === 0 ? (
            <div className="empty-state"><Clock size={40} /><p>No events yet. Events will appear as you use the system.</p></div>
          ) : events.map((event, i) => {
            const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <motion.div key={event.id} className="timeline-item"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <div className="timeline-line" />
                <div className="timeline-dot" style={{ background: config.color }} />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <Icon size={14} color={config.color} />
                    <span className="timeline-title">{event.title}</span>
                    <span className="timeline-time">{formatTime(event.created_at)}</span>
                  </div>
                  {event.description && <p className="timeline-desc">{event.description}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
