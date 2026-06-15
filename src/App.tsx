import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout/Layout';
import Onboarding from './pages/Onboarding/Onboarding';
import AIBrain from './pages/AIBrain/AIBrain';
import CustomerUniverse from './pages/CustomerUniverse/CustomerUniverse';
import GrowthLab from './pages/GrowthLab/GrowthLab';
import StrategyRoom from './pages/StrategyRoom/StrategyRoom';
import CampaignCenter from './pages/CampaignCenter/CampaignCenter';
import DecisionTimeline from './pages/DecisionTimeline/DecisionTimeline';
import MarketingMemory from './pages/MarketingMemory/MarketingMemory';

function App() {
  const { workspace } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        {!workspace.isOnboarded ? (
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<AIBrain />} />
            <Route path="/customer-universe" element={<CustomerUniverse />} />
            <Route path="/growth-lab" element={<GrowthLab />} />
            <Route path="/strategy-room" element={<StrategyRoom />} />
            <Route path="/campaigns" element={<CampaignCenter />} />
            <Route path="/timeline" element={<DecisionTimeline />} />
            <Route path="/memory" element={<MarketingMemory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
