import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getInterviewers } from '../../api/client';
import { COLORS, SHADOW } from '../../components/theme';
import { EmptyState } from '../../components/UIComponents';

export default function InterviewerListScreen({ navigation }) {
  const [list, setList]         = useState([]);
  const [refreshing, setRef]    = useState(false);

  const load = async () => {
    try { const r = await getInterviewers(); setList(r.data); } catch {}
  };
  useFocusEffect(useCallback(() => { load(); }, []));
  const onRefresh = async () => { setRef(true); await load(); setRef(false); };

  const PALETTE = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning];

  const renderItem = ({ item, index }) => {
    const col = PALETTE[index % PALETTE.length];
    return (
      <View style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: col + '22' }]}>
          <Text style={[styles.avatarText, { color: col }]}>{item.name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>Interviewer</Text>
        </View>
        <Text style={styles.idBadge}>I{String(item.id).padStart(3,'0')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>}
        ListEmptyComponent={<EmptyState icon="🧑‍💼" message="No interviewers added yet" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddInterviewer')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOW,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: '800' },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  role: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  idBadge: {
    backgroundColor: COLORS.secondary + '15', color: COLORS.secondary,
    fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', ...SHADOW,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
