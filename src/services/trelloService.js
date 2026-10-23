// Trello pastel label colors definition matching Trello's actual UI
export const TRELLO_COLORS = {
  green: { label: 'Green', hex: '#61bd4f', darkHex: '#216e4e', bg: '#7ee2b8', lightBg: '#baf3db', text: '#172b4d', dot: '#22c55e' },
  yellow: { label: 'Yellow', hex: '#f2d600', darkHex: '#7f5f01', bg: '#ffe380', lightBg: '#fff0b3', text: '#172b4d', dot: '#eab308' },
  orange: { label: 'Orange', hex: '#ff9f1a', darkHex: '#a54800', bg: '#fec195', lightBg: '#ffe2cf', text: '#172b4d', dot: '#f97316' },
  red: { label: 'Red', hex: '#eb5a46', darkHex: '#ae2e24', bg: '#ff8f73', lightBg: '#ffd5d2', text: '#172b4d', dot: '#ef4444' },
  purple: { label: 'Purple', hex: '#c377e0', darkHex: '#5e4db2', bg: '#d8a0ff', lightBg: '#eed7fe', text: '#172b4d', dot: '#a855f7' },
  blue: { label: 'Blue', hex: '#0079bf', darkHex: '#0055cc', bg: '#8bccf8', lightBg: '#cce9ff', text: '#172b4d', dot: '#3b82f6' },
  sky: { label: 'Sky', hex: '#00c2e0', darkHex: '#206a83', bg: '#8fe9f4', lightBg: '#cbf4f9', text: '#172b4d', dot: '#06b6d4' },
  lime: { label: 'Lime', hex: '#51e898', darkHex: '#4c6b1f', bg: '#b3f18a', lightBg: '#dcf9c4', text: '#172b4d', dot: '#84cc16' },
  pink: { label: 'Pink', hex: '#ff78cb', darkHex: '#943d73', bg: '#fbb7db', lightBg: '#fdd9ec', text: '#172b4d', dot: '#ec4899' },
  black: { label: 'Black', hex: '#344563', darkHex: '#172b4d', bg: '#dcdfe4', lightBg: '#eceef1', text: '#172b4d', dot: '#475569' },
  null: { label: 'No Color', hex: '#b3bac5', darkHex: '#626f86', bg: '#e9ecef', lightBg: '#f8f9fa', text: '#172b4d', dot: '#94a3b8' },
};

export const DEFAULT_APP_KEY = '5f4d8e3b2a1c0d9e8f7a6b5c4d3e2f1a';

// Build exact cards matching all screenshots
const buildDemoCards = () => {
  const cards = [];

  // 18 cards for 'lbl-bug-1' (Bug)
  for (let i = 1; i <= 18; i++) {
    cards.push({ id: `c-bug-${i}`, name: `Bug issue #${i}: Resolve layout/api glitch`, idLabels: ['lbl-bug-1'] });
  }
  // 6 cards for 'lbl-bug-2' (bug)
  for (let i = 1; i <= 6; i++) {
    cards.push({ id: `c-bugdup-${i}`, name: `bug report #${i}: Navigation responsive issue`, idLabels: ['lbl-bug-2'] });
  }

  // 12 cards for 'lbl-qa-1' (QA)
  for (let i = 1; i <= 12; i++) {
    cards.push({ id: `c-qa-${i}`, name: `QA test suite #${i}: Validation on checkout`, idLabels: ['lbl-qa-1'] });
  }
  // 3 cards for 'lbl-qa-2' (qa)
  for (let i = 1; i <= 3; i++) {
    cards.push({ id: `c-qadup-${i}`, name: `qa task #${i}: Browser compatibility check`, idLabels: ['lbl-qa-2'] });
  }

  // 8 cards for 'lbl-review-1' (Review)
  for (let i = 1; i <= 8; i++) {
    cards.push({ id: `c-rev-${i}`, name: `Review PR #${i}: Payment gateway refactor`, idLabels: ['lbl-review-1'] });
  }
  // 2 cards for 'lbl-review-2' (review)
  for (let i = 1; i <= 2; i++) {
    cards.push({ id: `c-revdup-${i}`, name: `review task #${i}: Update analytics events`, idLabels: ['lbl-review-2'] });
  }

  // 5 cards for 'lbl-test-1' (Testing)
  for (let i = 1; i <= 5; i++) {
    cards.push({ id: `c-test-${i}`, name: `Testing suite #${i}: End-to-end user signup`, idLabels: ['lbl-test-1'] });
  }
  // 4 cards for 'lbl-test-2' (testing)
  for (let i = 1; i <= 4; i++) {
    cards.push({ id: `c-testdup-${i}`, name: `testing item #${i}: Unit test coverage improvement`, idLabels: ['lbl-test-2'] });
  }

  // 4 cards for Docs
  for (let i = 1; i <= 4; i++) {
    cards.push({ id: `c-docs-${i}`, name: `API documentation update #${i}`, idLabels: ['lbl-docs'] });
  }

  // 8 cards for Design
  for (let i = 1; i <= 8; i++) {
    cards.push({ id: `c-des-${i}`, name: `Design component audit #${i}`, idLabels: ['lbl-design'] });
  }

  // Other active labels
  cards.push({ id: 'c-active-fe', name: 'Frontend state refactoring', idLabels: ['lbl-fe'] });
  cards.push({ id: 'c-active-be', name: 'Database index tuning', idLabels: ['lbl-be'] });
  cards.push({ id: 'c-active-sec', name: 'Security audit on credentials', idLabels: ['lbl-sec'] });

  return cards;
};

