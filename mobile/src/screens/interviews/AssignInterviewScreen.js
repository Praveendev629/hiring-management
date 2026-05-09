import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { getCandidates, getInterviewers, assignInterview } from '../../api/client';
import { COLORS, SHADOW } from '../../components/theme';
import { Card, Input, Button } from '../../components/UIComponents';

const PickerItem = ({ item, selected, onPress, color }) => (
  <TouchableOpacity
    style={[styles.item, selected && { backgroundColor: color, borderColor: color }]}
    onPress={onPress} activeOpacity={0.8}
  >
    <Text style={[styles.itemName, selected && { color: '#fff' }]}>{item.name}</Text>
    {item.college && <Text style={[styles.itemSub, selected && { color: 'rgba(255,255,255,0.8)' }]}>{item.college}</Text>}
  </TouchableOpacity>
);

export default function AssignInterviewScreen() {
  const [candidates,   setCandidates]   = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [selCid,  setSelCid]            = useState(null);
  const [selIid,  setSelIid]            = useState(null);
  const [date,    setDate]              = useState('');
  const [errors,  setErrors]            = useState({});
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    getCandidates().then(r => setCandidates(r.data)).catch(() => {});
    getInterviewers().then(r => setInterviewers(r.data)).catch(() => {});
    const t = new Date(); t.setDate(t.getDate() + 1);
    setDate(`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`);
  }, []);

  const validate = () => {
    const e = {};
    if (!selCid) e.cid = 'Please select a candidate';
    if (!selIid) e.iid = 'Please select an interviewer';
    if (!date)   e.date = 'Date is required';
    else {
      const d = new Date(date);
      if (isNaN(d)) e.date = 'Invalid date (YYYY-MM-DD)';
      else {
        const today = new Date(); today.setHours(0,0,0,0);
        if (d < today) e.date = 'Interview date cannot be in the past';
      }
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const r = await assignInterview({ cid: selCid, iid: selIid, date });
      Alert.alert('✅ Assigned', `Interview scheduled!\n${r.data.candidateName} ↔ ${r.data.interviewerName}\non ${date}`, [
        { text: 'OK', onPress: () => { setSelCid(null); setSelIid(null); } },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.response?.data?.error || 'Failed to assign interview');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBand}>
          <Text style={styles.headerEmoji}>📅</Text>
          <Text style={styles.headerTitle}>Assign Interview Slot</Text>
        </View>

        <Card>
          <Text style={styles.label}>Select Candidate *</Text>
          {errors.cid && <Text style={styles.errText}>{errors.cid}</Text>}
          <View style={styles.list}>
            {candidates.map(c => (
              <PickerItem key={c.id} item={c} selected={selCid===c.id} color={COLORS.primary}
                onPress={() => { setSelCid(c.id); setErrors(e=>({...e,cid:''})); }} />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.label}>Select Interviewer *</Text>
          {errors.iid && <Text style={styles.errText}>{errors.iid}</Text>}
          <View style={styles.list}>
            {interviewers.map(i => (
              <PickerItem key={i.id} item={i} selected={selIid===i.id} color={COLORS.secondary}
                onPress={() => { setSelIid(i.id); setErrors(e=>({...e,iid:''})); }} />
            ))}
          </View>
        </Card>

        <Card>
          <Input
            label="Interview Date * (YYYY-MM-DD)"
            placeholder="e.g. 2026-06-01"
            value={date}
            onChangeText={v => { setDate(v); setErrors(e=>({...e,date:''})); }}
            error={errors.date}
          />
          <Button title="Assign Interview" onPress={submit} loading={loading} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  headerBand: {
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  headerEmoji: { fontSize: 36, marginBottom: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  errText: { color: COLORS.danger, fontSize: 12, marginBottom: 6 },
  list: { gap: 6 },
  item: {
    padding: 10, borderRadius: 10, borderWidth: 1.5,
    borderColor: COLORS.border, backgroundColor: COLORS.bg,
  },
  itemName:  { fontWeight: '700', fontSize: 14, color: COLORS.text },
  itemSub:   { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
});
