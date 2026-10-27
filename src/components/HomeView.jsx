import React from 'react';
import TagIllustration from './TagIllustration';
import { RefreshCw, Copy, Tag, LayoutGrid, ChevronRight } from 'lucide-react';

export default function HomeView({
  stats,
  isScanned,
  isScanning,
  onScan,
  onNavigate,
}) {
  // If board has NOT been scanned yet -> Render the Pre-scan Hero View (Screenshot 1)
  if (!isScanned) {
    return (
      <div className="home-view-container pre-scan-mode">
        <div className="home-hero-section">
          {/* Vector 3-Tags Illustration */}
          <TagIllustration />

          {/* Heading & Subheading matching screenshot 1 */}
          <h2 className="home-title">Keep your labels clean and organized</h2>
          <p className="home-subtitle">
            Find duplicate labels, remove unused labels and manage all your board labels in one place.
          </p>

          {/* Primary Scan Button */}
          <button
            className={`btn-scan-primary ${isScanning ? 'scanning' : ''}`}
            onClick={onScan}
            disabled={isScanning}
          >
            <RefreshCw size={17} className={isScanning ? 'spin-icon' : ''} />
            <span>{isScanning ? 'Scanning Board...' : 'Scan Board Labels'}</span>
          </button>
        </div>

        {/* 3 Metric Cards at Bottom matching screenshot 1 */}
        <div className="home-stats-grid">
          <div className="stat-card stat-card-blue">
            <div className="stat-card-value">—</div>
            <div className="stat-card-label">Total Labels</div>
          </div>

          <div className="stat-card stat-card-pink">
            <div className="stat-card-value">—</div>
            <div className="stat-card-label">Duplicate Labels</div>
          </div>

          <div className="stat-card stat-card-yellow">
            <div className="stat-card-value">—</div>
            <div className="stat-card-label">Unused Labels</div>
          </div>
        </div>
      </div>
    );
  }

  // If board HAS been scanned -> Render the "Label Audit" View (Screenshot 2)
  return (
    <div className="label-audit-container">
      {/* Top Header Row: "Label Audit" and "Scan Again" button */}
      <div className="label-audit-header">
        <h2 className="label-audit-title">Label Audit</h2>
        <button
          className="btn-scan-again"
          onClick={onScan}
          disabled={isScanning}
        >
          <RefreshCw size={15} className={`btn-scan-again-icon ${isScanning ? 'spin-icon' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Scan Again'}</span>
        </button>
      </div>

      {/* Top 3 Stat Cards Row matching screenshot 2 */}
      <div className="audit-stats-grid">
        {/* Card 1: Total Labels */}
        <button
          type="button"
          className="audit-stat-card audit-card-blue"
          onClick={() => onNavigate('all')}
          title="View all labels"
        >
          <div className="audit-stat-number blue">{stats.totalLabelsCount}</div>
          <div className="audit-stat-label">Total Labels</div>
        </button>

        {/* Card 2: Duplicate Labels */}
        <button
          type="button"
          className="audit-stat-card audit-card-pink"
          onClick={() => onNavigate('duplicates')}
          title="View duplicate labels"
        >
          <div className="audit-stat-number red">{stats.duplicateLabelsCount}</div>
          <div className="audit-stat-label">Duplicate Labels</div>
        </button>

        {/* Card 3: Unused Labels */}
        <button
          type="button"
          className="audit-stat-card audit-card-yellow"
          onClick={() => onNavigate('unused')}
          title="View unused labels"
        >
          <div className="audit-stat-number yellow">{stats.unusedLabelsCount}</div>
          <div className="audit-stat-label">Unused Labels</div>
        </button>
      </div>

      {/* Advisory banner if board has no labels */}
      {stats.totalLabelsCount === 0 && (
        <div style={{
          backgroundColor: '#F7F8F9',
          border: '1px dashed #091E4224',
          borderRadius: '8px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Tag size={18} style={{ color: '#626F86', flexShrink: 0 }} />
          <div style={{ fontSize: '13px', color: '#44546F', lineHeight: '1.5' }}>
            <strong style={{ color: '#172B4D', display: 'block', marginBottom: '2px' }}>
              No labels detected on this board yet
            </strong>
            If your board has cards with labels, click <strong>Scan Again</strong>. You can also view or create new labels in the <strong>All Labels</strong> tab.
          </div>
        </div>
      )}

      {/* "Needs Attention" Section matching screenshot 2 */}
      <div className="needs-attention-section">
        <h3 className="needs-attention-title">Needs Attention</h3>

        <div className="attention-cards-stack">
          {/* Card 1: Duplicate Labels */}
          <button
            type="button"
            className="attention-card"
            onClick={() => onNavigate('duplicates')}
          >
            <div className="attention-card-left">
              <div className="attention-icon-box pink">
                <Copy size={20} className="attention-icon red" />
              </div>
              <div className="attention-text-col">
                <h4 className="attention-item-title">
                  {stats.duplicateLabelsCount} duplicate label{stats.duplicateLabelsCount === 1 ? '' : 's'} found
                </h4>
                <p className="attention-item-subtitle">
                  Labels with the same or similar name
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="attention-chevron" />
          </button>

          {/* Card 2: Unused Labels */}
          <button
            type="button"
            className="attention-card"
            onClick={() => onNavigate('unused')}
          >
            <div className="attention-card-left">
              <div className="attention-icon-box yellow">
                <Tag size={20} className="attention-icon dark" />
              </div>
              <div className="attention-text-col">
                <h4 className="attention-item-title">
                  {stats.unusedLabelsCount} unused label{stats.unusedLabelsCount === 1 ? '' : 's'} found
                </h4>
                <p className="attention-item-subtitle">
                  Labels not used on any cards
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="attention-chevron" />
          </button>

          {/* Card 3: View All Labels */}
          <button
            type="button"
            className="attention-card"
            onClick={() => onNavigate('all')}
          >
            <div className="attention-card-left">
              <div className="attention-icon-box gray">
                <LayoutGrid size={20} className="attention-icon dark" />
              </div>
              <div className="attention-text-col">
                <h4 className="attention-item-title">
                  View all labels
                </h4>
                <p className="attention-item-subtitle">
                  See all labels with card count
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="attention-chevron" />
          </button>
        </div>
      </div>
    </div>
  );
}
