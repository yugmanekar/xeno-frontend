import { NavLink, useLocation } from 'react-router-dom';
import { Brain, Users, FlaskConical, MessageSquare, Rocket, Clock, Database, ChevronLeft, ChevronRight, Zap, Sun, Moon } from 'lucide-react';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import './Sidebar.css';

const NAV_ITEMS = [
  { section: 'INTELLIGENCE', items: [
    { path: '/', icon: Brain, label: 'AI Brain', shortcut: '1' },
    { path: '/customer-universe', icon: Users, label: 'Customer Universe', shortcut: '2' },
    { path: '/growth-lab', icon: FlaskConical, label: 'Growth Lab', shortcut: '3' },
  ]},
  { section: 'OPERATIONS', items: [
    { path: '/strategy-room', icon: MessageSquare, label: 'Strategy Room', shortcut: '4' },
    { path: '/campaigns', icon: Rocket, label: 'Campaign Center', shortcut: '5' },
  ]},
  { section: 'SYSTEM', items: [
    { path: '/timeline', icon: Clock, label: 'Decision Timeline', shortcut: '6' },
    { path: '/memory', icon: Database, label: 'Marketing Memory', shortcut: '7' },
  ]},
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon"><Zap size={20} /></div>
          {!sidebarCollapsed && <span className="logo-text gradient-text">XENO</span>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((section) => (
          <div key={section.section} className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-label">{section.section}</span>}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive || (item.path === '/' && location.pathname === '/') ? 'active' : ''}`
                }
                end={item.path === '/'}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className="nav-icon" />
                {!sidebarCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-shortcut">{item.shortcut}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!sidebarCollapsed && (
          <div className="sidebar-footer-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsDark(!isDark)} style={{ width: '100%', justifyContent: 'center' }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span className="footer-version">v1.0.0</span>
              <span className="footer-hint">⌘K for commands</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
