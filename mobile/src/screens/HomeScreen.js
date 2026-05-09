import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { COLORS, SHADOW } from '../components/theme';
import { getCandidates, getInterviewers, getInterviews } from '../api/client';

const StatCard = ({ emoji, label, value, color, onPress }) => (
  <TouchableOpacity style={[styles.statCard, { borderTopColor: color }]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const QuickAction = ({ emoji, label, onPress }) => (
  <TouchableOpacity style={styles.qaBtn} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.qaEmoji}>{emoji}</Text>
    <Text style={styles.qaLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [stats, setStats]       = useState({ candidates: 0, interviewers: 0, interviews: 0, pending: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [c, i, iv] = await Promise.all([getCandidates(), getInterviewers(), getInterviews()]);
      const pending = iv.data.filter(x => x.status === 'Scheduled').length;
      setStats({ candidates: c.data.length, interviewers: i.data.length, interviews: iv.data.length, pending });
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🎓 Hiring System</Text>
        <Text style={styles.bannerSub}>Campus Recruitment Dashboard</Text>
      </View>

      {/* Stats */}
      <Text style={styles.sectionLabel}>OVERVIEW</Text>
      <View style={styles.statsGrid}>
        <StatCard emoji="👤" label="Candidates"   value={stats.candidates}   color={COLORS.primary}  onPress={() => navigation.navigate('Candidates')} />
        <StatCard emoji="🧑‍💼" label="Interviewers" value={stats.interviewers} color={COLORS.secondary} onPress={() => navigation.navigate('Interviewers')} />
        <StatCard emoji="📅" label="Interviews"   value={stats.interviews}   color={COLORS.accent}   onPress={() => navigation.navigate('Interviews')} />
        <StatCard emoji="⏳" label="Pending"      value={stats.pending}      color={COLORS.warning}  onPress={() => navigation.navigate('Interviews')} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
      <View style={styles.qaGrid}>
        <QuickAction emoji="➕" label="Add Candidate"   onPress={() => navigation.navigate('Candidates', { screen: 'RegisterCandidate' })} />
        <QuickAction emoji="🧑‍💼" label="Add Interviewer" onPress={() => navigation.navigate('Interviewers', { screen: 'AddInterviewer' })} />
        <QuickAction emoji="📝" label="Record Score"    onPress={() => navigation.navigate('Assessments')} />
        <QuickAction emoji="📅" label="Assign Slot"     onPress={() => navigation.navigate('Interviews', { screen: 'AssignInterview' })} />
        <QuickAction emoji="🔄" label="Update Status"   onPress={() => navigation.navigate('Interviews', { screen: 'UpdateInterview' })} />
        <QuickAction emoji="📊" label="Reports"         onPress={() => navigation.navigate('Reports')} />
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  banner: {
    backgroundColor: COLORS.primary,
    padding: 28,
    paddingTop: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  bannerSub:   { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: COLORS.textLight,
    letterSpacing: 1.2, paddingHorizontal: 16, marginBottom: 10, marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 6,
  },
  statCard: {
    width: '46%', margin: '2%', backgroundColor: COLORS.card, borderRadius: 14,
    padding: 16, alignItems: 'center', borderTopWidth: 3, ...SHADOW,
  },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 2, fontWeight: '600' },
  qaGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12,
  },
  qaBtn: {
    width: '30%', margin: '1.5%', backgroundColor: COLORS.card,
    borderRadius: 14, padding: 14, alignItems: 'center', ...SHADOW,
    borderWidth: 1, borderColor: COLORS.border,
  },
  qaEmoji: { fontSize: 22, marginBottom: 6 },
  qaLabel: { fontSize: 11, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
});
