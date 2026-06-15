import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommandPalette from '../CommandPalette/CommandPalette';
import { useStore } from '../../store';
import './Layout.css';

export default function Layout() {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="ambient-bg" />
        <Outlet />
      </main>
      <CommandPalette />
    </div>
  );
}
