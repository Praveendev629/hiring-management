const express = require('express');
const router  = express.Router();
const { store, ids } = require('../store/data');

router.get('/', (req, res) => {
  const { cid } = req.query;
  if (cid) return res.json(store.assessments.filter(a => a.cid === parseInt(cid)));
  res.json(store.assessments);
});

router.post('/', (req, res) => {
  const { cid, type, score, date } = req.body;

  // Validate candidate exists
  if (!store.candidates[parseInt(cid)])
    return res.status(404).json({ error: 'Candidate not found' });

  // Validate type
  if (!['DSA', 'Aptitude'].includes(type))
    return res.status(400).json({ error: 'Type must be DSA or Aptitude' });

  // Validate score
  const scoreNum = parseFloat(score);
  if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 10)
    return res.status(400).json({ error: 'Score must be between 1 and 10' });

  // Validate date – not future
  if (!date) return res.status(400).json({ error: 'Date is required' });
  const aDate = new Date(date);
  if (isNaN(aDate)) return res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' });
  if (aDate > new Date()) return res.status(400).json({ error: 'Assessment date cannot be in the future' });

  const aid = ids.nextAid();
  const assessment = { aid, cid: parseInt(cid), type, score: scoreNum, date };
  store.assessments.push(assessment);
  res.status(201).json(assessment);
});

module.exports = router;
