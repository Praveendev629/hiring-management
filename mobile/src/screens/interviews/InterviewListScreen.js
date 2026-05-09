import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getInterviews, updateInterviewStatus } from '../../api/client';
import { COLORS, SHADOW, statusColor } from '../../components/theme';
import { Badge, EmptyState } from '../../components/UIComponents';

const TRANSITIONS = {
  Scheduled: ['Completed'],
  Completed: ['Selected', 'Rejected'],
  Selected:  [],
  Rejected:  [],
};

export default function InterviewListScreen({ navigation }) {
  const [interviews, setInterviews] = useState([]);
  const [refreshing, setRef]        = useState(false);

  const load = async () => {
    try { const r = await getInterviews(); setInterviews(r.data); } catch {}
  };
  useFocusEffect(useCallback(() => { load(); }, []));
  const onRefresh = async () => { setRef(true); await load(); setRef(false); };

  const changeStatus = (iv) => {
    const opts = TRANSITIONS[iv.status];
    if (!opts.length) {
      Alert.alert('ℹ️ Final Status', `"${iv.status}" is a terminal status and cannot be changed.`);
      return;
    }
    Alert.alert(
      '🔄 Update Status',
      `Current: ${iv.status}\nCandidate: ${iv.candidateName}`,
      [
        ...opts.map(s => ({
          text: s,
          onPress: async () => {
            try {
              await updateInterviewStatus(iv.intv_id, s);
              load();
            } catch (e) {
              Alert.alert('❌ Error', e.response?.data?.error || 'Update failed');
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const col = statusColor(item.status);
    return (
      <View style={[styles.card, { borderLeftColor: col }]}>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.name}>{item.candidateName}</Text>
            <Badge label={item.status} color={col} />
          </View>
          <Text style={styles.interviewer}>👤 {item.interviewerName}</Text>
          <Text style={styles.date}>📅 {item.date}</Text>
          <Text style={styles.idLabel}>INT{String(item.intv_id).padStart(3,'0')}</Text>
        </View>
        {TRANSITIONS[item.status]?.length > 0 && (
          <TouchableOpacity style={styles.updateBtn} onPress={() => changeStatus(item)} activeOpacity={0.8}>
            <Text style={styles.updateBtnText}>Update</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={interviews}
        keyExtractor={i => String(i.intv_id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>}
        ListEmptyComponent={<EmptyState icon="📅" message="No interviews scheduled yet" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AssignInterview')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
    borderLeftWidth: 4, ...SHADOW,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 },
  interviewer: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  date:        { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  idLabel:     { fontSize: 10, color: COLORS.textMuted, marginTop: 4, fontWeight: '600' },
  updateBtn: {
    backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 8, marginLeft: 10,
  },
  updateBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOW,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
