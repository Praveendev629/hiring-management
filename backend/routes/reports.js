const express = require('express');
const router  = express.Router();
const { store } = require('../store/data');

// R1: Assessments for a candidate
router.get('/candidate-assessments/:cid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const c = store.candidates[cid];
  if (!c) return res.status(404).json({ error: 'Candidate not found' });

  const list = store.assessments.filter(a => a.cid === cid);
  const avg  = list.length ? list.reduce((s,a) => s + a.score, 0) / list.length : null;
  res.json({ candidate: c, assessments: list, averageScore: avg });
});

// R2: Candidates per interviewer
router.get('/per-interviewer', (req, res) => {
  const map = {};
  Object.values(store.interviewers).forEach(i => {
    map[i.id] = { interviewer: i, candidates: new Set(), interviews: [] };
  });
  store.interviews.forEach(iv => {
    if (map[iv.iid]) {
      map[iv.iid].candidates.add(iv.cid);
      map[iv.iid].interviews.push(iv);
    }
  });
  const result = Object.values(map).map(({ interviewer, candidates, interviews }) => ({
    interviewer,
    uniqueCandidateCount: candidates.size,
    totalInterviews:      interviews.length,
  }));
  res.json(result);
});

// R3: Top candidates by average score
router.get('/top-candidates', (req, res) => {
  const scores = {};
  store.assessments.forEach(a => {
    if (!scores[a.cid]) scores[a.cid] = [];
    scores[a.cid].push(a.score);
  });
  const rows = Object.values(store.candidates).map(c => {
    const arr = scores[c.id] || [];
    const avg = arr.length ? arr.reduce((s,v) => s+v, 0) / arr.length : null;
    return { ...c, averageScore: avg, assessmentCount: arr.length };
  });
  rows.sort((a,b) => (b.averageScore||0) - (a.averageScore||0));
  res.json(rows);
});

// R4: SQL use-case – avg score sorted by CGPA desc
router.get('/sql', (req, res) => {
  const scores = {};
  store.assessments.forEach(a => {
    if (!scores[a.cid]) scores[a.cid] = [];
    scores[a.cid].push(a.score);
  });
  const sql = `SELECT
  c.candidate_id,
  c.candidate_name,
  ROUND(AVG(a.score), 2) AS average_score
FROM candidates c
LEFT JOIN assessments a ON c.candidate_id = a.candidate_id
GROUP BY c.candidate_id, c.candidate_name, c.cgpa
ORDER BY c.cgpa DESC;`;

  const rows = Object.values(store.candidates).map(c => {
    const arr = scores[c.id] || [];
    const avg = arr.length ? +(arr.reduce((s,v) => s+v,0) / arr.length).toFixed(2) : null;
    return { candidate_id: `C${String(c.id).padStart(3,'0')}`, candidate_name: c.name, average_score: avg, cgpa: c.cgpa };
  });
  rows.sort((a,b) => b.cgpa - a.cgpa);
  res.json({ sql, rows });
});

module.exports = router;
