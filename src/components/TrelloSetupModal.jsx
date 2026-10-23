import React, { useState } from 'react';
import { X, ExternalLink, Key, CheckCircle, RefreshCw, Layout, Sparkles, Shield } from 'lucide-react';
import { fetchTrelloBoards } from '../services/trelloService';

export default function TrelloSetupModal({
  isOpen,
  onClose,
  credentials,
  onSaveCredentials,
  onResetDemo,
  isTrello,
}) {
  const [activeSubTab, setActiveSubTab] = useState(isTrello ? 'powerup' : 'api');
  const [apiKey, setApiKey] = useState(credentials.apiKey || '');
  const [token, setToken] = useState(credentials.token || '');
  const [boardId, setBoardId] = useState(credentials.boardId || '');
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [boardsList, setBoardsList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFetchBoards = async () => {
    if (!apiKey.trim() || !token.trim()) {
      setErrorMsg('Please enter both API Key and Token.');
      return;
    }
    setErrorMsg('');
    setLoadingBoards(true);
    try {
      const boards = await fetchTrelloBoards(apiKey.trim(), token.trim());
      setBoardsList(boards);
      if (boards.length > 0 && !boardId) {
        setBoardId(boards[0].id);
      }
      setSuccessMsg(`Successfully found ${boards.length} Trello boards!`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate with Trello.');
    } finally {
      setLoadingBoards(false);
    }
  };

  const handleSaveApi = () => {
    onSaveCredentials({
      apiKey: apiKey.trim(),
      token: token.trim(),
      boardId: boardId.trim(),
      mode: 'api',
    });
    onClose();
  };

  const handleSwitchToDemo = () => {
    onSaveCredentials({ mode: 'demo' });
    onClose();
  };

  const connectorUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/connector.html`
    : 'https://your-domain.com/connector.html';

  return (
    <div className="modal-backdrop">
      <div className="setup-modal-container">
        <div className="setup-modal-header">
          <div className="header-badge-row">
            <Shield size={18} className="shield-icon" />
            <h3>Trello Integration & Settings</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Sub-tab navigation */}
        <div className="setup-tabs-bar">
          <button
            className={`setup-tab-btn ${activeSubTab === 'powerup' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('powerup')}
          >
            <Layout size={15} />
            <span>Trello Power-Up Setup</span>
          </button>
          <button
            className={`setup-tab-btn ${activeSubTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('api')}
          >
            <Key size={15} />
            <span>Connect Trello Account</span>
          </button>
          <button
            className={`setup-tab-btn ${activeSubTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('demo')}
          >
            <Sparkles size={15} />
            <span>Demo Playground</span>
          </button>
        </div>

        <div className="setup-modal-body">
          {/* TAB 1: Power-Up Setup */}
          {activeSubTab === 'powerup' && (
            <div className="setup-content-tab">
              <div className="info-banner">
                <strong>How to use this directly inside Trello:</strong>
                <p>
                  You can register this app as a custom Power-Up in your Trello workspace. Once added, a "Label Cleaner" button will appear directly on your Trello board headers!
                </p>
              </div>

              <div className="steps-list">
                <div className="step-item">
                  <div className="step-num">1</div>
                  <div className="step-body">
                    <strong>Open Trello Power-Up Admin Portal</strong>
                    <p>Go to Atlassian Trello Power-Up management.</p>
                    <a
                      href="https://trello.com/power-ups/admin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-btn"
                    >
                      <span>Open Trello Power-Up Admin</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-num">2</div>
                  <div className="step-body">
                    <strong>Create a New Power-Up</strong>
                    <p>
                      Name it <code>Label Cleaner</code> and select your Workspace.
                    </p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-num">3</div>
                  <div className="step-body">
                    <strong>Set the Iframe Connector URL</strong>
                    <p>Copy and paste this connector URL into your Power-Up capabilities:</p>
                    <div className="copy-url-box">
                      <code>{connectorUrl}</code>
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard?.writeText(connectorUrl);
                          alert('Connector URL copied to clipboard!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-num">4</div>
                  <div className="step-body">
                    <strong>Enable on Your Board</strong>
                    <p>
                      Open any Trello board &gt; Click <strong>Power-Ups</strong> &gt; Enable <strong>Label Cleaner</strong>!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Direct API Token Connection */}
          {activeSubTab === 'api' && (
            <div className="setup-content-tab">
              <p className="tab-lead-text">
                Connect your Trello account directly using an API Key & Token to clean any board right now.
              </p>

              {errorMsg && <div className="error-banner">{errorMsg}</div>}
              {successMsg && <div className="success-banner">{successMsg}</div>}

              <div className="form-group">
                <div className="group-label-row">
                  <label>Trello API Key</label>
                  <a
                    href="https://trello.com/power-ups/admin"
                    target="_blank"
                    rel="noreferrer"
                    className="helper-link"
                  >
                    Get API Key <ExternalLink size={11} />
                  </a>
                </div>
                <input
                  type="text"
                  placeholder="Paste your 32-character API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="group-label-row">
                  <label>Trello API Token</label>
                  {apiKey.trim() && (
                    <a
                      href={`https://trello.com/1/authorize?expiration=never&name=LabelCleaner&scope=read,write&response_type=token&key=${apiKey.trim()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="helper-link"
                    >
                      Generate Token <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Paste your API token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>

              <div className="fetch-boards-action-row">
                <button
                  type="button"
                  className="btn-fetch-boards"
                  onClick={handleFetchBoards}
                  disabled={loadingBoards || !apiKey.trim() || !token.trim()}
                >
                  <RefreshCw size={14} className={loadingBoards ? 'spin-icon' : ''} />
                  <span>{loadingBoards ? 'Connecting...' : 'Fetch My Trello Boards'}</span>
                </button>
              </div>

              {boardsList.length > 0 && (
                <div className="form-group">
                  <label>Select Board to Clean</label>
                  <select value={boardId} onChange={(e) => setBoardId(e.target.value)}>
                    {boardsList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="setup-modal-actions">
                <button
                  type="button"
                  className="btn-primary-save"
                  onClick={handleSaveApi}
                  disabled={!apiKey.trim() || !token.trim() || !boardId.trim()}
                >
                  <CheckCircle size={15} />
                  <span>Load Live Board Data</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Demo Mode */}
          {activeSubTab === 'demo' && (
            <div className="setup-content-tab">
              <div className="demo-highlight-box">
                <Sparkles size={24} className="sparkle-icon" />
                <h4>Interactive Demo Board</h4>
                <p>
                  Loaded with realistic Trello cards, duplicate labels ("Bug", "High Priority", "Frontend"), and unused labels to test the cleaning workflow risk-free.
                </p>
                <div className="demo-actions-row">
                  <button className="btn-primary-save" onClick={handleSwitchToDemo}>
                    Switch to Demo Mode
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      onResetDemo();
                      alert('Demo data restored to initial state!');
                    }}
                  >
                    Reset Demo Board Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
