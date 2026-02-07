/**
 * HeadyBrowser Mobile — Settings Screen
 */

import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, RADIUS } from '../theme';

export default function SettingsScreen() {
  const [adBlock, setAdBlock] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [apiUrl, setApiUrl] = useState('http://localhost:3300');

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const Row = ({ icon, label, right }: { icon: string; label: string; right: React.ReactNode }) => (
    <View style={styles.row}>
      <Icon name={icon} size={20} color={COLORS.cyan} />
      <Text style={styles.rowLabel}>{label}</Text>
      {right}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="hexagon-outline" size={32} color={COLORS.cyan} />
        <Text style={styles.title}>HeadyBrowser</Text>
        <Text style={styles.version}>v0.1.0 — Sacred Geometry</Text>
      </View>

      <Section title="Privacy & Security">
        <Row
          icon="shield-check-outline"
          label="Ad & Tracker Blocking"
          right={
            <Switch
              value={adBlock}
              onValueChange={setAdBlock}
              trackColor={{ false: COLORS.border, true: COLORS.cyan + '60' }}
              thumbColor={adBlock ? COLORS.cyan : COLORS.muted}
            />
          }
        />
        <Row
          icon="eye-off-outline"
          label="Fingerprint Protection"
          right={<Text style={styles.badge}>Coming Soon</Text>}
        />
      </Section>

      <Section title="Appearance">
        <Row
          icon="theme-light-dark"
          label="Dark Mode"
          right={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.border, true: COLORS.cyan + '60' }}
              thumbColor={darkMode ? COLORS.cyan : COLORS.muted}
            />
          }
        />
      </Section>

      <Section title="Heady AI">
        <Row
          icon="head-lightbulb-outline"
          label="AI Assistant"
          right={
            <Switch
              value={aiEnabled}
              onValueChange={setAiEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.cyan + '60' }}
              thumbColor={aiEnabled ? COLORS.cyan : COLORS.muted}
            />
          }
        />
        <View style={styles.apiRow}>
          <Text style={styles.apiLabel}>Heady Manager URL</Text>
          <TextInput
            style={styles.apiInput}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://localhost:3300"
            placeholderTextColor={COLORS.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </Section>

      <Section title="Data">
        <TouchableOpacity style={styles.actionRow}>
          <Icon name="sync" size={20} color={COLORS.cyan} />
          <Text style={styles.rowLabel}>Cross-Device Sync</Text>
          <Text style={styles.badge}>Coming Soon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <Icon name="trash-can-outline" size={20} color={COLORS.amber} />
          <Text style={styles.rowLabel}>Clear Browsing Data</Text>
          <Icon name="chevron-right" size={20} color={COLORS.muted} />
        </TouchableOpacity>
      </Section>

      <Section title="About">
        <Text style={styles.aboutText}>
          HeadyBrowser is part of the Heady Systems ecosystem.{'\n'}
          Sacred Geometry Architecture.{'\n'}
          Organic Systems. Breathing Interfaces.
        </Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    alignItems: 'center', padding: SPACING.lg, paddingTop: 56,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { color: COLORS.text, fontSize: 20, fontWeight: '700', marginTop: SPACING.sm },
  version: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: {
    color: COLORS.cyan, fontSize: 12, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowLabel: { flex: 1, color: COLORS.text, fontSize: 14 },
  badge: {
    color: COLORS.muted, fontSize: 11, backgroundColor: COLORS.surface,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.pill, overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  apiRow: { paddingVertical: SPACING.md },
  apiLabel: { color: COLORS.muted, fontSize: 12, marginBottom: SPACING.xs },
  apiInput: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, color: COLORS.text, fontSize: 13,
    borderWidth: 1, borderColor: COLORS.border,
  },
  aboutText: { color: COLORS.muted, fontSize: 13, lineHeight: 20 },
});
