import React from 'react';
import { Tag, X, Settings } from 'lucide-react';

export default function Header({ boardName, isTrello, onClose, onOpenSettings }) {
  return (
    <header className="modal-header">
      <div className="header-left">
        <div className="header-icon-box">
          <Tag className="header-icon" size={18} />
        </div>
        <h1 className="header-title">Label Cleaner</h1>
        {boardName && (
          <span className="board-badge" title={`Current Board: ${boardName}`}>
            <span className="board-badge-prefix">Board:</span>
            <span className="board-badge-name">{boardName}</span>
          </span>
        )}
      </div>

      <div className="header-right">
        <span className="trello-native-pill" title="Official Trello Power-Up">
          <span className="online-indicator" />
          <span>Trello Power-Up</span>
        </span>

        <button
          className="header-settings-btn"
          onClick={onOpenSettings}
          title="Trello Power-Up Setup Guide"
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
