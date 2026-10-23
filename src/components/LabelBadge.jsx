import React from 'react';
import { TRELLO_COLORS } from '../services/trelloService';

export default function LabelBadge({
  color,
  name,
  count,
  showCount = false,
  variant = 'solid', // 'solid' | 'light'
  size = 'md',
}) {
  const colorDef = TRELLO_COLORS[color] || TRELLO_COLORS['null'];
  const bg = variant === 'light' ? colorDef.lightBg : colorDef.bg;

  return (
    <span
      className={`trello-chip-pill trello-chip-${size}`}
      style={{
        backgroundColor: bg,
        color: colorDef.text,
      }}
    >
      <span className="trello-chip-name">
        {name && name.trim() ? name : <i>(unnamed)</i>}
      </span>
      {showCount && count !== undefined && (
        <span className="trello-chip-count">{count}</span>
      )}
    </span>
  );
}
