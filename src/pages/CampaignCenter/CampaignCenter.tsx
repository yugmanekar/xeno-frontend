import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Rocket, Plus, Zap, Send, CheckCircle, XCircle, Eye, MousePointer, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { getCampaigns, createCampaign, launchCampaign } from '../../services/api';
import { useSocketEvent } from '../../services/socket';
import type { Campaign } from '../../types';
import './CampaignCenter.css';

const STATUS_COLORS: Record<string, string> = {
  draft: 'var(--text-tertiary)', active: 'var(--info)', completed: 'var(--success)', failed: 'var(--error)',
  queued: 'var(--text-tertiary)', sending: 'var(--info)', sent: 'var(--accent-cyan)', delivered: 'var(--success)',
  read: 'var(--success)', opened: 'var(--accent-violet)', clicked: 'var(--accent-blue)', converted: 'var(--warning)',
};

const STATUS_ICONS: Record<string, any> = {
  queued: Clock, sending: Send, sent: CheckCircle, delivered: CheckCircle,
  opened: Eye, clicked: MousePointer, converted: ShoppingBag, failed: XCircle,
};

export default function CampaignCenter() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', segmentQuery: '', channel: 'whatsapp', tone: 'friendly', audienceSize: 100 });

  const loadCampaigns = () => {
    getCampaigns().then(c => { setCampaigns(c); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleDeliveryUpdate = useCallback((data: any) => {
    setEvents(prev => [{ ...data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
    loadCampaigns();
  }, []);

  useSocketEvent('delivery-update', handleDeliveryUpdate);
  useSocketEvent('campaign-update', useCallback(() => loadCampaigns(), []));

  const handleCreate = async () => {
    try {
      const res = await createCampaign(form);
      setShowBuilder(false);
      loadCampaigns();
    } catch {}
  };

  const handleLaunch = async (id: string) => {
    try {
      await launchCampaign(id);
      loadCampaigns();
    } catch {}
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Campaign Center</h1>
            <p className="page-subtitle">Live campaign dashboard with real-time delivery tracking</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowBuilder(true)}><Plus size={16} /> New Campaign</button>
        </div>

        <div className="campaign-layout">
          <div className="campaign-list">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 160, marginBottom: 12, borderRadius: 'var(--radius-lg)' }} />)
            ) : campaigns.length === 0 ? (
              <div className="empty-state"><Rocket size={40} /><p>No campaigns yet. Create your first AI-powered campaign.</p></div>
            ) : campaigns.map((c, i) => {
              const stats = c.deliveryStats || { total: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, failed: 0 };
              const progress = stats.total ? Math.round(((stats.delivered + stats.opened + stats.clicked + stats.converted) / stats.total) * 100) : 0;

              return (
                <motion.div key={c.id} className="campaign-card card"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <div className="campaign-card-header">
                    <div>
                      <h3 className="campaign-name">{c.name}</h3>
                      <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                        <span className="badge" style={{ background: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status], borderColor: `${STATUS_COLORS[c.status]}30` }}>
                          {c.status}
                        </span>
                        <span className="badge badge-neutral">{c.channel}</span>
                        <span className="text-xs text-tertiary">{c.audience_size} recipients</span>
                      </div>
                    </div>
                    {c.status === 'draft' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleLaunch(c.id)}>
                        <Rocket size={14} /> Launch
                      </button>
                    )}
                  </div>

                  {stats.total > 0 && (
                    <div className="campaign-stats">
                      <div className="campaign-progress">
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                        <span className="text-xs text-tertiary">{progress}% delivered</span>
                      </div>
                      <div className="delivery-stats">
                        {[
                          { label: 'Delivered', value: stats.delivered, color: 'var(--success)' },
                          { label: 'Opened', value: stats.opened, color: 'var(--accent-violet)' },
                          { label: 'Clicked', value: stats.clicked, color: 'var(--info)' },
                          { label: 'Converted', value: stats.converted, color: 'var(--warning)' },
                          { label: 'Failed', value: stats.failed, color: 'var(--error)' },
                        ].map(s => (
                          <div key={s.label} className="delivery-stat">
                            <span className="delivery-stat-value" style={{ color: s.color }}>{s.value}</span>
                            <span className="delivery-stat-label">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Live event stream */}
          <div className="event-stream">
            <h3 className="flex items-center gap-2 text-sm font-semibold" style={{ marginBottom: 12 }}>
              <Zap size={14} color="var(--accent-violet)" /> Live Events
              {events.length > 0 && <span className="badge badge-accent badge-pulse">{events.length}</span>}
            </h3>
            <div className="event-stream-list">
              {events.length === 0 ? (
                <p className="text-sm text-tertiary" style={{ padding: 16 }}>Events will appear here when a campaign is running...</p>
              ) : events.map((e, i) => {
                const Icon = STATUS_ICONS[e.status] || Zap;
                return (
                  <motion.div key={`${e.deliveryId}-${e.status}-${i}`} className="stream-event"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <Icon size={12} color={STATUS_COLORS[e.status]} />
                    <span className="text-xs" style={{ color: STATUS_COLORS[e.status] }}>{e.status}</span>
                    <span className="text-xs text-muted">{e.channel}</span>
                    <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>{e.time}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Campaign Builder Modal */}
        {showBuilder && (
          <div className="modal-overlay" onClick={() => setShowBuilder(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 32 }}>
              <h2 className="text-xl font-semibold" style={{ marginBottom: 24 }}>Create Campaign</h2>
              <div className="flex-col gap-4">
                <div>
                  <label className="text-sm text-secondary" style={{ marginBottom: 4, display: 'block' }}>Campaign Name</label>
                  <input className="input" placeholder="Summer Sale Reactivation" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-secondary" style={{ marginBottom: 4, display: 'block' }}>Target Audience (natural language)</label>
                  <input className="input" placeholder="VIP customers who haven't purchased in 30 days" value={form.segmentQuery} onChange={e => setForm(f => ({ ...f, segmentQuery: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-secondary" style={{ marginBottom: 8, display: 'block' }}>Channel</label>
                  <div className="flex gap-2">
                    {['whatsapp', 'sms', 'email', 'push'].map(ch => (
                      <button key={ch} className={`chip ${form.channel === ch ? 'active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, channel: ch }))}>{ch}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary" style={{ marginBottom: 8, display: 'block' }}>Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {['friendly', 'formal', 'luxury', 'funny', 'emotional', 'minimal'].map(t => (
                      <button key={t} className={`chip ${form.tone === t ? 'active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, tone: t }))}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2" style={{ marginTop: 8 }}>
                  <button className="btn btn-primary flex-1" onClick={handleCreate}>
                    <Sparkles size={16} /> Create with AI
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowBuilder(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