// Initial Demo Board Data matching all Screenshots:
// Exactly 24 Total Labels, 4 Duplicate Groups, 7 Unused Labels
export const INITIAL_DEMO_DATA = {
  board: {
    id: 'demo-board-101',
    name: 'Product Roadmap & Sprint Board',
  },
  labels: [
    // Duplicate Group 1: Bug / bug
    { id: 'lbl-bug-1', name: 'Bug', color: 'red' },
    { id: 'lbl-bug-2', name: 'bug', color: 'red' },

    // Duplicate Group 2: QA / qa
    { id: 'lbl-qa-1', name: 'QA', color: 'green' },
    { id: 'lbl-qa-2', name: 'qa', color: 'green' },

    // Duplicate Group 3: Review / review
    { id: 'lbl-review-1', name: 'Review', color: 'yellow' },
    { id: 'lbl-review-2', name: 'review', color: 'yellow' },

    // Duplicate Group 4: Testing / testing
    { id: 'lbl-test-1', name: 'Testing', color: 'purple' },
    { id: 'lbl-test-2', name: 'testing', color: 'purple' },

    // Active Unique Labels (Matching Image 4)
    { id: 'lbl-docs', name: 'Docs', color: 'orange' },
    { id: 'lbl-design', name: 'Design', color: 'pink' },
    { id: 'lbl-fe', name: 'Frontend', color: 'blue' },
    { id: 'lbl-be', name: 'Backend', color: 'purple' },
    { id: 'lbl-sec', name: 'Security', color: 'black' },

    // 7 Unused Labels (Matching Image 2 & 3: 0 cards attached)
    { id: 'lbl-unused-blocked', name: 'Blocked', color: 'red' },
    { id: 'lbl-unused-hold', name: 'On Hold', color: 'orange' },
    { id: 'lbl-unused-low', name: 'Low Priority', color: 'blue' },
    { id: 'lbl-unused-info', name: 'Need Info', color: 'purple' },
    { id: 'lbl-unused-archived', name: 'Archived', color: 'black' },
    { id: 'lbl-unused-client', name: 'Client Review', color: 'pink' },
    { id: 'lbl-unused-internal', name: 'Internal', color: 'green' },
  ],
  cards: buildDemoCards(),
};

// Check if running inside Trello Power-Up iframe
export function isTrelloIframe() {
  try {
    return (
      typeof window !== 'undefined' &&
      window.TrelloPowerUp &&
      window.parent &&
      window.parent !== window
    );
  } catch {
    return false;
  }
}

// Get Trello Power-Up instance if in iframe
let trelloIframeInstance = null;
export function getTrelloIframe() {
  if (trelloIframeInstance) return trelloIframeInstance;
  if (isTrelloIframe()) {
    try {
      trelloIframeInstance = window.TrelloPowerUp.iframe();
      return trelloIframeInstance;
    } catch (e) {
      console.warn('Could not initialize TrelloPowerUp.iframe()', e);
    }
  }
  return null;
}

// Close Trello modal
export function closeTrelloModal() {
  const t = getTrelloIframe();
  if (t && typeof t.closeModal === 'function') {
    t.closeModal();
  }
}

// Storage helpers
const STORAGE_KEYS = {
  API_KEY: 'trello_label_cleaner_api_key',
  API_TOKEN: 'trello_label_cleaner_token',
  SELECTED_BOARD: 'trello_label_cleaner_selected_board',
  DEMO_DATA: 'trello_label_cleaner_demo_data',
  MODE: 'trello_label_cleaner_mode', // 'powerup' | 'api' | 'demo'
};

