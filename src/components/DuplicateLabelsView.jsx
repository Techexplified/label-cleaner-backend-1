import React, { useState } from 'react';
import { RefreshCw, Info, ChevronDown, CheckCircle2, Check, ArrowRight, X } from 'lucide-react';
import LabelBadge from './LabelBadge';
import confetti from 'canvas-confetti';

export default function DuplicateLabelsView({
  duplicateGroups = [],
  onMergeCluster,
  onMergeAll,
  onRescan,
  isScanning,
  isOperating,
  onNavigateHome,
}) {
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [chosenCanonicals, setChosenCanonicals] = useState({});
  const [lastMergedDetails, setLastMergedDetails] = useState(null); // When set, shows Image 1 Success View

  const toggleSelectGroup = (normName) => {
    const next = new Set(selectedGroups);
    if (next.has(normName)) {
      next.delete(normName);
    } else {
      next.add(normName);
    }
    setSelectedGroups(next);
  };

  const handleSelectCanonical = (normName, labelId) => {
    setChosenCanonicals(prev => ({ ...prev, [normName]: labelId }));
  };

  const handleMerge = async (group) => {
    const canonicalId = chosenCanonicals[group.normalizedName] || group.canonicalId;
    const target = group.labels.find(l => l.id === canonicalId) || group.labels[0];
    const source = group.labels.find(l => l.id !== canonicalId) || group.labels[1] || group.labels[0];

    await onMergeCluster(group, canonicalId);
    setActiveDropdown(null);

    // Set success screen details matching Screenshot 1
    setLastMergedDetails({
      sourceLabel: source,
      targetLabel: target,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.55 },
      });
    } catch {
      // ignore
    }
  };

  const handleBatchMergeSelected = async () => {
    if (selectedGroups.size === 0) return;
    const groupsToMerge = duplicateGroups.filter(g => selectedGroups.has(g.normalizedName));
    for (const group of groupsToMerge) {
      const canonicalId = chosenCanonicals[group.normalizedName] || group.canonicalId;
      await onMergeCluster(group, canonicalId);
    }
    setSelectedGroups(new Set());
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 },
      });
    } catch {
      // ignore
    }
  };

  // ---------------- VIEW 1: MERGED SUCCESSFULLY SCREEN (Screenshot 1) ----------------
  if (lastMergedDetails) {
    const { sourceLabel, targetLabel } = lastMergedDetails;
    return (
      <div className="merge-success-view">
        <div className="merge-success-hero">
          {/* Green Check Circle with Confetti Accents */}
          <div className="confetti-circle-wrap">
            <span className="confetti-dot blue-dot" />
            <span className="confetti-dot green-dot" />
            <span className="confetti-dot pink-dot" />
            <span className="confetti-dot yellow-dot" />
            <span className="confetti-dot orange-dot" />
            <span className="confetti-dot cyan-dot" />
            <div className="success-circle-icon">
              <Check size={36} strokeWidth={3} className="check-svg-icon" />
            </div>
          </div>

          <h2 className="success-title">Labels merged successfully!</h2>
          <p className="success-subtitle">
            The duplicate label has been merged into the main label.
          </p>

          {/* Comparison Box */}
          <div className="merge-compare-card">
            {/* Left: Source Label (e.g. bug, 6 cards) */}
            <div className="compare-col">
              <LabelBadge
                color={sourceLabel.color}
                name={sourceLabel.name}
                variant="light"
                size="md"
              />
              <div className="compare-cards-num">{sourceLabel.usageCount} cards</div>
              <div className="compare-cards-desc">updated and merged</div>
            </div>

            {/* Arrow in middle */}
            <div className="compare-arrow-col">
              <ArrowRight size={22} className="compare-arrow-icon" />
            </div>

            {/* Right: Target Label (e.g. Bug, 18 cards) */}
            <div className="compare-col">
              <LabelBadge
                color={targetLabel.color}
                name={targetLabel.name}
                variant="solid"
                size="md"
              />
              <div className="compare-cards-num">{targetLabel.usageCount} cards</div>
              <div className="compare-cards-desc">already using this label</div>
            </div>
          </div>

          {/* Green Checklist Box */}
          <div className="merge-checklist-card">
            <div className="checklist-item">
              <CheckCircle2 size={18} className="check-bullet-icon" />
              <span>{sourceLabel.usageCount} cards updated to use "{targetLabel.name}"</span>
            </div>
            <div className="checklist-item">
              <CheckCircle2 size={18} className="check-bullet-icon" />
              <span>Label "{sourceLabel.name}" has been removed</span>
            </div>
            <div className="checklist-item">
              <CheckCircle2 size={18} className="check-bullet-icon" />
              <span>Label color and name kept as "{targetLabel.name}"</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="merge-success-actions">
          <button
            type="button"
            className="btn-back-duplicates"
            onClick={() => setLastMergedDetails(null)}
          >
            Back to Duplicate Labels
          </button>
          <button
            type="button"
            className="btn-done-primary"
            onClick={() => {
              setLastMergedDetails(null);
              if (onNavigateHome) onNavigateHome();
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ---------------- VIEW 2: EMPTY STATE ----------------
  if (!duplicateGroups || duplicateGroups.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-icon-box success">
          <CheckCircle2 size={40} />
        </div>
        <h3>No Duplicate Labels!</h3>
        <p>All your board labels have unique names and are perfectly organized.</p>
        <button className="btn-rescan-board" onClick={onRescan} disabled={isScanning}>
          <RefreshCw size={14} className={isScanning ? 'spin-icon' : ''} />
          <span>{isScanning ? 'Scanning...' : 'Rescan Board'}</span>
        </button>
      </div>
    );
  }

  // ---------------- VIEW 3: DUPLICATE LABELS LIST (Screenshot 3) ----------------
  return (
    <div className="dup-view-wrapper">
      {/* Top Header */}
      <div className="dup-header-row">
        <div className="dup-header-text">
          <h2 className="dup-title">Duplicate Labels</h2>
          <p className="dup-subtitle">
            Labels with the same or near-identical name.
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

      {/* Batch Merge Bar if checkboxes selected */}
      {selectedGroups.size > 0 && (
        <div className="batch-selected-bar">
          <span>{selectedGroups.size} duplicate group{selectedGroups.size > 1 ? 's' : ''} selected</span>
          <button
            className="btn-merge-selected"
            onClick={handleBatchMergeSelected}
            disabled={isOperating}
          >
            Merge Selected ({selectedGroups.size})
          </button>
        </div>
      )}

      {/* Duplicate Groups List */}
      <div className="dup-cards-list">
        {duplicateGroups.map((group) => {
          const isSelected = selectedGroups.has(group.normalizedName);
          const isDropdownOpen = activeDropdown === group.normalizedName;
          const currentCanonicalId = chosenCanonicals[group.normalizedName] || group.canonicalId;
          const canonicalLabel = group.labels.find(l => l.id === currentCanonicalId) || group.labels[0];

          return (
            <div
              key={group.normalizedName}
              className={`dup-item-card ${isSelected ? 'selected' : ''}`}
            >
              {/* Left Checkbox */}
              <div className="dup-checkbox-wrap">
                <input
                  type="checkbox"
                  className="dup-checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectGroup(group.normalizedName)}
                />
              </div>

              {/* Middle: Labels & Counts Stack */}
              <div className="dup-labels-stack">
                {group.labels.map((lbl, idx) => (
                  <div key={lbl.id} className="dup-label-row">
                    <div className="dup-chip-container">
                      <LabelBadge
                        color={lbl.color}
                        name={lbl.name}
                        variant={idx === 0 ? 'solid' : 'light'}
                      />
                    </div>
                    <span className="dup-cards-count">
                      {lbl.usageCount} cards
                    </span>
                  </div>
                ))}
              </div>

              {/* Right: Merge Split Button */}
              <div className="dup-actions-wrap">
                <div className="split-button-group">
                  <button
                    className="btn-merge-action"
                    onClick={() => handleMerge(group)}
                    disabled={isOperating}
                  >
                    Merge
                  </button>
                  <button
                    className="btn-dropdown-toggle"
                    onClick={() => setActiveDropdown(isDropdownOpen ? null : group.normalizedName)}
                    title="Merge options"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="dup-dropdown-menu">
                    <div className="dup-dropdown-header">
                      <span>Keep which label?</span>
                      <button
                        className="close-dropdown-btn"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="dup-options-list">
                      {group.labels.map((lbl) => (
                        <label
                          key={lbl.id}
                          className="dup-option-item"
                          onClick={() => handleSelectCanonical(group.normalizedName, lbl.id)}
                        >
                          <input
                            type="radio"
                            name={`canonical-${group.normalizedName}`}
                            checked={lbl.id === currentCanonicalId}
                            onChange={() => handleSelectCanonical(group.normalizedName, lbl.id)}
                          />
                          <LabelBadge color={lbl.color} name={lbl.name} size="sm" />
                          <span className="dup-option-count">({lbl.usageCount} cards)</span>
                        </label>
                      ))}
                    </div>

                    <div className="dup-dropdown-footer">
                      <button
                        className="btn-dropdown-confirm"
                        onClick={() => handleMerge(group)}
                        disabled={isOperating}
                      >
                        Merge into "{canonicalLabel.name}"
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Info Box */}
      <div className="how-merging-works-box">
        <div className="how-merging-icon-wrap">
          <Info size={19} className="how-merging-icon" />
        </div>
        <div className="how-merging-content">
          <h4 className="how-merging-title">How merging works?</h4>
          <ul className="how-merging-bullets">
            <li>All cards using the duplicate label will be updated to use the label you keep.</li>
            <li>The duplicate label will be deleted after merging.</li>
            <li>This action cannot be undone (Undo option available in future version).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
