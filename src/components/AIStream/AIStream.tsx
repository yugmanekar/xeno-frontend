import { useState, useEffect } from 'react';
import './AIStream.css';

interface AIStreamProps {
  content: string;
  isStreaming?: boolean;
}

export default function AIStream({ content, isStreaming = false }: AIStreamProps) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed('');
    setIndex(0);
  }, [content]);

  useEffect(() => {
    if (index < content.length) {
      const speed = content[index] === ' ' ? 15 : content[index] === '.' ? 80 : 25;
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + content[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, content]);

  const isTyping = index < content.length;

  return (
    <div className="ai-stream">
      {isStreaming && index === 0 && (
        <div className="ai-thinking">
          <div className="thinking-dots">
            <span /><span /><span />
          </div>
          <span>Thinking...</span>
        </div>
      )}
      <div className="ai-stream-content">
        {displayed}
        {isTyping && <span className="ai-cursor">|</span>}
      </div>
    </div>
  );
}
