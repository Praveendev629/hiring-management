import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
  FlatList,
} from 'react-native';
import {
  getCandidates,
  reportCandidateAssessments, reportPerInterviewer,
  reportTopCandidates, reportSQL,
} from '../../api/client';
import { COLORS, SHADOW } from '../../components/theme';
import { Card, Badge, Loader, EmptyState } from '../../components/UIComponents';

// ─── Tab Buttons ─────────────────────────────────────────────────────────────
const TABS = [
  { key: 'detail',       label: '📋 Detail'   },
  { key: 'perInterviewer', label: '🧑‍💼 Per IV' },
  { key: 'top',          label: '🏆 Top'      },
  { key: 'sql',          label: '🗄️ SQL'      },
];

// ─── R1: Candidate Assessment Detail ─────────────────────────────────────────
function DetailReport() {
  const [candidates, setCandidates] = useState([]);
  const [selCid, setSelCid]         = useState(null);
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(false);

  useEffect(() => { getCandidates().then(r => setCandidates(r.data)).catch(()=>{}); }, []);

  const load = async (cid) => {
    setLoading(true); setSelCid(cid);
    try { const r = await reportCandidateAssessments(cid); setData(r.data); }
    catch (e) { Alert.alert('Error', e.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <View>
      <Text style={styles.secLabel}>SELECT CANDIDATE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {candidates.map(c => (
          <TouchableOpacity key={c.id} style={[styles.chip, selCid===c.id && styles.chipSel]} onPress={()=>load(c.id)}>
            <Text style={[styles.chipText, selCid===c.id && {color:'#fff'}]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && <Loader />}
      {data && !loading && (
        <Card>
          <Text style={styles.cardTitle}>{data.candidate.name}</Text>
          <Text style={styles.cardSub}>🎓 {data.candidate.college}  •  CGPA {data.candidate.cgpa.toFixed(1)}</Text>

          {data.assessments.length === 0
            ? <EmptyState icon="📝" message="No assessments yet" />
            : <>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, {flex:1}]}>Type</Text>
                  <Text style={[styles.th, {flex:1}]}>Score</Text>
                  <Text style={[styles.th, {flex:2}]}>Date</Text>
                </View>
                {data.assessments.map(a => (
                  <View key={a.aid} style={styles.tableRow}>
                    <Text style={[styles.td, {flex:1}]}>{a.type}</Text>
                    <Text style={[styles.td, {flex:1, fontWeight:'700', color: a.score>=8?COLORS.success:a.score>=6?COLORS.warning:COLORS.danger}]}>{a.score}</Text>
                    <Text style={[styles.td, {flex:2}]}>{a.date}</Text>
                  </View>
                ))}
                <View style={styles.avgRow}>
                  <Text style={styles.avgLabel}>Average Score</Text>
                  <Text style={styles.avgValue}>{data.averageScore?.toFixed(2)}</Text>
                </View>
              </>
          }
        </Card>
      )}
    </View>
  );
}

// ─── R2: Per Interviewer ──────────────────────────────────────────────────────
function PerInterviewerReport() {
  const [data, setData]   = useState(null);
  const [loading, setL]   = useState(true);

  useEffect(() => {
    reportPerInterviewer().then(r => setData(r.data)).catch(()=>{}).finally(()=>setL(false));
  }, []);

  if (loading) return <Loader />;
  if (!data?.length) return <EmptyState icon="🧑‍💼" message="No data" />;

  return (
    <>
      {data.map(({ interviewer, uniqueCandidateCount, totalInterviews }) => (
        <Card key={interviewer.id}>
          <View style={styles.row}>
            <View style={styles.iAvatar}>
              <Text style={styles.iAvatarText}>{interviewer.name[0]}</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.cardTitle}>{interviewer.name}</Text>
              <Text style={styles.cardSub}>I{String(interviewer.id).padStart(3,'0')}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statN}>{uniqueCandidateCount}</Text>
              <Text style={styles.statL}>Unique Candidates</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statN}>{totalInterviews}</Text>
              <Text style={styles.statL}>Total Interviews</Text>
            </View>
          </View>
        </Card>
      ))}
    </>
  );
}

