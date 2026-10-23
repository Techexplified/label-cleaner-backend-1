import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import DuplicateLabelsView from './components/DuplicateLabelsView';
import UnusedLabelsView from './components/UnusedLabelsView';
import AllLabelsView from './components/AllLabelsView';
import TrelloSetupModal from './components/TrelloSetupModal';
import confetti from 'canvas-confetti';
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
  getDemoData,
  saveDemoData,
  resetDemoData,
  fetchLiveBoardData,
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
  const [mode, setMode] = useState('demo'); // 'demo' | 'api' | 'powerup'
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

  // Load Data based on mode
  const loadData = useCallback(async (currentMode = mode, creds = credentials) => {
    setIsScanning(true);
    try {
      // 1. Running inside Trello Power-Up modal iframe
      if (isTrelloIframe()) {
        const trelloData = await getTrelloNativeBoardData();
        if (trelloData) {
          setBoardInfo(trelloData.board);
          setRawLabels(trelloData.labels);
          setRawCards(trelloData.cards);

          const res = analyzeLabels(trelloData.labels, trelloData.cards);
          setAnalysis(res);
          return;
        }
      }

      // 2. Connected via REST API
      if (currentMode === 'api' && creds.apiKey && creds.token && creds.boardId) {
        const liveData = await fetchLiveBoardData(creds.boardId, creds.apiKey, creds.token);
        setBoardInfo({ id: liveData.board.id, name: liveData.board.name });
        setRawLabels(liveData.labels);
        setRawCards(liveData.cards);

        const res = analyzeLabels(liveData.labels, liveData.cards);
        setAnalysis(res);
        return;
      }

      // 3. Standalone / Demo Mode (Product Roadmap & Sprint Board)
      const demo = getDemoData();
      setBoardInfo(demo.board);
      setRawLabels(demo.labels);
      setRawCards(demo.cards);

      const res = analyzeLabels(demo.labels, demo.cards);
      setAnalysis(res);
    } catch (err) {
      console.error('Error loading data:', err);
      showToast(`Error: ${err.message || 'Failed to load board data'}`);
    } finally {
      setIsScanning(false);
    }
  }, [mode, credentials]);

  // Initial mount
  useEffect(() => {
    const inIframe = isTrelloIframe();
    setIsTrello(inIframe);
    if (inIframe) {
      setMode('powerup');
      loadData('powerup');
    } else {
      const creds = getSavedCredentials();
      setMode(creds.mode);
      loadData(creds.mode, creds);
    }
  }, [loadData]);

  // Handle Scan action from Home screen
  const handleScan = async () => {
    setIsScanning(true);
    if (isTrello) {
      // Re-read latest board data directly from Trello
      try {
        const trelloData = await getTrelloNativeBoardData();
        if (trelloData) {
          setBoardInfo(trelloData.board);
          setRawLabels(trelloData.labels);
          setRawCards(trelloData.cards);
          const res = analyzeLabels(trelloData.labels, trelloData.cards);
          setAnalysis(res);
        }
      } catch (e) {
        console.warn('Error refreshing Trello board data', e);
      }
    }

    setTimeout(() => {
      const res = analyzeLabels(rawLabels, rawCards);
      setAnalysis(res);
      setIsScanned(true);
      setIsScanning(false);

      if (res.duplicateLabelsCount === 0 && res.unusedLabelsCount === 0) {
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
    }, 500);
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

  // Merge single duplicate cluster
  const handleMergeCluster = async (group, canonicalId) => {
    setIsOperating(true);
    try {
      const redundantLabels = group.labels.filter((l) => l.id !== canonicalId);
      const redundantIds = redundantLabels.map((l) => l.id);

      if (isTrello || mode === 'api') {
        const token = await ensureTrelloToken();
        const apiKey = credentials.apiKey;

        for (const redLbl of redundantLabels) {
          await mergeLiveLabel(redLbl.id, canonicalId, rawCards, apiKey, token);
        }
        await loadData(mode, { ...credentials, token });
        showToast(`Merged duplicate "${group.displayName}" on Trello board!`);
      } else {
        // Demo Mode / Local State
        const updatedCards = rawCards.map((card) => {
          const hasRedundant = (card.idLabels || []).some((id) => redundantIds.includes(id));
          if (!hasRedundant) return card;

          const filtered = (card.idLabels || []).filter((id) => !redundantIds.includes(id));
          if (!filtered.includes(canonicalId)) {
            filtered.push(canonicalId);
          }
          return { ...card, idLabels: filtered };
        });

        const updatedLabels = rawLabels.filter((l) => !redundantIds.includes(l.id));

        setRawCards(updatedCards);
        setRawLabels(updatedLabels);
        saveDemoData({ board: boardInfo, labels: updatedLabels, cards: updatedCards });

        const res = analyzeLabels(updatedLabels, updatedCards);
        setAnalysis(res);
        showToast(`Merged duplicate "${group.displayName}" into canonical label!`);
      }
    } catch (err) {
      console.error(err);
      showToast(`Merge failed: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Merge all duplicate clusters
  const handleMergeAll = async (selectedCanonicals) => {
    setIsOperating(true);
    try {
      let token = '';
      if (isTrello || mode === 'api') {
        token = await ensureTrelloToken();
      }

      let updatedCards = [...rawCards];
      let updatedLabels = [...rawLabels];

      for (const group of analysis.duplicateGroups) {
        const canonicalId = selectedCanonicals[group.normalizedName] || group.canonicalId;
        const redundantLabels = group.labels.filter((l) => l.id !== canonicalId);
        const redundantIds = redundantLabels.map((l) => l.id);

        if (isTrello || mode === 'api') {
          for (const redLbl of redundantLabels) {
            await mergeLiveLabel(redLbl.id, canonicalId, updatedCards, credentials.apiKey, token);
          }
        } else {
          updatedCards = updatedCards.map((card) => {
            const hasRedundant = (card.idLabels || []).some((id) => redundantIds.includes(id));
            if (!hasRedundant) return card;

            const filtered = (card.idLabels || []).filter((id) => !redundantIds.includes(id));
            if (!filtered.includes(canonicalId)) {
              filtered.push(canonicalId);
            }
            return { ...card, idLabels: filtered };
          });
          updatedLabels = updatedLabels.filter((l) => !redundantIds.includes(l.id));
        }
      }

      if (isTrello || mode === 'api') {
        await loadData(mode, { ...credentials, token });
      } else {
        setRawCards(updatedCards);
        setRawLabels(updatedLabels);
        saveDemoData({ board: boardInfo, labels: updatedLabels, cards: updatedCards });
        const res = analyzeLabels(updatedLabels, updatedCards);
        setAnalysis(res);
      }
      showToast('All duplicate labels have been successfully merged!');
    } catch (err) {
      console.error(err);
      showToast(`Auto-merge failed: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Delete batch of labels (unused or selected)
  const handleDeleteLabels = async (labelIds) => {
    setIsOperating(true);
    try {
      if (isTrello || mode === 'api') {
        const token = await ensureTrelloToken();
        for (const id of labelIds) {
          await deleteLiveLabel(id, credentials.apiKey, token);
        }
        await loadData(mode, { ...credentials, token });
      } else {
        const updatedLabels = rawLabels.filter((l) => !labelIds.includes(l.id));
        const updatedCards = rawCards.map((c) => ({
          ...c,
          idLabels: (c.idLabels || []).filter((id) => !labelIds.includes(id)),
        }));

        setRawLabels(updatedLabels);
        setRawCards(updatedCards);
        saveDemoData({ board: boardInfo, labels: updatedLabels, cards: updatedCards });

        const res = analyzeLabels(updatedLabels, updatedCards);
        setAnalysis(res);
      }
      showToast(`Deleted ${labelIds.length} label(s) from board.`);
    } catch (err) {
      console.error(err);
      showToast(`Deletion failed: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Create new label
  const handleCreateLabel = async ({ name, color }) => {
    setIsOperating(true);
    try {
      if (isTrello || mode === 'api') {
        const token = await ensureTrelloToken();
        await createLiveLabel(boardInfo.id, { name, color }, credentials.apiKey, token);
        await loadData(mode, { ...credentials, token });
      } else {
        const newLbl = {
          id: `lbl-${Date.now()}`,
          name: name.trim(),
          color: color || 'blue',
        };
        const updatedLabels = [...rawLabels, newLbl];
        setRawLabels(updatedLabels);
        saveDemoData({ board: boardInfo, labels: updatedLabels, cards: rawCards });

        const res = analyzeLabels(updatedLabels, rawCards);
        setAnalysis(res);
      }
      showToast(`Created label "${name || 'unnamed'}"`);
    } catch (err) {
      showToast(`Failed to create label: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Update existing label
  const handleUpdateLabel = async (labelId, { name, color }) => {
    setIsOperating(true);
    try {
      if (isTrello || mode === 'api') {
        const token = await ensureTrelloToken();
        await updateLiveLabel(labelId, { name, color }, credentials.apiKey, token);
        await loadData(mode, { ...credentials, token });
      } else {
        const updatedLabels = rawLabels.map((l) => (l.id === labelId ? { ...l, name, color } : l));
        setRawLabels(updatedLabels);
        saveDemoData({ board: boardInfo, labels: updatedLabels, cards: rawCards });

        const res = analyzeLabels(updatedLabels, rawCards);
        setAnalysis(res);
      }
      showToast(`Updated label "${name}"`);
    } catch (err) {
      showToast(`Failed to update label: ${err.message}`);
    } finally {
      setIsOperating(false);
    }
  };

  // Save Credentials & reload
  const handleSaveCredentials = (newCreds) => {
    saveCredentials(newCreds);
    setCredentials((prev) => ({ ...prev, ...newCreds }));
    if (newCreds.mode) {
      setMode(newCreds.mode);
      loadData(newCreds.mode, { ...credentials, ...newCreds });
    }
  };

  // Reset Demo
  const handleResetDemo = () => {
    const fresh = resetDemoData();
    setBoardInfo(fresh.board);
    setRawLabels(fresh.labels);
    setRawCards(fresh.cards);
    setIsScanned(false);
    const res = analyzeLabels(fresh.labels, fresh.cards);
    setAnalysis(res);
    showToast('Demo board data reset to original state.');
  };

  // Close handler: In Trello calls t.closeModal()
  const handleClose = () => {
    if (isTrello) {
      closeTrelloModal();
    } else {
      showToast('In trello.com, this closes the Power-Up modal window.');
    }
  };

  // Execute pending action after authorization
  const handleConfirmAuth = async () => {
    setShowAuthPrompt(false);
    if (pendingAction) {
      try {
        await pendingAction();
      } catch (e) {
        showToast(e.message || 'Authorization cancelled.');
      }
      setPendingAction(null);
    }
  };

  return (
    <div className={`app-wrapper ${isTrello ? 'trello-iframe-mode' : 'standalone-mode'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="app-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Modal Frame matching screenshot */}
      <div className="label-cleaner-modal">
        {/* Header */}
        <Header
          boardName={boardInfo.name}
          mode={mode}
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

      {/* Trello Settings / Power-Up Setup Modal */}
      <TrelloSetupModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        credentials={credentials}
        onSaveCredentials={handleSaveCredentials}
        onResetDemo={handleResetDemo}
        isTrello={isTrello}
      />
    </div>
  );
}

export default App;
