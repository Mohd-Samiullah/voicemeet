// src/utils/storage.js
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// 1. Get items & filter out > 30 days old
export const getStoredData = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const list = JSON.parse(raw);
    const now = Date.now();
    // 30 din se purane items filter out (Auto Purge)
    const valid = list.filter((item) => now - item.timestampMs < THIRTY_DAYS_MS);
    if (valid.length !== list.length) {
      localStorage.setItem(key, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
};

// 2. Save Item with timestamp
export const appendStoredData = (key, item) => {
  try {
    const current = getStoredData(key);
    const newItem = {
      ...item,
      timestampMs: item.timestampMs || Date.now()
    };
    const updated = [newItem, ...current]; // latest on top
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// 3. Store Chat Map (user-to-user)
export const getStoredChats = (userId) => {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(`vm_chats_${userId}`);
    if (!raw) return {};
    const chatMap = JSON.parse(raw);
    const now = Date.now();
    const cleanMap = {};
    for (const [roomId, msgs] of Object.entries(chatMap)) {
      cleanMap[roomId] = msgs.filter((m) => now - m.timestampMs < THIRTY_DAYS_MS);
    }
    return cleanMap;
  } catch {
    return {};
  }
};

export const saveStoredChats = (userId, chatMap) => {
  if (!userId) return;
  try {
    localStorage.setItem(`vm_chats_${userId}`, JSON.stringify(chatMap));
  } catch (err) {
    console.warn('Storage full or error', err);
  }
};