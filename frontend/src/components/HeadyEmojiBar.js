// HEADY_BRAND:BEGIN
// HEADY SYSTEMS :: SACRED GEOMETRY
// FILE: frontend/src/components/HeadyEmojiBar.js
// LAYER: ui/frontend
// 
//         _   _  _____    _    ____   __   __
//        | | | || ____|  / \  |  _ \ \ \ / /
//        | |_| ||  _|   / _ \ | | | | \ V / 
//        |  _  || |___ / ___ \| |_| |  | |  
//        |_| |_||_____/_/   \_\____/   |_|  
// 
//    Sacred Geometry :: Organic Systems :: Breathing Interfaces
// HEADY_BRAND:END

import React, { useState } from 'react';
import HeadySacredIcon from './HeadySacredIcon';

const HeadyEmojiBar = () => {
  const [copied, setCopied] = useState(null);

  const icons = ['connection', 'brain', 'seed', 'shield'];
  const colors = ['#00f2ff', '#bd00ff', '#00ff88', '#ffcc00'];

  const handleCopy = (name) => {
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '15px',
      padding: '10px 20px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '50px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      width: 'fit-content',
      margin: '10px auto',
      position: 'relative'
    }}>
      {icons.map((name, i) => (
        <div 
          key={name} 
          onClick={() => handleCopy(name)}
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <HeadySacredIcon 
            name={name} 
            size={32} 
            color={colors[i]} 
            className="sacred-variation-hover"
          />
          {copied === name && (
            <span style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: '#fff',
              background: 'rgba(0,0,0,0.8)',
              padding: '2px 6px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              Copied!
            </span>
          )}
        </div>
      ))}
      <style>{`
        .sacred-variation-hover:hover {
          transform: scale(1.2) rotate(5deg);
          filter: drop-shadow(0 0 10px currentColor);
        }
      `}</style>
    </div>
  );
};

export default HeadyEmojiBar;
