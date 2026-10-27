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

export const DEFAULT_APP_KEY = import.meta.env.VITE_TRELLO_API_KEY || '5f4d8e3b2a1c0d9e8f7a6b5c4d3e2f1a';
export const APP_NAME = import.meta.env.VITE_TRELLO_APP_NAME || 'Label Cleaner Power-Up';



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
};

export function getSavedCredentials() {
  return {
    apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || DEFAULT_APP_KEY,
    token: localStorage.getItem(STORAGE_KEYS.API_TOKEN) || '',
    boardId: localStorage.getItem(STORAGE_KEYS.SELECTED_BOARD) || '',
  };
}

export function saveCredentials({ apiKey, token, boardId }) {
  if (apiKey !== undefined) localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  if (token !== undefined) localStorage.setItem(STORAGE_KEYS.API_TOKEN, token);
  if (boardId !== undefined) localStorage.setItem(STORAGE_KEYS.SELECTED_BOARD, boardId);
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
  const configuredAppUrl = import.meta.env.VITE_APP_URL ? import.meta.env.VITE_APP_URL.replace(/\/$/, '') : '';
  const returnUrl = encodeURIComponent(
    import.meta.env.VITE_TRELLO_OAUTH_REDIRECT_URL ||
    (configuredAppUrl ? `${configuredAppUrl}/auth.html` : `${origin}/auth.html`)
  );
  const appName = encodeURIComponent(APP_NAME);
  const authUrl = `https://trello.com/1/authorize?expiration=never&name=${appName}&scope=read,write&response_type=token&key=${apiKey}&return_url=${returnUrl}`;
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


// Read data directly from active Trello Board inside Power-Up
export async function getTrelloNativeBoardData() {
  const t = getTrelloIframe();
  if (!t) return null;

  // 1. Fetch board data safely with fallbacks
  let boardData = null;
  try {
    boardData = await t.board('id', 'name', 'labels');
  } catch (err1) {
    console.warn('t.board("id", "name", "labels") failed, trying t.board("all"):', err1);
    try {
      boardData = await t.board('all');
    } catch (err2) {
      console.warn('t.board("all") failed, trying minimal fields:', err2);
      try {
        boardData = await t.board('id', 'name');
      } catch (err3) {
        console.error('All t.board calls failed:', err3);
        boardData = { id: '', name: 'Trello Board' };
      }
    }
  }

  // 2. Fetch cards safely (ONLY request allowed fields: 'id', 'name', 'labels')
  // CRITICAL: Do NOT request 'idLabels' as that causes Trello client library to reject!
  let cardsData = [];
  try {
    cardsData = await t.cards('id', 'name', 'labels');
  } catch (cardErr1) {
    console.warn('t.cards("id", "name", "labels") failed, trying t.cards("all"):', cardErr1);
    try {
      cardsData = await t.cards('all');
    } catch (cardErr2) {
      console.error('All t.cards calls failed:', cardErr2);
      cardsData = [];
    }
  }

  // 3. Build a comprehensive labels map from both board definitions and attached card labels
  const labelMap = new Map();

  if (boardData && Array.isArray(boardData.labels)) {
    boardData.labels.forEach((lbl) => {
      if (lbl && lbl.id) {
        labelMap.set(lbl.id, {
          id: lbl.id,
          name: lbl.name || '',
          color: lbl.color || 'null',
          uses: typeof lbl.uses === 'number' ? lbl.uses : 0,
          ...lbl,
        });
      }
    });
  }

  // Normalize cards and ensure card.idLabels & card.labels are both set
  const normalizedCards = (cardsData || []).map((card) => {
    const cardLabels = Array.isArray(card.labels) ? card.labels : [];
    const idLabels = Array.isArray(card.idLabels) && card.idLabels.length > 0
      ? card.idLabels
      : cardLabels.map((l) => (typeof l === 'string' ? l : l?.id)).filter(Boolean);

    // Also register any label found on cards that wasn't in board.labels
    cardLabels.forEach((lbl) => {
      if (lbl && typeof lbl === 'object' && lbl.id && !labelMap.has(lbl.id)) {
        labelMap.set(lbl.id, {
          id: lbl.id,
          name: lbl.name || '',
          color: lbl.color || 'null',
          ...lbl,
        });
      }
    });

    return {
      ...card,
      idLabels,
      labels: cardLabels,
    };
  });

  let labelsList = Array.from(labelMap.values());

  // 4. Fallback to live REST API if native returned 0 labels and credentials exist
  if (labelsList.length === 0 && boardData?.id) {
    try {
      const creds = getSavedCredentials();
      const token = await getTrelloPowerUpToken();
      const activeToken = token || creds.token;
      if (activeToken && creds.apiKey) {
        console.info('Native returned 0 labels; attempting REST API fallback...');
        const restData = await fetchLiveBoardData(boardData.id, creds.apiKey, activeToken);
        if (restData?.labels?.length > 0) {
          labelsList = restData.labels;
          if (restData.cards?.length > 0) {
            normalizedCards.splice(0, normalizedCards.length, ...restData.cards.map((c) => ({
              ...c,
              idLabels: Array.isArray(c.idLabels) ? c.idLabels : (c.labels || []).map((l) => l.id || l),
            })));
          }
        }
      }
    } catch (restErr) {
      console.warn('REST API fallback attempt failed:', restErr);
    }
  }

  return {
    board: {
      id: boardData?.id || '',
      name: boardData?.name || 'Trello Board',
    },
    labels: labelsList,
    cards: normalizedCards,
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
  const getCardIds = (c) => {
    if (Array.isArray(c.idLabels) && c.idLabels.length > 0) return c.idLabels;
    if (Array.isArray(c.labels)) return c.labels.map((l) => (typeof l === 'string' ? l : l?.id)).filter(Boolean);
    return [];
  };

  const affectedCards = cards.filter((c) => getCardIds(c).includes(sourceLabelId));
  for (const card of affectedCards) {
    const ids = getCardIds(card);
    if (!ids.includes(targetLabelId)) {
      await fetch(`https://api.trello.com/1/cards/${card.id}/idLabels?value=${targetLabelId}&key=${apiKey}&token=${token}`, {
        method: 'POST',
      });
    }
    await fetch(`https://api.trello.com/1/cards/${card.id}/idLabels/${sourceLabelId}?key=${apiKey}&token=${token}`, {
      method: 'DELETE',
    });
  }
  await deleteLiveLabel(sourceLabelId, apiKey, token);
  return true;
}

// Compute analysis on board labels and cards
export function analyzeLabels(labels = [], cards = []) {
  const usageMap = {};
  labels.forEach((lbl) => {
    if (lbl && lbl.id) {
      usageMap[lbl.id] = {
        count: typeof lbl.uses === 'number' ? lbl.uses : 0,
        cards: [],
      };
    }
  });

  // If cards are provided, recalculate usage counts from cards directly
  if (Array.isArray(cards) && cards.length > 0) {
    labels.forEach((lbl) => {
      if (lbl && lbl.id) {
        usageMap[lbl.id].count = 0;
      }
    });

    cards.forEach((card) => {
      let cardLabelIds = [];
      if (Array.isArray(card.idLabels) && card.idLabels.length > 0) {
        cardLabelIds = card.idLabels;
      } else if (Array.isArray(card.labels)) {
        cardLabelIds = card.labels.map((l) => (typeof l === 'string' ? l : l?.id)).filter(Boolean);
      }

      const uniqueIds = Array.from(new Set(cardLabelIds));
      uniqueIds.forEach((lblId) => {
        if (usageMap[lblId]) {
          usageMap[lblId].count += 1;
          usageMap[lblId].cards.push(card);
        }
      });
    });
  }

  // Calculate Unused Labels (labels with 0 cards)
  const unusedLabels = labels.filter((lbl) => (usageMap[lbl.id]?.count || 0) === 0);

  // Group duplicate labels (case-insensitive name match or duplicate unnamed colors)
  const duplicateGroups = [];
  const nameGroups = {};

  labels.forEach((lbl) => {
    const rawName = (lbl.name || '').trim();
    const normalized = rawName.toLowerCase();
    // Use name if available; if empty name, group by color if color exists
    const groupKey = normalized.length > 0 ? `name:${normalized}` : (lbl.color && lbl.color !== 'null' ? `color:${lbl.color}` : '');
    if (!groupKey) return;

    if (!nameGroups[groupKey]) {
      nameGroups[groupKey] = [];
    }
    nameGroups[groupKey].push({
      ...lbl,
      usageCount: usageMap[lbl.id]?.count || 0,
      cards: usageMap[lbl.id]?.cards || [],
    });
  });

  Object.entries(nameGroups).forEach(([groupKey, groupLabels]) => {
    if (groupLabels.length > 1) {
      const sortedByUsage = [...groupLabels].sort((a, b) => b.usageCount - a.usageCount);
      const canonicalId = sortedByUsage[0].id;
      const displayName = sortedByUsage[0].name || `Unnamed (${sortedByUsage[0].color || 'No Color'})`;

      duplicateGroups.push({
        normalizedName: groupKey,
        displayName,
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
    labelsWithStats: labels.map((lbl) => ({
      ...lbl,
      usageCount: usageMap[lbl.id]?.count || 0,
      cards: usageMap[lbl.id]?.cards || [],
    })),
    duplicateGroups,
    unusedLabels: unusedLabels.map((lbl) => ({
      ...lbl,
      usageCount: 0,
      cards: [],
    })),
    totalLabelsCount: labels.length,
    duplicateLabelsCount: totalDuplicateLabelsCount,
    unusedLabelsCount: unusedLabels.length,
  };
}
