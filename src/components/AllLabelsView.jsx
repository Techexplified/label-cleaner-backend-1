import React, { useState, useMemo } from 'react';
import { Search, Plus, MoreHorizontal, Edit2, GitMerge, Trash2, Info, ChevronLeft, ChevronRight, X, Tag } from 'lucide-react';
import LabelBadge from './LabelBadge';
import { TRELLO_COLORS } from '../services/trelloService';

export default function AllLabelsView({
  labels = [],
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  onMergeLabels,
  isOperating,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeActionMenu, setActiveActionMenu] = useState(null); // label id of open menu
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [renameLabel, setRenameLabel] = useState(null);
  const [newName, setNewName] = useState('');
  const [viewCardsLabel, setViewCardsLabel] = useState(null);
  const [mergeSourceLabel, setMergeSourceLabel] = useState(null);
  const [mergeTargetId, setMergeTargetId] = useState('');

  // Create form state
  const [createFormName, setCreateFormName] = useState('');
  const [createFormColor, setCreateFormColor] = useState('blue');

  const filteredLabels = useMemo(() => {
    return labels.filter(l =>
      (l.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [labels, searchTerm]);

  const totalPages = Math.ceil(filteredLabels.length / pageSize) || 1;
  const paginatedLabels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLabels.slice(start, start + pageSize);
  }, [filteredLabels, currentPage]);

  const isAllPageSelected = paginatedLabels.length > 0 && paginatedLabels.every(l => selectedIds.has(l.id));

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllPageSelected) {
      paginatedLabels.forEach(l => next.delete(l.id));
    } else {
      paginatedLabels.forEach(l => next.add(l.id));
    }
    setSelectedIds(next);
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleOpenRename = (lbl) => {
    setRenameLabel(lbl);
    setNewName(lbl.name || '');
    setActiveActionMenu(null);
  };

  const handleSaveRename = async (e) => {
    e.preventDefault();
    if (renameLabel) {
      await onUpdateLabel(renameLabel.id, { name: newName, color: renameLabel.color });
      setRenameLabel(null);
    }
  };

  const handleOpenMerge = (lbl) => {
    setMergeSourceLabel(lbl);
    const candidate = labels.find(l => l.id !== lbl.id);
    setMergeTargetId(candidate ? candidate.id : '');
    setActiveActionMenu(null);
  };

  const handleConfirmMerge = async () => {
    if (mergeSourceLabel && mergeTargetId && onMergeLabels) {
      const target = labels.find(l => l.id === mergeTargetId);
      await onMergeLabels(mergeSourceLabel.id, mergeTargetId);
      setMergeSourceLabel(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await onCreateLabel({ name: createFormName, color: createFormColor });
    setCreateFormName('');
    setIsCreateModalOpen(false);
  };

  const colorOptions = Object.keys(TRELLO_COLORS);

  return (
    <div className="all-labels-view-wrap">
      {/* Top Header matching Screenshot 4 */}
      <div className="all-labels-header">
        <div className="header-titles">
          <h2 className="all-labels-title">All Labels</h2>
          <p className="all-labels-subtitle">
            Complete list of labels on this board.
          </p>
        </div>

        <div className="header-right-controls">
          <div className="search-box-wrap">
            <Search size={15} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search labels..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            type="button"
            className="btn-add-label"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add New Label</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="all-labels-table-box">
        <div className="all-labels-table-head">
          <div className="th-cell th-check">
            <input
              type="checkbox"
              checked={isAllPageSelected}
              onChange={toggleSelectAll}
            />
          </div>
          <div className="th-cell th-name">Label Name</div>
          <div className="th-cell th-color">Color</div>
          <div className="th-cell th-cards">Cards</div>
          <div className="th-cell th-status">Status</div>
          <div className="th-cell th-actions">Actions</div>
        </div>

        <div className="all-labels-table-body">
          {paginatedLabels.length === 0 ? (
            <div className="no-labels-row">No labels found matching "{searchTerm}"</div>
          ) : (
            paginatedLabels.map((lbl) => {
              const isSelected = selectedIds.has(lbl.id);
              const colorDef = TRELLO_COLORS[lbl.color] || TRELLO_COLORS['null'];
              const isMenuOpen = activeActionMenu === lbl.id;

              return (
                <div
                  key={lbl.id}
                  className={`all-labels-row ${isSelected ? 'row-selected' : ''}`}
                >
                  <div className="td-cell td-check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(lbl.id)}
                    />
                  </div>

                  <div className="td-cell td-name">
                    <LabelBadge color={lbl.color} name={lbl.name} variant="solid" />
                  </div>

                  <div className="td-cell td-color">
                    <span
                      className="color-circular-dot"
                      style={{ backgroundColor: colorDef.dot || colorDef.hex }}
                      title={colorDef.label}
                    />
                  </div>

                  <div className="td-cell td-cards">
                    <span className="cards-count-text">{lbl.usageCount || 0}</span>
                  </div>

                  <div className="td-cell td-status">
                    {lbl.usageCount > 0 ? (
                      <span className="status-badge in-use">In Use</span>
                    ) : (
                      <span className="status-badge unused">Unused</span>
                    )}
                  </div>

                  <div className="td-cell td-actions">
                    <div className="actions-dropdown-container">
                      <button
                        type="button"
                        className="btn-dots-action"
                        onClick={() => setActiveActionMenu(isMenuOpen ? null : lbl.id)}
                        title="Actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu (Screenshot 5) */}
                      {isMenuOpen && (
                        <div className="actions-floating-menu">
                          <button
                            type="button"
                            className="menu-item"
                            onClick={() => handleOpenRename(lbl)}
                          >
                            <Edit2 size={14} className="menu-icon" />
                            <span>Rename</span>
                          </button>

                          <button
                            type="button"
                            className="menu-item"
                            onClick={() => handleOpenMerge(lbl)}
                          >
                            <GitMerge size={14} className="menu-icon" />
                            <span>Merge with another label</span>
                          </button>

                          <button
                            type="button"
                            className="menu-item danger"
                            onClick={() => {
                              setActiveActionMenu(null);
                              onDeleteLabel(lbl.id);
                            }}
                          >
                            <Trash2 size={14} className="menu-icon red" />
                            <span>Delete</span>
                          </button>

                          <div className="menu-divider" />

                          <button
                            type="button"
                            className="menu-item"
                            onClick={() => {
                              setViewCardsLabel(lbl);
                              setActiveActionMenu(null);
                            }}
                          >
                            <Info size={14} className="menu-icon" />
                            <span>View cards using this label</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Footer matching Screenshot 4 */}
      <div className="all-labels-pagination-footer">
        <div className="pagination-count-text">
          Showing {Math.min(filteredLabels.length, (currentPage - 1) * pageSize + 1)}–
          {Math.min(filteredLabels.length, currentPage * pageSize)} of {filteredLabels.length} labels
        </div>

        <div className="pagination-controls-row">
          <button
            type="button"
            className="btn-page-nav"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              type="button"
              className={`btn-page-number ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            className="btn-page-nav"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Rename Label Modal (matching Screenshot) */}
      {renameLabel && (
        <div className="modal-backdrop">
          <form className="rename-modal-container" onSubmit={handleSaveRename}>
            <div className="rename-modal-header">
              <div className="rename-title-group">
                <Tag size={20} className="rename-tag-icon" />
                <div>
                  <h3 className="rename-title">Rename Label</h3>
                  <p className="rename-subtitle">Update the name of this label.</p>
                </div>
              </div>
              <button
                type="button"
                className="rename-close-btn"
                onClick={() => setRenameLabel(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="rename-form-field">
              <label>Current name</label>
              <input
                type="text"
                className="input-current-name"
                value={renameLabel.name || ''}
                readOnly
                disabled
              />
            </div>

            <div className="rename-form-field">
              <label>New name</label>
              <input
                type="text"
                className="input-new-name"
                value={newName}
                maxLength={50}
                onChange={e => setNewName(e.target.value)}
                autoFocus
              />
              <div className="rename-char-counter">{newName.length}/50</div>
            </div>

            <div className="rename-actions-row">
              <button
                type="button"
                className="btn-rename-cancel"
                onClick={() => setRenameLabel(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-rename-submit"
                disabled={isOperating || !newName.trim()}
              >
                Rename
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Merge Picker Modal */}
      {mergeSourceLabel && (
        <div className="modal-backdrop">
          <div className="modal-dialog-box">
            <h3>Merge "{mergeSourceLabel.name}"</h3>
            <p>Select target label. All cards will be updated to target label and source will be removed.</p>
            <div className="dialog-field">
              <label>Target Label</label>
              <select
                value={mergeTargetId}
                onChange={e => setMergeTargetId(e.target.value)}
              >
                {labels
                  .filter(l => l.id !== mergeSourceLabel.id)
                  .map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.usageCount} cards)
                    </option>
                  ))}
              </select>
            </div>
            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setMergeSourceLabel(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary-save"
                onClick={handleConfirmMerge}
                disabled={isOperating}
              >
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Cards Modal */}
      {viewCardsLabel && (
        <div className="modal-backdrop">
          <div className="modal-dialog-box">
            <div className="dialog-header-row">
              <h3>Cards with "{viewCardsLabel.name}"</h3>
              <button
                className="close-dialog-btn"
                onClick={() => setViewCardsLabel(null)}
              >
                <X size={16} />
              </button>
            </div>
            <p className="dialog-subtitle">{viewCardsLabel.cards?.length || 0} cards attached</p>
            <div className="cards-scroll-box">
              {(viewCardsLabel.cards || []).length === 0 ? (
                <p className="no-cards-text">No cards currently using this label.</p>
              ) : (
                (viewCardsLabel.cards || []).map(card => (
                  <div key={card.id} className="card-item-chip">
                    {card.name}
                  </div>
                ))
              )}
            </div>
            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setViewCardsLabel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Label Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <form className="modal-dialog-box" onSubmit={handleCreateSubmit}>
            <div className="dialog-header-row">
              <h3>Add New Label</h3>
              <button
                type="button"
                className="close-dialog-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="dialog-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="e.g. Frontend, High Priority..."
                value={createFormName}
                onChange={e => setCreateFormName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dialog-field">
              <label>Color</label>
              <div className="color-swatch-grid">
                {colorOptions.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-dot-pick ${createFormColor === c ? 'active' : ''}`}
                    style={{ backgroundColor: TRELLO_COLORS[c].hex }}
                    onClick={() => setCreateFormColor(c)}
                    title={TRELLO_COLORS[c].label}
                  />
                ))}
              </div>
            </div>
            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary-save" disabled={isOperating}>
                Create Label
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
