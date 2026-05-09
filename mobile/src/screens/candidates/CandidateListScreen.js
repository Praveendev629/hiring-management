import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCandidates } from '../../api/client';
import { COLORS, SHADOW, statusColor } from '../../components/theme';
import { EmptyState, Badge } from '../../components/UIComponents';

export default function CandidateListScreen({ navigation }) {
  const [candidates, setCandidates] = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getCandidates();
      setCandidates(res.data);
      setFiltered(res.data);
    } catch (e) { console.log(e); }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const onSearch = (text) => {
    setSearch(text);
    setFiltered(candidates.filter(c =>
      c.name.toLowerCase().includes(text.toLowerCase()) ||
      c.college.toLowerCase().includes(text.toLowerCase())
    ));
  };

  const cgpaColor = (g) => g >= 9 ? COLORS.success : g >= 8 ? COLORS.primary : g >= 7 ? COLORS.warning : COLORS.danger;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.college}>🎓 {item.college}</Text>
      </View>
      <View style={styles.cgpaBox}>
        <Text style={[styles.cgpaVal, { color: cgpaColor(item.cgpa) }]}>{item.cgpa.toFixed(1)}</Text>
        <Text style={styles.cgpaLbl}>CGPA</Text>
      </View>
      <Text style={styles.idBadge}>C{String(item.id).padStart(3,'0')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or college..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={onSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>}
        ListEmptyComponent={<EmptyState icon="👤" message="No candidates found" />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RegisterCandidate')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    margin: 14, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border, ...SHADOW,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.text },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, ...SHADOW,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary + '22',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  college: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  cgpaBox: { alignItems: 'center', marginRight: 10 },
  cgpaVal: { fontSize: 20, fontWeight: '800' },
  cgpaLbl: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  idBadge: {
    backgroundColor: COLORS.primary + '15', color: COLORS.primary,
    fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOW,
    shadowOpacity: 0.3,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
