import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, TextInput,
} from 'react-native';
import { COLORS, SHADOW } from './theme';

// ─── Card ────────────────────────────────────────────────────────────────────
export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ─── Primary Button ──────────────────────────────────────────────────────────
export const Button = ({ title, onPress, loading, color, style, textStyle, disabled }) => (
  <TouchableOpacity
    style={[styles.btn, { backgroundColor: color || COLORS.primary }, style,
            (loading || disabled) && { opacity: 0.6 }]}
    onPress={onPress}
    disabled={loading || disabled}
    activeOpacity={0.8}
  >
    {loading
      ? <ActivityIndicator color="#fff" size="small" />
      : <Text style={[styles.btnText, textStyle]}>{title}</Text>}
  </TouchableOpacity>
);

// ─── Input ───────────────────────────────────────────────────────────────────
export const Input = ({ label, error, ...props }) => (
  <View style={styles.inputWrap}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, error && { borderColor: COLORS.danger }]}
      placeholderTextColor={COLORS.textMuted}
      {...props}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ─── Section Header ──────────────────────────────────────────────────────────
export const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', message }) => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// ─── Badge ───────────────────────────────────────────────────────────────────
export const Badge = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

// ─── Loading Overlay ─────────────────────────────────────────────────────────
export const Loader = ({ text = 'Loading...' }) => (
  <View style={styles.loader}>
    <ActivityIndicator color={COLORS.primary} size="large" />
    <Text style={styles.loaderText}>{text}</Text>
  </View>
);

// ─── Row ─────────────────────────────────────────────────────────────────────
export const Row = ({ children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  inputWrap: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, letterSpacing: 1, textTransform: 'uppercase' },
  empty: { alignItems: 'center', paddingVertical: 50 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: COLORS.textLight, fontSize: 15 },
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loaderText: { marginTop: 12, color: COLORS.textLight, fontSize: 14 },
});
