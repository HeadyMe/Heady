// HEADY_BRAND:BEGIN
// HEADY SYSTEMS :: SACRED GEOMETRY
// FILE: frontend/src/components/HeadySacredIcon.js
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

import React from 'react';

/**
 * HeadySacredIcon Component
 * Renders SVG variations based on the "Sacred Geometry" aesthetic.
 * 
 * Variations:
 * - 'connection': HeadyConnection style (handshake/geometry)
 * - 'brain': Heady Intelligence style
 * - 'shield': Security/Lock style
 * - 'code': Development style
 * - 'rocket': Launch/Speed style
 * - 'seed': Community/Growth style
 */

const icons = {
  connection: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" />
      <path d="M35 50 H65 M50 35 V65" stroke="currentColor" strokeWidth="1" />
      <path d="M40 45 Q50 35 60 45 T80 45" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M40 55 Q50 65 60 55 T80 55" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 20 Q70 20 80 40 T70 80 Q50 90 30 80 T20 40 Q30 20 50 20" stroke="currentColor" strokeWidth="2" />
      <path d="M50 30 V70 M35 40 Q50 45 65 40 M30 55 Q50 60 70 55" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    </svg>
  ),
  seed: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 80 V40 M50 40 Q70 20 80 40 T50 70 M50 40 Q30 20 20 40 T50 70" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M40 85 H60" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 30 V50 Q20 80 50 90 Q80 80 80 50 V30 L50 15 Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="52" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 45 V55" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
};

const HeadySacredIcon = ({ name, size = 24, color = '#00f2ff', className = '', style = {} }) => {
  const icon = icons[name] || icons.connection;
  
  return (
    <div 
      className={`heady-icon-container ${className}`}
      style={{ 
        width: size, 
        height: size, 
        color: color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 0 5px currentColor)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        ...style
      }}
      title={`Click to copy ${name} emoji`}
      onClick={(e) => {
        e.stopPropagation();
        const emojiMap = { connection: '💠', brain: '🧠', seed: '🌱', shield: '🛡️' };
        navigator.clipboard.writeText(emojiMap[name] || '💠');
      }}
    >
      {icon}
    </div>
  );
};

export default HeadySacredIcon;
