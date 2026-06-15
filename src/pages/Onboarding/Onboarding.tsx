import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { setupWorkspace } from '../../services/api';
import './Onboarding.css';

const SETUP_STEPS = [
  'Generating customer profiles...',
  'Analyzing purchase patterns...',
  'Building AI personas...',
  'Calibrating prediction models...',
  'Configuring marketing channels...',
];

export default function Onboarding() {
  const [step, setStep] = useState<'logo' | 'input' | 'processing' | 'done'>('logo');
  const [businessDesc, setBusinessDesc] = useState('');
  const [currentSetupStep, setCurrentSetupStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { setOnboarded } = useStore();

  useState(() => {
    setTimeout(() => setStep('input'), 2000);
  });

  const handleSubmit = async () => {
    if (!businessDesc.trim()) return;
    setStep('processing');

    try { await setupWorkspace({ businessDescription: businessDesc }); } catch {}

    for (let i = 0; i < SETUP_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      setCurrentSetupStep(i);
      setCompletedSteps(prev => [...prev, i]);
    }

    await new Promise(r => setTimeout(r, 600));
    setStep('done');
    await new Promise(r => setTimeout(r, 1200));
    setOnboarded('XENO', businessDesc);
    navigate('/');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'logo' && (
          <motion.div key="logo" className="onboarding-center"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="onboarding-logo-icon"><Zap size={40} /></div>
            <h1 className="onboarding-title gradient-text">XENO</h1>
            <p className="onboarding-tagline">Autonomous Growth Engine</p>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div key="input" className="onboarding-center"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <motion.h2 className="onboarding-welcome"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Welcome
            </motion.h2>
            <motion.p className="onboarding-prompt"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Tell me about your business
            </motion.p>
            <motion.div className="onboarding-input-wrapper"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <input
                className="onboarding-input"
                placeholder="I'm a fashion brand trying to improve repeat purchases..."
                value={businessDesc}
                onChange={(e) => setBusinessDesc(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <button className="onboarding-submit" onClick={handleSubmit} disabled={!businessDesc.trim()}>
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div key="processing" className="onboarding-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <h2 className="onboarding-welcome" style={{ fontSize: 'var(--font-xl)', marginBottom: '8px' }}>
              Building your workspace
            </h2>
            <p className="onboarding-prompt" style={{ marginBottom: '32px', fontSize: 'var(--font-sm)' }}>
              I understand. Let me configure everything for you...
            </p>
            <div className="setup-steps">
              {SETUP_STEPS.map((s, i) => (
                <motion.div key={i} className={`setup-step ${completedSteps.includes(i) ? 'completed' : i === currentSetupStep ? 'active' : ''}`}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <div className="setup-step-icon">
                    {completedSteps.includes(i) ? <Check size={14} /> : <div className="spinner" style={{ width: 14, height: 14 }} />}
                  </div>
                  <span>{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div key="done" className="onboarding-center"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="done-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Check size={40} />
            </motion.div>
            <h2 className="onboarding-welcome">Your workspace is ready</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
