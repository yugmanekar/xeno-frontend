import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, TrendingUp, TrendingDown, Sparkles, ArrowRight, Eye, Zap, Target, BarChart2 } from 'lucide-react';
import { getInsights, getOverview, getRevenueTimeline } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import type { AIInsight, AnalyticsOverview } from '../../types';
import './AIBrain.css';

const INSIGHT_ICONS: Record<string, any> = { warning: AlertTriangle, opportunity: Sparkles, success: TrendingUp, info: Eye };
const INSIGHT_COLORS: Record<string, string> = { warning: 'var(--warning)', opportunity: 'var(--accent-violet)', success: 'var(--success)', info: 'var(--info)' };

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

export default function AIBrain() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getInsights().catch(() => [
        { id: '1', type: 'warning', title: 'Repeat Purchase Rate Declining', description: 'Your repeat customer rate dropped 18% this week compared to last week. 127 VIP customers haven\'t purchased in over 34 days.', value: '-18%', confidence: 0.89, action: 'investigate', actionLabel: 'Investigate' },
        { id: '2', type: 'opportunity', title: 'Festival Season Opportunity', description: 'Based on historical patterns, customers in the "Festival Shopper" segment are 3.2x more likely to purchase this week. Estimated opportunity: ₹3.2L.', value: '₹3.2L', confidence: 0.84, action: 'generate_strategy', actionLabel: 'Generate Strategy' },
        { id: '3', type: 'success', title: 'WhatsApp Campaign Outperforming', description: 'Last WhatsApp campaign achieved 34% CTR, outperforming industry average by 23%.', value: '+23%', confidence: 0.91, action: 'explain', actionLabel: 'Explain Why' },
        { id: '4', type: 'info', title: 'New Segment Discovered', description: 'AI identified "Weekend Impulse Buyers" — 89 customers who primarily purchase on weekends with AOV of ₹2,400.', value: '89', confidence: 0.76, action: 'launch_campaign', actionLabel: 'Launch Campaign' },
      ]),
      getOverview().catch(() => ({
        totalCustomers: 500, totalRevenue: 8420000, avgOrderValue: 2450,
        activeCampaigns: 0, avgEngagement: 52.3, churnRate: 0.34,
        repeatRate: 42, topChannel: 'whatsapp', totalOrders: 2100,
      })),
      getRevenueTimeline().catch(() => [])
    ]).then(([ins, ov, tl]) => {
      setInsights(Array.isArray(ins) ? ins : []);
      setOverview(ov);
      setTimeline(Array.isArray(tl) ? tl : tl?.value || []);
      setLoading(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="brain-greeting">
          <h1 className="brain-hello">{greeting}</h1>
          <p className="brain-date">{today}</p>
        </div>

        {/* Quick Stats */}
        {overview && (
          <div className="brain-stats grid-4">
            {[
              { label: 'Customers', value: overview.totalCustomers, icon: Target, color: 'var(--accent-violet)' },
              { label: 'Revenue', value: overview.totalRevenue, prefix: '₹', icon: TrendingUp, color: 'var(--success)' },
              { label: 'Avg Order', value: overview.avgOrderValue, prefix: '₹', icon: Zap, color: 'var(--info)' },
              { label: 'Repeat Rate', value: overview.repeatRate, suffix: '%', icon: Sparkles, color: 'var(--warning)' },
            ].map((stat, i) => (
              <motion.div key={stat.label} className="stat-card card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <div className="stat-card-header">
                  <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}><stat.icon size={16} /></div>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <div className="stat-value">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics Chart */}
        {!loading && timeline.length > 0 && (
          <div className="brain-section" style={{ marginTop: 32 }}>
            <div className="section-header">
              <BarChart2 size={18} style={{ color: 'var(--accent-violet)' }} />
              <h2 className="section-title">Revenue Trends</h2>
            </div>
            <div className="card" style={{ height: 320, padding: 24 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-violet)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-violet)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(val) => {
                      const d = new Date(val + '-01');
                      return d.toLocaleDateString('en-US', { month: 'short' });
                    }}
                    stroke="var(--text-tertiary)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} 
                    stroke="var(--text-tertiary)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                  />
                  <RechartsTooltip 
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13 }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                    labelFormatter={(val) => {
                      const d = new Date(val + '-01');
                      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent-violet)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="brain-section">
          <div className="section-header" style={{ marginTop: 32 }}>
            <Sparkles size={18} style={{ color: 'var(--accent-violet)' }} />
            <h2 className="section-title">AI Insights</h2>
            <span className="badge badge-accent">Live</span>
          </div>

          {loading ? (
            <div className="grid-2">
              {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 160 }} />)}
            </div>
          ) : (
            <div className="grid-2">
              {insights.map((insight, i) => {
                const Icon = INSIGHT_ICONS[insight.type] || Eye;
                const color = INSIGHT_COLORS[insight.type] || 'var(--info)';
                return (
                  <motion.div key={insight.id} className="insight-card card card-interactive"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                    <div className="insight-accent" style={{ background: color }} />
                    <div className="insight-header">
                      <div className="insight-icon" style={{ background: `${color}15`, color }}><Icon size={16} /></div>
                      <div className="insight-meta">
                        <span className="insight-type" style={{ color }}>{insight.type}</span>
                        <span className="insight-confidence">{Math.round(insight.confidence * 100)}% confidence</span>
                      </div>
                      {insight.value && <span className="insight-value" style={{ color }}>{insight.value}</span>}
                    </div>
                    <h3 className="insight-title">{insight.title}</h3>
                    <p className="insight-desc">{insight.description}</p>
                    <button className="btn btn-ghost btn-sm insight-action" style={{ color }}>
                      {insight.actionLabel} <ArrowRight size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