// ─── R3: Top Candidates ───────────────────────────────────────────────────────
function TopCandidatesReport() {
  const [data, setData] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    reportTopCandidates().then(r => setData(r.data)).catch(()=>{}).finally(()=>setL(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {(data||[]).map((c, idx) => (
        <Card key={c.id}>
          <View style={styles.row}>
            <Text style={styles.rank}>#{idx+1}</Text>
            <View style={{ flex:1 }}>
              <Text style={styles.cardTitle}>{c.name}</Text>
              <Text style={styles.cardSub}>{c.college}  •  CGPA {c.cgpa.toFixed(1)}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={[styles.scoreVal,
                {color: c.averageScore>=8?COLORS.success:c.averageScore>=6?COLORS.warning:COLORS.danger}]}>
                {c.averageScore?.toFixed(2) ?? 'N/A'}
              </Text>
              <Text style={styles.scoreL}>Avg Score</Text>
            </View>
          </View>
        </Card>
      ))}
    </>
  );
}

// ─── R4: SQL ──────────────────────────────────────────────────────────────────
function SQLReport() {
  const [data, setData] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    reportSQL().then(r => setData(r.data)).catch(()=>{}).finally(()=>setL(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Card style={{ backgroundColor: '#1E293B' }}>
        <Text style={styles.sqlText}>{data?.sql}</Text>
      </Card>
      <Card>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, {flex:1.5}]}>ID</Text>
          <Text style={[styles.th, {flex:3}]}>Name</Text>
          <Text style={[styles.th, {flex:1.5}]}>Avg Score</Text>
        </View>
        {(data?.rows||[]).map((r, i) => (
          <View key={i} style={[styles.tableRow, i%2===0 && {backgroundColor:'#F8FAFC'}]}>
            <Text style={[styles.td, {flex:1.5}]}>{r.candidate_id}</Text>
            <Text style={[styles.td, {flex:3, fontWeight:'600'}]}>{r.candidate_name}</Text>
            <Text style={[styles.td, {flex:1.5, color:COLORS.primary, fontWeight:'700'}]}>
              {r.average_score ?? 'NULL'}
            </Text>
          </View>
        ))}
      </Card>
    </>
  );
}

// ─── Main Reports Screen ──────────────────────────────────────────────────────
export default function ReportsScreen() {
  const [tab, setTab] = useState('detail');

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, tab===t.key && styles.tabSel]} onPress={()=>setTab(t.key)}>
            <Text style={[styles.tabText, tab===t.key && styles.tabTextSel]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {tab === 'detail'         && <DetailReport />}
        {tab === 'perInterviewer' && <PerInterviewerReport />}
        {tab === 'top'            && <TopCandidatesReport />}
        {tab === 'sql'            && <SQLReport />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  tabs: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderColor: COLORS.border,
  },
  tab: { flex:1, paddingVertical: 12, alignItems: 'center' },
  tabSel: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { fontSize: 11, fontWeight: '600', color: COLORS.textLight },
  tabTextSel: { color: COLORS.primary, fontWeight: '800' },
  content: { padding: 14, paddingBottom: 40 },
  secLabel: { fontSize: 11, fontWeight: '800', color: COLORS.textLight, letterSpacing:1, marginBottom: 8 },
  chipRow: { paddingBottom: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  chipSel: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  cardSub:   { fontSize: 12, color: COLORS.textLight, marginTop: 2, marginBottom: 10 },
  tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1.5, borderColor: COLORS.border, marginBottom: 4 },
  th: { fontSize: 11, fontWeight: '800', color: COLORS.textLight, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: COLORS.border + '80' },
  td: { fontSize: 13, color: COLORS.text },
  avgRow: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    marginTop: 12, paddingTop: 10, borderTopWidth: 1.5, borderColor: COLORS.primary + '40',
  },
  avgLabel: { fontWeight: '700', color: COLORS.text },
  avgValue: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.secondary + '22',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  iAvatarText: { fontSize: 18, fontWeight: '800', color: COLORS.secondary },
  statsRow: { flexDirection: 'row', gap: 12 },
  statItem: {
    flex: 1, backgroundColor: COLORS.bg, borderRadius: 10,
    alignItems: 'center', paddingVertical: 10,
  },
  statN: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  statL: { fontSize: 11, color: COLORS.textLight, fontWeight: '600', marginTop: 2 },
  rank: { fontSize: 22, fontWeight: '800', color: COLORS.textMuted, marginRight: 14, width: 34 },
  scoreBox: { alignItems: 'center' },
  scoreVal: { fontSize: 22, fontWeight: '800' },
  scoreL: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  sqlText: { fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: '#A5F3FC', fontSize: 12, lineHeight: 20 },
});
