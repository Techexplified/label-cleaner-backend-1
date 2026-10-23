import React, { useState } from 'react';
import { Trash2, RefreshCw, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import LabelBadge from './LabelBadge';
import confetti from 'canvas-confetti';

export default function UnusedLabelsView({
  unusedLabels = [],
  onDeleteLabels,
  onRescan,
  isScanning,
  isOperating,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toDeleteList, setToDeleteList] = useState([]);

  const isAllSelected = unusedLabels.length > 0 && selectedIds.size === unusedLabels.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(unusedLabels.map(l => l.id)));
    }
  };

  const toggleSelect = (id) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const promptDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const list = unusedLabels.filter(l => selectedIds.has(l.id));
    setToDeleteList(list);
    setShowConfirmModal(true);
  };

  const promptDeleteSingle = (label) => {
    setToDeleteList([label]);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const ids = toDeleteList.map(l => l.id);
    await onDeleteLabels(ids);
    setSelectedIds(new Set());
    setShowConfirmModal(false);
    setToDeleteList([]);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  if (!unusedLabels || unusedLabels.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-icon-box success">
          <CheckCircle2 size={40} />
        </div>
        <h3>No Unused Labels!</h3>
        <p>Every single label on your board is actively assigned to at least one card.</p>
        <button className="btn-rescan-board" onClick={onRescan} disabled={isScanning}>
          <RefreshCw size={14} className={isScanning ? 'spin-icon' : ''} />
          <span>{isScanning ? 'Scanning...' : 'Rescan Board'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="unused-view-wrapper">
      {/* Top Header matching Screenshot 2 & 3 */}
      <div className="unused-header-row">
        <div className="unused-header-text">
          <h2 className="unused-title">Unused Labels</h2>
          <p className="unused-subtitle">
            Labels that are not used on any cards.
          </p>
        </div>
        <button
          className="btn-rescan-board"
          onClick={onRescan}
          disabled={isScanning}
        >
          <RefreshCw size={15} className={`btn-rescan-icon ${isScanning ? 'spin-icon' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Rescan Board'}</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="unused-table-box">
        {/* Table Header Bar */}
        <div className="unused-table-header">
          <div className="unused-header-left">
            <input
              type="checkbox"
              className="unused-header-checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
            />
            <span className="unused-count-label">
              {selectedIds.size > 0
                ? `${selectedIds.size} labels selected`
                : `${unusedLabels.length} unused labels found`}
            </span>
          </div>

          <div className="unused-header-right">
            {selectedIds.size > 0 ? (
              <button
                type="button"
                className="btn-delete-selected-top"
                onClick={promptDeleteSelected}
                disabled={isOperating}
              >
                Delete Selected ({selectedIds.size})
              </button>
            ) : (
              <button
                type="button"
                className="btn-select-all-link"
                onClick={toggleSelectAll}
              >
                Select All
              </button>
            )}
          </div>
        </div>

        {/* Rows List */}
        <div className="unused-rows-list">
          {unusedLabels.map((lbl) => {
            const isSelected = selectedIds.has(lbl.id);
            return (
              <div
                key={lbl.id}
                className={`unused-item-row ${isSelected ? 'row-active' : ''}`}
              >
                <div className="unused-cell-check">
                  <input
                    type="checkbox"
                    className="row-checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(lbl.id)}
                  />
                </div>

                <div className="unused-cell-badge">
                  <LabelBadge color={lbl.color} name={lbl.name} variant="solid" />
                </div>

                <div className="unused-cell-cards">
                  <span className="cards-zero-text">0 cards</span>
                </div>

                <div className="unused-cell-action">
                  <button
                    type="button"
                    className="btn-delete-row"
                    onClick={() => promptDeleteSingle(lbl)}
                    title="Delete this label"
                    disabled={isOperating}
                  >
                    <Trash2 size={14} className="trash-icon" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Danger Action Bar (Screenshot 2) */}
      <div className="unused-bottom-bar">
        <div className="bottom-bar-left">
          <Trash2 size={18} className="bottom-trash-icon" />
          <span className="bottom-trash-text">
            {selectedIds.size > 0
              ? `${selectedIds.size} label${selectedIds.size > 1 ? 's' : ''} will be permanently deleted.`
              : `${unusedLabels.length} labels will be permanently deleted.`}
          </span>
        </div>
        <button
          type="button"
          className="btn-delete-selected-bottom"
          onClick={promptDeleteSelected}
          disabled={selectedIds.size === 0 || isOperating}
        >
          Delete Selected ({selectedIds.size})
        </button>
      </div>

      {/* Confirmation Modal (Screenshot 3) */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="confirm-delete-modal">
            <button
              className="confirm-modal-close-btn"
              onClick={() => setShowConfirmModal(false)}
            >
              <X size={16} />
            </button>

            {/* Red Circle Trash Icon */}
            <div className="confirm-trash-circle">
              <Trash2 size={24} className="confirm-trash-svg" />
            </div>

            <h3 className="confirm-delete-title">
              Delete {toDeleteList.length} label{toDeleteList.length > 1 ? 's' : ''}?
            </h3>
            <p className="confirm-delete-subtitle">
              These labels aren’t currently used on any cards.
            </p>

            {/* Chips Preview */}
            <div className="confirm-chips-preview">
              {toDeleteList.map(lbl => (
                <LabelBadge key={lbl.id} color={lbl.color} name={lbl.name} size="sm" />
              ))}
            </div>

            {/* Amber Warning Box */}
            <div className="confirm-warning-box">
              <AlertTriangle size={17} className="warning-triangle-icon" />
              <span>This action cannot be undone.</span>
            </div>

            {/* Action Buttons */}
            <div className="confirm-modal-actions-row">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={isOperating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm-delete-submit"
                onClick={confirmDelete}
                disabled={isOperating}
              >
                {isOperating ? 'Deleting...' : `Delete ${toDeleteList.length} Label${toDeleteList.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
