/**
 * HeadyBrowser Mobile — Bookmarks Screen
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTabStore } from '../stores/tabStore';
import { COLORS, SPACING, RADIUS } from '../theme';

export default function BookmarksScreen({ navigation }: any) {
  const { bookmarks, removeBookmark, addTab, setActiveTab } = useTabStore();

  const openBookmark = (url: string) => {
    const id = addTab(url);
    setActiveTab(id);
    navigation.navigate('Browser');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.count}>{bookmarks.length}</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="bookmark-outline" size={48} color={COLORS.muted} />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
          <Text style={styles.emptyHint}>
            Tap the bookmark icon in the address bar to save pages
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => openBookmark(item.url)}
            >
              <Icon name="bookmark" size={20} color={COLORS.cyan} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.rowUrl} numberOfLines={1}>{item.url}</Text>
              </View>
              <TouchableOpacity onPress={() => removeBookmark(item.id)}>
                <Icon name="close" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, paddingTop: 48,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  count: { color: COLORS.muted, fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.text, fontSize: 16, marginTop: SPACING.md },
  emptyHint: { color: COLORS.muted, fontSize: 13, textAlign: 'center', marginTop: SPACING.sm },
  row: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.md,
  },
  rowContent: { flex: 1 },
  rowTitle: { color: COLORS.text, fontSize: 14 },
  rowUrl: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
});
