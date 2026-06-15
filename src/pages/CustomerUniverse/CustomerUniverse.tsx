import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, TrendingDown, TrendingUp, Star } from 'lucide-react';
import { getCustomers, getPersonas } from '../../services/api';
import type { Customer, PersonaGroup } from '../../types';
import './CustomerUniverse.css';

const PERSONA_COLORS: Record<string, string> = {
  'High Lifetime VIP': '#f59e0b', 'Luxury Fashion Enthusiast': '#7c3aed',
  'Festival Shopper': '#ef4444', 'Impulse Buyer': '#3b82f6',
  'Returning Parent': '#10b981', 'Weekend Coffee Lover': '#06b6d4',
  'Budget Student': '#8b5cf6', 'Dormant Risk': '#6b7280',
};

export default function CustomerUniverse() {
  const [tab, setTab] = useState<'personas' | 'explorer'>('personas');
  const [personas, setPersonas] = useState<PersonaGroup[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPersonas().then(setPersonas).catch(() => {});
    getCustomers('limit=50').then(d => {
      setCustomers(d.customers || []);
      setTotal(d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const doSearch = () => {
    setLoading(true);
    getCustomers(`limit=50&search=${encodeURIComponent(search)}`).then(d => {
      setCustomers(d.customers || []);
      setTotal(d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="page-title">Customer Universe</h1>
          <p className="page-subtitle">AI-powered customer intelligence and persona analysis</p>
        </div>

        <div className="tabs" style={{ marginBottom: 24 }}>
          <button className={`tab ${tab === 'personas' ? 'active' : ''}`} onClick={() => setTab('personas')}>AI Personas</button>
          <button className={`tab ${tab === 'explorer' ? 'active' : ''}`} onClick={() => setTab('explorer')}>Explorer</button>
        </div>

        {tab === 'personas' && (
          <div className="grid-3">
            {personas.map((p, i) => {
              const color = PERSONA_COLORS[p.persona] || '#6b7280';
              return (
                <motion.div key={p.persona} className="card card-interactive persona-card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
                  <div className="persona-header">
                    <div className="avatar avatar-lg" style={{ background: `${color}25`, color }}>{p.persona[0]}</div>
                    <div>
                      <h3 className="persona-name">{p.persona}</h3>
                      <span className="text-sm text-secondary">{p.count} customers</span>
                    </div>
                  </div>
                  <div className="persona-stats">
                    <div className="persona-stat">
                      <span className="persona-stat-label">Avg Spend</span>
                      <span className="persona-stat-value">₹{Math.round(p.avgSpend).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="persona-stat">
                      <span className="persona-stat-label">Engagement</span>
                      <span className="persona-stat-value">{Math.round(p.avgEngagement)}%</span>
                    </div>
                    <div className="persona-stat">
                      <span className="persona-stat-label">Churn Risk</span>
                      <span className="persona-stat-value" style={{ color: p.avgChurn > 0.5 ? 'var(--error)' : p.avgChurn > 0.3 ? 'var(--warning)' : 'var(--success)' }}>
                        {Math.round(p.avgChurn * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === 'explorer' && (
          <>
            <div className="explorer-search">
              <Search size={16} />
              <input className="input" placeholder="Search customers by name, email, or location..."
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()} />
              <span className="text-sm text-tertiary">{total} customers</span>
            </div>

            <div className="explorer-list">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 8, borderRadius: 'var(--radius-md)' }} />)
              ) : customers.map((c, i) => (
                <motion.div key={c.id} className="customer-row card-interactive"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <div className="avatar" style={{ background: `${PERSONA_COLORS[c.persona] || '#6b7280'}25`, color: PERSONA_COLORS[c.persona] || '#6b7280' }}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="customer-info">
                    <span className="customer-name">{c.name}</span>
                    <span className="customer-detail">{c.email} · {c.location}</span>
                  </div>
                  <span className="badge badge-neutral" style={{ borderColor: `${PERSONA_COLORS[c.persona]}40`, color: PERSONA_COLORS[c.persona] }}>
                    {c.persona}
                  </span>
                  <div className="customer-metric">
                    <span className="text-xs text-tertiary">Spend</span>
                    <span className="text-sm font-medium">₹{Math.round(c.total_spend).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="customer-metric">
                    <span className="text-xs text-tertiary">Engagement</span>
                    <div className="engagement-bar">
                      <div className="engagement-fill" style={{ width: `${c.engagement_score}%`, background: c.engagement_score > 60 ? 'var(--success)' : c.engagement_score > 30 ? 'var(--warning)' : 'var(--error)' }} />
                    </div>
                  </div>
                  <div className="customer-metric">
                    <span className="text-xs text-tertiary">Churn</span>
                    {c.predicted_churn > 0.5 ? <TrendingDown size={14} color="var(--error)" /> : <TrendingUp size={14} color="var(--success)" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
