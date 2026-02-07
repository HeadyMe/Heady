/**
 * HeadyBrowser Mobile — Tab State Management
 * Zustand store for browser tabs, history, and bookmarks
 */

import { create } from 'zustand';

export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isActive: boolean;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  folder?: string;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
}

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  bookmarks: Bookmark[];
  history: HistoryEntry[];

  // Tab actions
  addTab: (url?: string) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;

  // Bookmark actions
  addBookmark: (url: string, title: string, favicon?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (url: string) => boolean;

  // History actions
  addHistoryEntry: (url: string, title: string) => void;
  clearHistory: () => void;

  // Navigation
  getActiveTab: () => Tab | undefined;
}

const generateId = () => Math.random().toString(36).slice(2, 10);

export const useTabStore = create<TabStore>((set, get) => ({
  tabs: [],
  activeTabId: null,
  bookmarks: [],
  history: [],

  addTab: (url = 'https://www.google.com') => {
    const id = generateId();
    const newTab: Tab = {
      id,
      url,
      title: 'New Tab',
      isActive: true,
      isLoading: true,
      canGoBack: false,
      canGoForward: false,
      createdAt: Date.now(),
    };

    set((state) => ({
      tabs: [
        ...state.tabs.map((t) => ({ ...t, isActive: false })),
        newTab,
      ],
      activeTabId: id,
    }));

    return id;
  },

  closeTab: (id) => {
    set((state) => {
      const remaining = state.tabs.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        // Always keep at least one tab
        const newId = generateId();
        return {
          tabs: [{
            id: newId,
            url: 'https://www.google.com',
            title: 'New Tab',
            isActive: true,
            isLoading: true,
            canGoBack: false,
            canGoForward: false,
            createdAt: Date.now(),
          }],
          activeTabId: newId,
        };
      }

      // If closing active tab, activate the last tab
      const wasActive = state.activeTabId === id;
      if (wasActive) {
        const lastTab = remaining[remaining.length - 1];
        return {
          tabs: remaining.map((t) => ({
            ...t,
            isActive: t.id === lastTab.id,
          })),
          activeTabId: lastTab.id,
        };
      }

      return { tabs: remaining };
    });
  },

  setActiveTab: (id) => {
    set((state) => ({
      tabs: state.tabs.map((t) => ({ ...t, isActive: t.id === id })),
      activeTabId: id,
    }));
  },

  updateTab: (id, updates) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  addBookmark: (url, title, favicon) => {
    const id = generateId();
    set((state) => ({
      bookmarks: [
        ...state.bookmarks,
        { id, url, title, favicon, createdAt: Date.now() },
      ],
    }));
  },

  removeBookmark: (id) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    }));
  },

  isBookmarked: (url) => {
    return get().bookmarks.some((b) => b.url === url);
  },

  addHistoryEntry: (url, title) => {
    const id = generateId();
    set((state) => ({
      history: [
        { id, url, title, visitedAt: Date.now() },
        ...state.history.slice(0, 999), // Keep last 1000 entries
      ],
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },

  getActiveTab: () => {
    const state = get();
    return state.tabs.find((t) => t.id === state.activeTabId);
  },
}));
