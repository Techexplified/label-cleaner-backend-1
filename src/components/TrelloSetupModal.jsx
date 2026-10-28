import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Shield, Copy, Check, Key, BookOpen, Save } from 'lucide-react';

export default function TrelloSetupModal({
  isOpen,
  onClose,
  credentials = {},
  onSaveCredentials,
  initialTab = 'credentials',
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(credentials.apiKey || '');
  const [tokenInput, setTokenInput] = useState(credentials.token || '');

  useEffect(() => {
    setApiKeyInput(credentials.apiKey || '');
    setTokenInput(credentials.token || '');
  }, [credentials]);

  if (!isOpen) return null;

  const configuredAppUrl = import.meta.env.VITE_APP_URL ? import.meta.env.VITE_APP_URL.replace(/\/$/, '') : '';
  const connectorUrl = configuredAppUrl
    ? `${configuredAppUrl}/connector.html`
    : (typeof window !== 'undefined'
      ? `${window.location.origin}/connector.html`
      : 'https://your-domain.vercel.app/connector.html');

  const handleCopy = () => {
    navigator.clipboard?.writeText(connectorUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCreds = (e) => {
    e.preventDefault();
    if (onSaveCredentials) {
      onSaveCredentials({
        apiKey: apiKeyInput.trim(),
        token: tokenInput.trim(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="setup-modal-container" style={{ maxWidth: '580px' }}>
        <div className="setup-modal-header">
          <div className="header-badge-row">
            <Shield size={18} className="shield-icon" />
            <h3>Trello Power-Up Setup &amp; Settings</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #091E4224',
          padding: '0 24px',
          gap: '8px',
          background: '#FAFBFC'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: activeTab === 'guide' ? '600' : '500',
              color: activeTab === 'guide' ? '#0C66E4' : '#44546F',
              borderBottom: activeTab === 'guide' ? '2px solid #0C66E4' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={15} />
            <span>Setup Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: activeTab === 'credentials' ? '600' : '500',
              color: activeTab === 'credentials' ? '#0C66E4' : '#44546F',
              borderBottom: activeTab === 'credentials' ? '2px solid #0C66E4' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Key size={15} />
            <span>API Credentials (Optional)</span>
          </button>
        </div>

        <div className="setup-modal-body" style={{ maxHeight: '480px', overflowY: 'auto' }}>
          {activeTab === 'guide' ? (
            <div className="setup-content-tab">
              <div className="info-banner">
                <strong>Native Trello Integration:</strong>
                <p>
                  Label Cleaner runs directly inside your Trello boards. Follow the steps below to connect this Power-Up to your Trello workspace.
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
                    <p>Under <strong>Capabilities</strong>, enable <code>Board buttons</code> and paste this URL:</p>
                    <div className="copy-url-box">
                      <code>{connectorUrl}</code>
                      <button
                        className="copy-btn"
                        onClick={handleCopy}
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-num">4</div>
                  <div className="step-body">
                    <strong>Open Any Board &amp; Click Label Cleaner</strong>
                    <p>
                      On your Trello board &gt; Click <strong>Power-Ups</strong> &gt; Add <strong>Label Cleaner</strong>! It will open directly in the board modal iframe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveCreds} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="info-banner" style={{ background: '#E9F2FF', borderColor: '#B7D4FF' }}>
                <strong style={{ color: '#0C66E4' }}>API Key &amp; Token Information:</strong>
                <p style={{ color: '#172B4D', marginTop: '4px' }}>
                  Scanning labels operates natively inside Trello without requiring any API keys. For write operations like merging or deleting labels, you can provide your Trello API Key and Token below.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#172B4D', marginBottom: '6px' }}>
                  Trello API Key
                </label>
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your 32-character Trello API Key"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #8590A2',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                <a
                  href="https://trello.com/power-ups/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#0C66E4', marginTop: '4px', textDecoration: 'none' }}
                >
                  <span>Get API Key from Trello Power-Up Admin</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#172B4D', marginBottom: '6px' }}>
                  Trello Member Token
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste your Trello User Token"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #8590A2',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                {apiKeyInput && (
                  <a
                    href={`https://trello.com/1/authorize?expiration=never&name=Label%20Cleaner&scope=read,write&response_type=token&key=${apiKeyInput}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#0C66E4', marginTop: '4px', textDecoration: 'none' }}
                  >
                    <span>Generate Token with this API Key</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-save"
                  style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
