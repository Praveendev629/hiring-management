import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet, Alert, Text,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { getCandidates, recordAssessment } from '../../api/client';
import { COLORS, SHADOW } from '../../components/theme';
import { Card, Input, Button } from '../../components/UIComponents';

const TypeBtn = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.typeBtn, selected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.typeBtnText, selected && { color: '#fff' }]}>{label}</Text>
  </TouchableOpacity>
);

export default function RecordAssessmentScreen() {
  const [candidates, setCandidates] = useState([]);
  const [selCid, setSelCid]         = useState(null);
  const [type,   setType]           = useState('DSA');
  const [score,  setScore]          = useState('');
  const [date,   setDate]           = useState('');
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [search,  setSearch]        = useState('');

  useEffect(() => {
    getCandidates().then(r => setCandidates(r.data)).catch(() => {});
    // Default date to today
    const t = new Date();
    setDate(`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`);
  }, []);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!selCid)   e.cid   = 'Please select a candidate';
    const s = parseFloat(score);
    if (!score)    e.score = 'Score is required';
    else if (isNaN(s) || s < 1 || s > 10) e.score = 'Score must be between 1 and 10';
    if (!date)     e.date  = 'Date is required';
    else {
      const d = new Date(date);
      if (isNaN(d)) e.date = 'Invalid date format (YYYY-MM-DD)';
      else if (d > new Date()) e.date = 'Date cannot be in the future';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await recordAssessment({ cid: selCid, type, score: parseFloat(score), date });
      Alert.alert('✅ Recorded', 'Assessment saved successfully!', [
        { text: 'OK', onPress: () => { setScore(''); setSelCid(null); setSearch(''); } },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.response?.data?.error || 'Failed to record assessment');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBand}>
          <Text style={styles.headerEmoji}>📝</Text>
          <Text style={styles.headerTitle}>Record Assessment</Text>
        </View>

        {/* Candidate Picker */}
        <Card>
          <Text style={styles.fieldLabel}>Select Candidate *</Text>
          {errors.cid && <Text style={styles.errText}>{errors.cid}</Text>}
          <Input placeholder="Search candidate..." value={search} onChangeText={setSearch} />
          <View style={styles.candList}>
            {filtered.slice(0, 6).map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.candItem, selCid === c.id && styles.candItemSel]}
                onPress={() => { setSelCid(c.id); setErrors(e => ({ ...e, cid: '' })); setSearch(c.name); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.candName, selCid === c.id && { color: '#fff' }]}>{c.name}</Text>
                <Text style={[styles.candCollege, selCid === c.id && { color: 'rgba(255,255,255,0.8)' }]}>{c.college}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Assessment Type */}
        <Card>
          <Text style={styles.fieldLabel}>Assessment Type</Text>
          <View style={styles.typeRow}>
            <TypeBtn label="📊 DSA"       selected={type === 'DSA'}       onPress={() => setType('DSA')} />
            <TypeBtn label="🧠 Aptitude"  selected={type === 'Aptitude'}  onPress={() => setType('Aptitude')} />
          </View>
        </Card>

        {/* Score & Date */}
        <Card>
          <Input
            label="Score (1 – 10) *"
            placeholder="e.g. 8.5"
            value={score}
            onChangeText={v => { setScore(v); setErrors(e => ({ ...e, score: '' })); }}
            error={errors.score}
            keyboardType="decimal-pad"
          />
          <Input
            label="Assessment Date * (YYYY-MM-DD)"
            placeholder="e.g. 2025-04-10"
            value={date}
            onChangeText={v => { setDate(v); setErrors(e => ({ ...e, date: '' })); }}
            error={errors.date}
          />
          <Button title="Save Assessment" onPress={submit} loading={loading} color={COLORS.accent} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  headerBand: {
    backgroundColor: COLORS.accent, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  headerEmoji: { fontSize: 36, marginBottom: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  errText: { color: COLORS.danger, fontSize: 12, marginBottom: 6 },
  candList: { gap: 6 },
  candItem: {
    padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  candItemSel: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  candName:    { fontWeight: '700', fontSize: 14, color: COLORS.text },
  candCollege: { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bg,
  },
  typeBtnText: { fontWeight: '700', fontSize: 14, color: COLORS.text },
});
