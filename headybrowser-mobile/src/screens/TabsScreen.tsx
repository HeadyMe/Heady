/**
 * HeadyBrowser Mobile — Tabs Manager Screen
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTabStore } from '../stores/tabStore';
import { COLORS, SPACING, RADIUS } from '../theme';

export default function TabsScreen({ navigation }: any) {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useTabStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tabs.length} Tab{tabs.length !== 1 ? 's' : ''}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            addTab();
            navigation.navigate('Browser');
          }}
        >
          <Icon name="plus" size={20} color={COLORS.cyan} />
          <Text style={styles.addText}>New Tab</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tabs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tabCard,
              item.id === activeTabId && styles.tabCardActive,
            ]}
            onPress={() => {
              setActiveTab(item.id);
              navigation.navigate('Browser');
            }}
          >
            <View style={styles.tabHeader}>
              <Text style={styles.tabTitle} numberOfLines={1}>
                {item.title || 'New Tab'}
              </Text>
              <TouchableOpacity
                onPress={() => closeTab(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={16} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.tabUrl} numberOfLines={1}>
              {item.url}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { color: COLORS.cyan, fontSize: 14 },
  grid: { padding: SPACING.sm },
  tabCard: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
  },
  tabCardActive: { borderColor: COLORS.cyan },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tabTitle: { color: COLORS.text, fontSize: 13, fontWeight: '500', flex: 1, marginRight: 8 },
  tabUrl: { color: COLORS.muted, fontSize: 11 },
});
