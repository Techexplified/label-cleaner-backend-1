import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import DuplicateLabelsView from './components/DuplicateLabelsView';
import UnusedLabelsView from './components/UnusedLabelsView';
import AllLabelsView from './components/AllLabelsView';
import TrelloSetupModal from './components/TrelloSetupModal';
import TagIllustration from './components/TagIllustration';
import confetti from 'canvas-confetti';
import { Tag, ExternalLink, Shield } from 'lucide-react';
import {
  isTrelloIframe,
  getTrelloIframe,
  closeTrelloModal,
  getSavedCredentials,
  saveCredentials,
  getTrelloPowerUpToken,
  saveTrelloPowerUpToken,
  openTrelloAuthPopup,
  getTrelloNativeBoardData,
  deleteLiveLabel,
  updateLiveLabel,
  createLiveLabel,
  mergeLiveLabel,
  analyzeLabels,
} from './services/trelloService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isTrello, setIsTrello] = useState(false);
  const [boardInfo, setBoardInfo] = useState({ id: '', name: '' });
  const [rawLabels, setRawLabels] = useState([]);
  const [rawCards, setRawCards] = useState([]);

  // Scanning & Analysis state
  const [isScanned, setIsScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [analysis, setAnalysis] = useState({
    labelsWithStats: [],
    duplicateGroups: [],
    unusedLabels: [],
    totalLabelsCount: 0,
    duplicateLabelsCount: 0,
    unusedLabelsCount: 0,
  });

  // Settings & Credentials
  const [credentials, setCredentials] = useState(getSavedCredentials());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Trello write authorization prompt modal
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load Data directly from active Trello board
  const loadData = useCallback(async () => {
    setIsScanning(true);
    try {
      if (isTrelloIframe()) {
        const trelloData = await getTrelloNativeBoardData();
        if (trelloData) {
          setBoardInfo(trelloData.board);
          setRawLabels(trelloData.labels);
          setRawCards(trelloData.cards);

          const res = analyzeLabels(trelloData.labels, trelloData.cards);
          setAnalysis(res);
          setIsScanned(true);

          if (res.totalLabelsCount > 0 && res.duplicateLabelsCount === 0 && res.unusedLabelsCount === 0) {
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading board data:', err);
      showToast(`Error: ${err.message || 'Failed to load board data'}`);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Initial mount & Trello render hook
  useEffect(() => {
    // Reset any unwanted horizontal scroll position
    window.scrollTo(0, 0);
    const inIframe = isTrelloIframe();
    setIsTrello(inIframe);
    if (inIframe) {
      loadData();

      // Hook into Trello Power-Up lifecycle
      const t = getTrelloIframe();
      if (t && typeof t.render === 'function') {
        t.render(() => {
          loadData();
        });
      }
    }
  }, [loadData]);

  // Handle Scan action from Home screen
  const handleScan = async () => {
    setIsScanning(true);
    try {
      let freshLabels = rawLabels;
      let freshCards = rawCards;

      if (isTrelloIframe()) {
        const trelloData = await getTrelloNativeBoardData();
        if (trelloData) {
          setBoardInfo(trelloData.board);
          freshLabels = trelloData.labels;
          freshCards = trelloData.cards;
          setRawLabels(freshLabels);
          setRawCards(freshCards);
        }
      }

      const res = analyzeLabels(freshLabels, freshCards);
      setAnalysis(res);
      setIsScanned(true);

      if (res.totalLabelsCount > 0 && res.duplicateLabelsCount === 0 && res.unusedLabelsCount === 0) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }

      if (freshLabels.length === 0) {
        showToast('No labels detected on this board.');
      } else {
        showToast(`Scan complete: ${res.totalLabelsCount} labels analyzed.`);
      }
    } catch (e) {
      console.error('Error refreshing Trello board data', e);
      showToast(`Scan error: ${e.message || 'Failed to scan board'}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Helper to ensure Trello token is available before write operations
  const ensureTrelloToken = async () => {
    let token = await getTrelloPowerUpToken();
    if (token) return token;

    // If no token in Trello mode, open authorization prompt
    return new Promise((resolve, reject) => {
      setPendingAction(() => async () => {
        try {
          const newToken = await openTrelloAuthPopup(credentials.apiKey);
          await saveTrelloPowerUpToken(newToken);
          setCredentials(prev => ({ ...prev, token: newToken }));
          resolve(newToken);
        } catch (err) {
          reject(err);
        }
      });
      setShowAuthPrompt(true);
    });
  };

  // Merge single duplicate cluster directly on Trello
  const handleMergeCluster = async (group, canonicalId) => {
    setIsOperating(true);
    try {
      const redundantLabels = group.labels.filter((l) => l.id !== canonicalId);
      const token = await ensureTrelloToken();
      const apiKey = credentials.apiKey;

      for (const redLbl of redundantLabels) {
        await mergeLiveLabel(redLbl.id, canonicalId, rawCards, apiKey, token);
      }
      await loadData();
      showToast(`Merged duplicate "${group.displayName}" on Trello board!`);
    } catch (err) {
      console.error(err);
      showToast(`Merge failed: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Merge all duplicate clusters directly on Trello
  const handleMergeAll = async (selectedCanonicals) => {
    setIsOperating(true);
    try {
      const token = await ensureTrelloToken();
      for (const group of analysis.duplicateGroups) {
        const canonicalId = selectedCanonicals[group.normalizedName] || group.canonicalId;
        const redundantLabels = group.labels.filter((l) => l.id !== canonicalId);

        for (const redLbl of redundantLabels) {
          await mergeLiveLabel(redLbl.id, canonicalId, rawCards, credentials.apiKey, token);
        }
      }

      await loadData();
      showToast('All duplicate labels have been successfully merged!');
    } catch (err) {
      console.error(err);
      showToast(`Auto-merge failed: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Delete batch of labels directly from Trello
  const handleDeleteLabels = async (labelIds) => {
    setIsOperating(true);
    try {
      const token = await ensureTrelloToken();
      for (const id of labelIds) {
        await deleteLiveLabel(id, credentials.apiKey, token);
      }
      await loadData();
      showToast(`Deleted ${labelIds.length} label(s) from board.`);
    } catch (err) {
      console.error(err);
      showToast(`Deletion failed: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Create new label directly on Trello
  const handleCreateLabel = async ({ name, color }) => {
    setIsOperating(true);
    try {
      const token = await ensureTrelloToken();
      await createLiveLabel(boardInfo.id, { name, color }, credentials.apiKey, token);
      await loadData();
      showToast(`Created label "${name || 'unnamed'}"`);
    } catch (err) {
      showToast(`Failed to create label: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Update existing label directly on Trello
  const handleUpdateLabel = async (labelId, { name, color }) => {
    setIsOperating(true);
    try {
      const token = await ensureTrelloToken();
      await updateLiveLabel(labelId, { name, color }, credentials.apiKey, token);
      await loadData();
      showToast(`Updated label "${name}"`);
    } catch (err) {
      showToast(`Failed to update label: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  const handleConfirmAuth = async () => {
    setShowAuthPrompt(false);
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      await action();
    }
  };

  const handleClose = () => {
    closeTrelloModal();
  };

  // When viewed outside of Trello, show official Power-Up installation portal
  if (!isTrello) {
    return (
      <div className="app-wrapper standalone-mode">
        {toastMessage && <div className="app-toast">{toastMessage}</div>}

        <div className="modal-container" style={{ maxWidth: '640px', padding: '0' }}>
          <div className="modal-header">
            <div className="header-left">
              <div className="header-icon-box">
                <Tag className="header-icon" size={18} />
              </div>
              <h1 className="header-title">Label Cleaner</h1>
            </div>
            <div className="header-right">
              <span className="trello-native-pill">
                <span className="online-indicator" />
                <span>Official Trello Power-Up</span>
              </span>
            </div>
          </div>

          <div style={{ padding: '36px 32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <TagIllustration />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#091E42', marginBottom: '8px' }}>
              Trello Power-Up Ready
            </h2>
            <p style={{ fontSize: '14px', color: '#44546F', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 28px' }}>
              Label Cleaner operates directly inside your active Trello boards to detect duplicate labels, remove unused labels, and organize cards.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary-save"
                onClick={() => setIsSettingsOpen(true)}
                style={{ padding: '10px 22px', fontSize: '14px' }}
              >
                <Shield size={16} />
                <span>How to Add to Trello</span>
              </button>
              <a
                href="https://trello.com"
                target="_blank"
                rel="noreferrer"
                className="btn-cancel"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '14px' }}
              >
                <span>Go to Trello</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <TrelloSetupModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    );
  }

  // Inside Trello Board iframe: Full Power-Up UI
  return (
    <div className="app-wrapper trello-iframe-mode">
      {/* Toast Notification */}
      {toastMessage && <div className="app-toast">{toastMessage}</div>}

      {/* Main Power-Up Modal Container */}
      <div className="modal-container label-cleaner-modal">
        {/* Top Header */}
        <Header
          boardName={boardInfo.name}
          isTrello={isTrello}
          onClose={handleClose}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Body (Sidebar + Content View) */}
        <div className="modal-main-body">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stats={analysis}
            isScanned={isScanned}
            onOpenGuide={() => setIsSettingsOpen(true)}
          />

          <main className="modal-content-area">
            {activeTab === 'home' && (
              <HomeView
                stats={analysis}
                isScanned={isScanned}
                isScanning={isScanning}
                onScan={handleScan}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'duplicates' && (
              <DuplicateLabelsView
                duplicateGroups={analysis.duplicateGroups}
                onMergeCluster={handleMergeCluster}
                onMergeAll={handleMergeAll}
                onRescan={handleScan}
                isScanning={isScanning}
                isOperating={isOperating}
                onNavigateHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'unused' && (
              <UnusedLabelsView
                unusedLabels={analysis.unusedLabels}
                onDeleteLabels={handleDeleteLabels}
                onRescan={handleScan}
                isScanning={isScanning}
                isOperating={isOperating}
              />
            )}

            {activeTab === 'all' && (
              <AllLabelsView
                labels={analysis.labelsWithStats}
                onCreateLabel={handleCreateLabel}
                onUpdateLabel={handleUpdateLabel}
                onDeleteLabel={(id) => handleDeleteLabels([id])}
                onMergeLabels={async (srcId, tgtId) => {
                  const srcLabel = rawLabels.find(l => l.id === srcId);
                  const tgtLabel = rawLabels.find(l => l.id === tgtId);
                  if (srcLabel && tgtLabel) {
                    await handleMergeCluster(
                      {
                        normalizedName: srcLabel.name.toLowerCase(),
                        displayName: srcLabel.name,
                        canonicalId: tgtId,
                        labels: [tgtLabel, srcLabel],
                      },
                      tgtId
                    );
                  }
                }}
                isOperating={isOperating}
              />
            )}
          </main>
        </div>
      </div>

      {/* Trello 1-Click Authorization Prompt */}
      {showAuthPrompt && (
        <div className="modal-backdrop">
          <div className="confirm-modal-box">
            <h3 className="confirm-modal-title">Authorize Trello Access</h3>
            <p className="confirm-modal-desc">
              To update cards and merge or delete labels on this board, Trello requires one-time authorization.
            </p>
            <div className="confirm-modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowAuthPrompt(false);
                  setPendingAction(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary-save"
                onClick={handleConfirmAuth}
              >
                Authorize with Trello
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trello Power-Up Setup Guide Modal */}
      <TrelloSetupModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        credentials={credentials}
        onSaveCredentials={(newCreds) => {
          saveCredentials(newCreds);
          setCredentials((prev) => ({ ...prev, ...newCreds }));
          showToast('Settings saved successfully!');
        }}
      />
    </div>
  );
}

export default App;
