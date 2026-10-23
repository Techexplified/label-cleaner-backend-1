import React from 'react';
import { Tag, X, Sparkles, Settings } from 'lucide-react';

export default function Header({ boardName, mode, isTrello, onClose, onOpenSettings }) {
  return (
    <header className="modal-header">
      <div className="header-left">
        <div className="header-icon-box">
          <Tag className="header-icon" size={18} />
        </div>
        <h1 className="header-title">Label Cleaner</h1>
        {boardName && (
          <span className="board-badge" title={`Current Board: ${boardName}`}>
            {boardName}
          </span>
        )}
      </div>

      <div className="header-right">
        {mode === 'demo' && (
          <button
            className="demo-pill-btn"
            onClick={onOpenSettings}
            title="Click to switch boards or connect live Trello"
          >
            <Sparkles size={13} />
            <span>Demo Mode</span>
          </button>
        )}

        {mode === 'api' && (
          <button
            className="api-pill-btn"
            onClick={onOpenSettings}
            title="Connected via Trello API"
          >
            <span className="online-indicator" />
            <span>Trello Live</span>
          </button>
        )}

        {isTrello && (
          <span className="trello-native-pill" title="Running natively as Trello Power-Up">
            <span className="online-indicator" />
            <span>Trello Power-Up</span>
          </span>
        )}

        <button
          className="header-settings-btn"
          onClick={onOpenSettings}
          title="Trello Connection & Settings"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        <button
          className="header-close-btn"
          onClick={onClose}
          title={isTrello ? 'Close Power-Up Modal' : 'Close'}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}