export function getSavedCredentials() {
  return {
    apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || DEFAULT_APP_KEY,
    token: localStorage.getItem(STORAGE_KEYS.API_TOKEN) || '',
    boardId: localStorage.getItem(STORAGE_KEYS.SELECTED_BOARD) || '',
    mode: isTrelloIframe() ? 'powerup' : (localStorage.getItem(STORAGE_KEYS.MODE) || 'demo'),
  };
}

export function saveCredentials({ apiKey, token, boardId, mode }) {
  if (apiKey !== undefined) localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  if (token !== undefined) localStorage.setItem(STORAGE_KEYS.API_TOKEN, token);
  if (boardId !== undefined) localStorage.setItem(STORAGE_KEYS.SELECTED_BOARD, boardId);
  if (mode !== undefined) localStorage.setItem(STORAGE_KEYS.MODE, mode);
}

// Get token from Trello Power-Up private storage or localStorage
export async function getTrelloPowerUpToken() {
  const t = getTrelloIframe();
  if (t) {
    try {
      const stored = await t.get('member', 'private', 'trello_token');
      if (stored) return stored;
    } catch (e) {
      console.warn('Could not read token from Trello member storage', e);
    }
  }
  return localStorage.getItem(STORAGE_KEYS.API_TOKEN) || '';
}

// Save token to Trello Power-Up private storage
export async function saveTrelloPowerUpToken(token) {
  const t = getTrelloIframe();
  if (t) {
    try {
      await t.set('member', 'private', 'trello_token', token);
    } catch (e) {
      console.warn('Could not write token to Trello member storage', e);
    }
  }
  localStorage.setItem(STORAGE_KEYS.API_TOKEN, token);
}

