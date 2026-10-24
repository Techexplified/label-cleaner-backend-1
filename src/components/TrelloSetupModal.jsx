import React, { useState } from 'react';
import { X, ExternalLink, Shield, Copy, Check } from 'lucide-react';

export default function TrelloSetupModal({
  isOpen,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="modal-backdrop">
      <div className="setup-modal-container">
        <div className="setup-modal-header">
          <div className="header-badge-row">
            <Shield size={18} className="shield-icon" />
            <h3>Trello Power-Up Setup Guide</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="setup-modal-body">
          <div className="setup-content-tab">
            <div className="info-banner">
              <strong>Native Trello Integration (Zero API Keys Needed!):</strong>
              <p>
                Label Cleaner is an official Trello Power-Up. When added to your Trello workspace, it runs natively inside your boards and directly manages cards and labels.
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
        </div>
      </div>
    </div>
  );
}
