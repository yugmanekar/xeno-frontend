import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Users, Target, AlertTriangle, ArrowRight, Loader } from 'lucide-react';
import { parseSegment, whatIf } from '../../services/api';
import AIStream from '../../components/AIStream/AIStream';
import type { SegmentParseResult } from '../../types';
import './GrowthLab.css';

const SUGGESTIONS = [
  'Customers who spent more than ₹8000 in the last 90 days but haven\'t purchased recently',
  'VIP customers showing signs of churn',
  'Young customers in Mumbai who prefer WhatsApp',
  'High-value customers who only buy during festivals',
  'Dormant customers who last purchased over 60 days ago',
];

export default function GrowthLab() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SegmentParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(15);
  const [channel, setChannel] = useState('whatsapp');
  const [whatIfResult, setWhatIfResult] = useState<any>(null);

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLoading(true);
    setResult(null);
    try {
      const res = await parseSegment(searchQuery);
      setResult(res);
      runWhatIf(res.estimatedSize);
    } catch { setResult({ reasoning: 'Could not parse query. Try being more specific about customer attributes like spend, location, age, or purchase recency.', logic: { conditions: [] }, sql: '', estimatedSize: 0, expectedConversion: 0, risk: 'medium' }); }
    setLoading(false);
  };

  const runWhatIf = async (audience?: number) => {
    try {
      const res = await whatIf({ discount, channel, audienceSize: audience || result?.estimatedSize || 100, currentCtr: 0.15 });
      setWhatIfResult(res);
    } catch {}
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="page-title">Growth Lab</h1>
          <p className="page-subtitle">Natural language customer segmentation & campaign simulation</p>
        </div>

        <div className="growth-search-container">
          <div className="growth-search glass-panel">
            <Search size={20} className="growth-search-icon" />
            <input className="growth-search-input" placeholder="Describe your target audience in plain English..."
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            <button className="btn btn-primary" onClick={() => handleSearch()} disabled={loading}>
              {loading ? <Loader size={16} className="spin-icon" /> : <Sparkles size={16} />}
              Analyze
            </button>
          </div>

          <div className="growth-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="chip" onClick={() => handleSearch(s)}>{s}</button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="growth-processing">
            <div className="spinner" />
            <span>AI is analyzing your query...</span>
          </div>
        )}

        {result && (
          <motion.div className="growth-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="growth-reasoning card">
              <h3 className="flex items-center gap-2"><Sparkles size={16} color="var(--accent-violet)" /> AI Reasoning</h3>
              <AIStream content={result.reasoning} />
            </div>

            {result.logic?.conditions?.length > 0 && (
              <div className="growth-logic card">
                <h3>Generated Logic</h3>
                <div className="logic-conditions">
                  {result.logic.conditions.map((c, i) => (
                    <span key={i} className="badge badge-accent">{c}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid-4" style={{ marginTop: 16 }}>
              <div className="card">
                <Users size={18} color="var(--accent-blue)" />
                <div className="metric-label">Audience Size</div>
                <div className="metric-value">{result.estimatedSize.toLocaleString()}</div>
              </div>
              <div className="card">
                <Target size={18} color="var(--success)" />
                <div className="metric-label">Expected Conversion</div>
                <div className="metric-value">{Math.round(result.expectedConversion * 100)}%</div>
              </div>
              <div className="card">
                <AlertTriangle size={18} color="var(--warning)" />
                <div className="metric-label">Risk Level</div>
                <div className="metric-value" style={{ textTransform: 'capitalize' }}>{result.risk}</div>
              </div>
              <div className="card">
                <Sparkles size={18} color="var(--accent-violet)" />
                <div className="metric-label">Est. Revenue</div>
                <div className="metric-value">₹{(result.estimatedSize * result.expectedConversion * 2500).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
            </div>

            {/* What-If Simulator */}
            <div className="what-if-section card" style={{ marginTop: 24 }}>
              <h3 className="flex items-center gap-2"><Sparkles size={16} color="var(--accent-cyan)" /> What-If Simulator</h3>
              <div className="what-if-controls">
                <div className="what-if-control">
                  <label>Discount: {discount}%</label>
                  <input type="range" min="0" max="50" value={discount} onChange={e => { setDiscount(+e.target.value); }} onMouseUp={() => runWhatIf()} />
                </div>
                <div className="what-if-control">
                  <label>Channel</label>
                  <div className="flex gap-2">
                    {['whatsapp', 'sms', 'email', 'push'].map(ch => (
                      <button key={ch} className={`chip ${channel === ch ? 'active' : ''}`}
                        onClick={() => { setChannel(ch); setTimeout(() => runWhatIf(), 100); }}>{ch}</button>
                    ))}
                  </div>
                </div>
              </div>
              {whatIfResult && (
                <div className="grid-4" style={{ marginTop: 16 }}>
                  <div className="mini-stat"><span className="mini-label">CTR</span><span className="mini-value">{(whatIfResult.predictedCtr * 100).toFixed(1)}%</span></div>
                  <div className="mini-stat"><span className="mini-label">Conversions</span><span className="mini-value">{whatIfResult.predictedConversions}</span></div>
                  <div className="mini-stat"><span className="mini-label">Revenue</span><span className="mini-value">₹{whatIfResult.predictedRevenue?.toLocaleString('en-IN')}</span></div>
                  <div className="mini-stat"><span className="mini-label">ROI</span><span className="mini-value">{whatIfResult.estimatedROI}%</span></div>
                </div>
              )}
            </div>

            <button className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>
              Create Campaign for this Segment <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
