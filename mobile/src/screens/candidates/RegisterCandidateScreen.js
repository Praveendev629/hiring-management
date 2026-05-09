import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Text,
} from 'react-native';
import { registerCandidate } from '../../api/client';
import { COLORS } from '../../components/theme';
import { Card, Input, Button } from '../../components/UIComponents';

export default function RegisterCandidateScreen({ navigation }) {
  const [form, setForm]     = useState({ name: '', college: '', cgpa: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name    = 'Name is required';
    if (!form.college.trim())         e.college = 'College is required';
    const g = parseFloat(form.cgpa);
    if (!form.cgpa)                   e.cgpa = 'CGPA is required';
    else if (isNaN(g) || g < 0 || g > 10) e.cgpa = 'CGPA must be between 0 and 10';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerCandidate({ name: form.name.trim(), college: form.college.trim(), cgpa: parseFloat(form.cgpa) });
      Alert.alert('✅ Success', `${form.name.trim()} registered successfully!`, [
        { text: 'Add Another', onPress: () => setForm({ name: '', college: '', cgpa: '' }) },
        { text: 'View List',   onPress: () => navigation.navigate('CandidateList') },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.response?.data?.error || 'Failed to register candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerBand}>
          <Text style={styles.headerEmoji}>👤</Text>
          <Text style={styles.headerTitle}>Register New Candidate</Text>
          <Text style={styles.headerSub}>Fill in the details below</Text>
        </View>
        <Card>
          <Input
            label="Full Name *"
            placeholder="e.g. Alice Johnson"
            value={form.name}
            onChangeText={v => set('name', v)}
            error={errors.name}
            autoCapitalize="words"
          />
          <Input
            label="College / University *"
            placeholder="e.g. IIT Bombay"
            value={form.college}
            onChangeText={v => set('college', v)}
            error={errors.college}
            autoCapitalize="words"
          />
          <Input
            label="CGPA (0 – 10) *"
            placeholder="e.g. 8.5"
            value={form.cgpa}
            onChangeText={v => set('cgpa', v)}
            error={errors.cgpa}
            keyboardType="decimal-pad"
          />
          <Button title="Register Candidate" onPress={submit} loading={loading} />
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
  headerSub:   { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },
});
