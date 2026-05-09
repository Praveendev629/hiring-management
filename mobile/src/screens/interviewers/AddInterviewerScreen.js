import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { addInterviewer } from '../../api/client';
import { COLORS } from '../../components/theme';
import { Card, Input, Button } from '../../components/UIComponents';

export default function AddInterviewerScreen({ navigation }) {
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) { setError('Interviewer name is required'); return; }
    setLoading(true);
    try {
      await addInterviewer({ name: name.trim() });
      Alert.alert('✅ Success', `${name.trim()} added as interviewer!`, [
        { text: 'Add Another', onPress: () => { setName(''); setError(''); } },
        { text: 'View List',   onPress: () => navigation.navigate('InterviewerList') },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.response?.data?.error || 'Failed to add interviewer');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerBand}>
          <Text style={styles.headerEmoji}>🧑‍💼</Text>
          <Text style={styles.headerTitle}>Add Interviewer</Text>
          <Text style={styles.headerSub}>Enter interviewer details</Text>
        </View>
        <Card>
          <Input
            label="Interviewer Name *"
            placeholder="e.g. Priya Menon"
            value={name}
            onChangeText={v => { setName(v); setError(''); }}
            error={error}
            autoCapitalize="words"
          />
          <Button title="Add Interviewer" onPress={submit} loading={loading} color={COLORS.secondary} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  headerBand: {
    backgroundColor: COLORS.secondary, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  headerEmoji: { fontSize: 36, marginBottom: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub:   { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },
});