// Open official Trello OAuth window for seamless 1-click user authorization
export function openTrelloAuthPopup(apiKey = DEFAULT_APP_KEY) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const returnUrl = encodeURIComponent(`${origin}/auth.html`);
  const authUrl = `https://trello.com/1/authorize?expiration=never&name=Label+Cleaner+Power-Up&scope=read,write&response_type=token&key=${apiKey}&return_url=${returnUrl}`;
  const width = 580;
  const height = 640;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  return new Promise((resolve, reject) => {
    const popup = window.open(
      authUrl,
      'trello_auth_window',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no`
    );

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'TRELLO_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        const token = event.data.token;
        saveTrelloPowerUpToken(token);
        resolve(token);
      }
    };

    window.addEventListener('message', handleMessage);

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        window.removeEventListener('message', handleMessage);
        const token = localStorage.getItem(STORAGE_KEYS.API_TOKEN);
        if (token) resolve(token);
        else reject(new Error('Trello authorization window closed.'));
      }
    }, 800);
  });
}

// Demo Board State in LocalStorage
export function getDemoData() {
  const stored = localStorage.getItem(STORAGE_KEYS.DEMO_DATA);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing demo data', e);
    }
  }
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

export function saveDemoData(data) {
  localStorage.setItem(STORAGE_KEYS.DEMO_DATA, JSON.stringify(data));
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.DEMO_DATA);
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

// Read data directly from active Trello Board inside Power-Up
export async function getTrelloNativeBoardData() {
  const t = getTrelloIframe();
  if (!t) return null;

  const [boardData, cardsData] = await Promise.all([
    t.board('id', 'name', 'labels'),
    t.cards('id', 'name', 'idLabels', 'labels'),
  ]);

  return {
    board: { id: boardData.id, name: boardData.name },
    labels: boardData.labels || [],
    cards: cardsData || [],
  };
}

// Live Trello REST API calls
export async function fetchTrelloBoards(apiKey, token) {
  const res = await fetch(`https://api.trello.com/1/members/me/boards?filter=open&fields=id,name,shortUrl&key=${apiKey}&token=${token}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch boards (${res.status} ${res.statusText})`);
  }
  return await res.json();
}

export async function fetchLiveBoardData(boardId, apiKey, token) {
  const [boardRes, labelsRes, cardsRes] = await Promise.all([
    fetch(`https://api.trello.com/1/boards/${boardId}?fields=id,name,shortUrl&key=${apiKey}&token=${token}`),
    fetch(`https://api.trello.com/1/boards/${boardId}/labels?fields=id,name,color&key=${apiKey}&token=${token}`),
    fetch(`https://api.trello.com/1/boards/${boardId}/cards?fields=id,name,idLabels&key=${apiKey}&token=${token}`)
  ]);

  if (!boardRes.ok || !labelsRes.ok || !cardsRes.ok) {
    throw new Error('Failed to fetch board data from Trello API.');
  }

  const board = await boardRes.json();
  const labels = await labelsRes.json();
  const cards = await cardsRes.json();

  return { board, labels, cards };
}

export async function deleteLiveLabel(labelId, apiKey, token) {
  const res = await fetch(`https://api.trello.com/1/labels/${labelId}?key=${apiKey}&token=${token}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete label (${res.status})`);
  return true;
}

export async function updateLiveLabel(labelId, { name, color }, apiKey, token) {
  const params = new URLSearchParams();
  if (name !== undefined) params.append('name', name);
  if (color !== undefined) params.append('color', color || 'null');

  const res = await fetch(`https://api.trello.com/1/labels/${labelId}?${params.toString()}&key=${apiKey}&token=${token}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error(`Failed to update label (${res.status})`);
  return await res.json();
}

export async function createLiveLabel(boardId, { name, color }, apiKey, token) {
  const params = new URLSearchParams({
    idBoard: boardId,
    name: name || '',
    color: color || 'null',
    key: apiKey,
    token: token
  });
  const res = await fetch(`https://api.trello.com/1/labels?${params.toString()}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to create label (${res.status})`);
  return await res.json();
}

export async function mergeLiveLabel(sourceLabelId, targetLabelId, cards, apiKey, token) {
  const affectedCards = cards.filter(c => (c.idLabels || []).includes(sourceLabelId));
  for (const card of affectedCards) {
    if (!card.idLabels.includes(targetLabelId)) {
      await fetch(`https://api.trello.com/1/cards/${card.id}/idLabels?value=${targetLabelId}&key=${apiKey}&token=${token}`, {
        method: 'POST'
      });
    }
    await fetch(`https://api.trello.com/1/cards/${card.id}/idLabels/${sourceLabelId}?key=${apiKey}&token=${token}`, {
      method: 'DELETE'
    });
  }
  await deleteLiveLabel(sourceLabelId, apiKey, token);
  return true;
}

// Compute analysis on board labels and cards
export function analyzeLabels(labels = [], cards = []) {
  const usageMap = {};
  labels.forEach(lbl => {
    usageMap[lbl.id] = {
      count: 0,
      cards: [],
    };
  });

  cards.forEach(card => {
    (card.idLabels || []).forEach(lblId => {
      if (usageMap[lblId]) {
        usageMap[lblId].count += 1;
        usageMap[lblId].cards.push(card);
      }
    });
  });

  // Calculate Unused Labels (labels with 0 cards)
  const unusedLabels = labels.filter(lbl => (usageMap[lbl.id]?.count || 0) === 0);

  // Group duplicate labels (case-insensitive name match)
  const duplicateGroups = [];
  const nameGroups = {};

  labels.forEach(lbl => {
    const rawName = (lbl.name || '').trim();
    const normalized = rawName.toLowerCase();
    if (!nameGroups[normalized]) {
      nameGroups[normalized] = [];
    }
    nameGroups[normalized].push({
      ...lbl,
      usageCount: usageMap[lbl.id]?.count || 0,
      cards: usageMap[lbl.id]?.cards || [],
    });
  });

  Object.entries(nameGroups).forEach(([normName, groupLabels]) => {
    if (groupLabels.length > 1 && normName.length > 0) {
      const sortedByUsage = [...groupLabels].sort((a, b) => b.usageCount - a.usageCount);
      const canonicalId = sortedByUsage[0].id;

      duplicateGroups.push({
        normalizedName: normName,
        displayName: sortedByUsage[0].name,
        canonicalId,
        labels: sortedByUsage,
        totalOccurrences: sortedByUsage.reduce((sum, l) => sum + l.usageCount, 0),
        extraLabelsCount: sortedByUsage.length - 1,
      });
    }
  });

  // Sort groups by total occurrences descending
  duplicateGroups.sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  const totalDuplicateLabelsCount = duplicateGroups.reduce(
    (sum, grp) => sum + grp.labels.length - 1,
    0
  );

  return {
    labelsWithStats: labels.map(lbl => ({
      ...lbl,
      usageCount: usageMap[lbl.id]?.count || 0,
      cards: usageMap[lbl.id]?.cards || [],
    })),
    duplicateGroups,
    unusedLabels: unusedLabels.map(lbl => ({
      ...lbl,
      usageCount: 0,
      cards: [],
    })),
    totalLabelsCount: labels.length,
    duplicateLabelsCount: totalDuplicateLabelsCount,
    unusedLabelsCount: unusedLabels.length,
  };
}
