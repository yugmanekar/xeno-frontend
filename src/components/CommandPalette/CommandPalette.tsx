import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Brain, Users, FlaskConical, MessageSquare, Rocket, Clock, Database, Search, Zap, Plus, Download, BarChart3 } from 'lucide-react';
import { useStore } from '../../store';
import './CommandPalette.css';

export default function CommandPalette() {
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPalette } = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!commandPaletteOpen);
      }
      if (e.key === 'Escape') setCommandPalette(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPalette]);

  if (!commandPaletteOpen) return null;

  const go = (path: string) => { navigate(path); setCommandPalette(false); };

  return (
    <div className="cmdk-overlay" onClick={() => setCommandPalette(false)}>
      <div className="cmdk-container" onClick={e => e.stopPropagation()}>
        <Command label="Command palette">
          <div className="cmdk-input-wrapper">
            <Search size={16} className="cmdk-search-icon" />
            <Command.Input placeholder="Type a command or search..." className="cmdk-input" autoFocus />
          </div>
          <Command.List className="cmdk-list">
            <Command.Empty className="cmdk-empty">No results found.</Command.Empty>
            <Command.Group heading="Navigation" className="cmdk-group">
              <Command.Item onSelect={() => go('/')} className="cmdk-item"><Brain size={16} /> AI Brain</Command.Item>
              <Command.Item onSelect={() => go('/customer-universe')} className="cmdk-item"><Users size={16} /> Customer Universe</Command.Item>
              <Command.Item onSelect={() => go('/growth-lab')} className="cmdk-item"><FlaskConical size={16} /> Growth Lab</Command.Item>
              <Command.Item onSelect={() => go('/strategy-room')} className="cmdk-item"><MessageSquare size={16} /> Strategy Room</Command.Item>
              <Command.Item onSelect={() => go('/campaigns')} className="cmdk-item"><Rocket size={16} /> Campaign Center</Command.Item>
              <Command.Item onSelect={() => go('/timeline')} className="cmdk-item"><Clock size={16} /> Decision Timeline</Command.Item>
              <Command.Item onSelect={() => go('/memory')} className="cmdk-item"><Database size={16} /> Marketing Memory</Command.Item>
            </Command.Group>
            <Command.Group heading="Actions" className="cmdk-group">
              <Command.Item onSelect={() => go('/campaigns')} className="cmdk-item"><Plus size={16} /> Create Campaign</Command.Item>
              <Command.Item onSelect={() => go('/growth-lab')} className="cmdk-item"><Search size={16} /> Find Customers</Command.Item>
              <Command.Item onSelect={() => go('/strategy-room')} className="cmdk-item"><Zap size={16} /> Ask AI Strategy</Command.Item>
            </Command.Group>
            <Command.Group heading="Quick Insights" className="cmdk-group">
              <Command.Item onSelect={() => go('/')} className="cmdk-item"><BarChart3 size={16} /> View Analytics</Command.Item>
              <Command.Item onSelect={() => go('/customer-universe')} className="cmdk-item"><Download size={16} /> Export Customers</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
