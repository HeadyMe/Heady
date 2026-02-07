/**
 * HeadyBrowser Mobile — Main Browser Screen
 * WebView-based browsing with address bar, navigation, and AI button
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTabStore } from '../stores/tabStore';
import { HeadyAPI } from '../services/HeadyAPI';
import { COLORS, SPACING, RADIUS } from '../theme';

const HEADY_API_URL = 'http://localhost:3300';

export default function BrowserScreen() {
  const webViewRef = useRef<WebView>(null);
  const { tabs, activeTabId, updateTab, addTab, addHistoryEntry, getActiveTab } = useTabStore();
  const activeTab = getActiveTab();

  const [addressText, setAddressText] = useState(activeTab?.url || '');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiQuery, setAIQuery] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [aiLoading, setAILoading] = useState(false);

  // Initialize first tab if none exist
  React.useEffect(() => {
    if (tabs.length === 0) {
      addTab('https://www.google.com');
    }
  }, []);

  const navigateTo = useCallback((input: string) => {
    let url = input.trim();
    if (!url) return;

    // If it looks like a URL, navigate directly
    if (url.match(/^https?:\/\//i) || url.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/)) {
      if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
      }
    } else {
      // Treat as search query
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }

    if (activeTabId) {
      updateTab(activeTabId, { url, isLoading: true });
    }
    setAddressText(url);
  }, [activeTabId, updateTab]);

  const askHeady = useCallback(async () => {
    if (!aiQuery.trim()) return;
    setAILoading(true);
    try {
      const response = await HeadyAPI.chat(aiQuery, HEADY_API_URL);
      setAIResponse(response);
    } catch (err: any) {
      setAIResponse(`Connection issue: ${err.message}. Make sure heady-manager is running.`);
    }
    setAILoading(false);
  }, [aiQuery]);

  if (!activeTab) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Address Bar */}
      <View style={styles.addressBar}>
        <TouchableOpacity
          onPress={() => webViewRef.current?.goBack()}
          disabled={!activeTab.canGoBack}
          style={styles.navButton}
        >
          <Icon
            name="arrow-left"
            size={20}
            color={activeTab.canGoBack ? COLORS.text : COLORS.muted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => webViewRef.current?.goForward()}
          disabled={!activeTab.canGoForward}
          style={styles.navButton}
        >
          <Icon
            name="arrow-right"
            size={20}
            color={activeTab.canGoForward ? COLORS.text : COLORS.muted}
          />
        </TouchableOpacity>

        <View style={styles.urlContainer}>
          {activeTab.isLoading && (
            <ActivityIndicator size="small" color={COLORS.cyan} style={styles.loadingIcon} />
          )}
          <TextInput
            style={styles.urlInput}
            value={addressText}
            onChangeText={setAddressText}
            onSubmitEditing={() => navigateTo(addressText)}
            placeholder="Search or enter URL"
            placeholderTextColor={COLORS.muted}
            autoCapitalize="none"
            autoCorrect={false}
            selectTextOnFocus
            returnKeyType="go"
          />
        </View>

        <TouchableOpacity
          onPress={() => webViewRef.current?.reload()}
          style={styles.navButton}
        >
          <Icon name="refresh" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: activeTab.url }}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          if (activeTabId) {
            updateTab(activeTabId, {
              url: navState.url,
              title: navState.title || 'Untitled',
              isLoading: navState.loading || false,
              canGoBack: navState.canGoBack,
              canGoForward: navState.canGoForward,
            });
            setAddressText(navState.url);
            if (!navState.loading && navState.title) {
              addHistoryEntry(navState.url, navState.title);
            }
          }
        }}
        onLoadStart={() => activeTabId && updateTab(activeTabId, { isLoading: true })}
        onLoadEnd={() => activeTabId && updateTab(activeTabId, { isLoading: false })}
        allowsBackForwardNavigationGestures
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.cyan} />
          </View>
        )}
      />

      {/* Ask Heady FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAIPanel(true)}
        activeOpacity={0.8}
      >
        <Icon name="head-lightbulb-outline" size={24} color={COLORS.bg} />
      </TouchableOpacity>

      {/* AI Panel Modal */}
      <Modal
        visible={showAIPanel}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAIPanel(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.aiPanel}>
            <View style={styles.aiHeader}>
              <Icon name="head-lightbulb-outline" size={20} color={COLORS.cyan} />
              <Text style={styles.aiTitle}>Ask Heady</Text>
              <TouchableOpacity onPress={() => setShowAIPanel(false)}>
                <Icon name="close" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.aiContent}>
              {aiResponse ? (
                <View style={styles.aiResponseBubble}>
                  <Text style={styles.aiResponseText}>{aiResponse}</Text>
                </View>
              ) : (
                <Text style={styles.aiPlaceholder}>
                  Ask Heady about this page, get summaries, explanations, or help with anything.
                </Text>
              )}
            </ScrollView>

            <View style={styles.aiInputRow}>
              <TextInput
                style={styles.aiInput}
                value={aiQuery}
                onChangeText={setAIQuery}
                placeholder="Ask anything..."
                placeholderTextColor={COLORS.muted}
                onSubmitEditing={askHeady}
                returnKeyType="send"
              />
              {aiLoading ? (
                <ActivityIndicator size="small" color={COLORS.cyan} />
              ) : (
                <TouchableOpacity onPress={askHeady} style={styles.aiSendButton}>
                  <Icon name="send" size={20} color={COLORS.cyan} />
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Action Chips */}
            <View style={styles.chipRow}>
              {['Summarize page', 'Explain simply', 'Find key points'].map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={styles.chip}
                  onPress={() => {
                    setAIQuery(chip);
                    // Auto-send after setting
                  }}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: Platform.OS === 'android' ? 36 : SPACING.sm, // Status bar offset
  },
  navButton: {
    padding: SPACING.sm,
  },
  urlContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sacred,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.xs,
    height: 40,
  },
  loadingIcon: {
    marginRight: SPACING.xs,
  },
  urlInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    padding: 0,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  aiPanel: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.sacred,
    borderTopRightRadius: RADIUS.sacred,
    padding: SPACING.md,
    maxHeight: '60%',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  aiTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  aiContent: {
    maxHeight: 200,
    marginBottom: SPACING.md,
  },
  aiPlaceholder: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  aiResponseBubble: {
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiResponseText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.sacred,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  aiInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    height: 44,
  },
  aiSendButton: {
    padding: SPACING.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: `${COLORS.border}99`,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipText: {
    color: COLORS.text,
    fontSize: 12,
  },
});
