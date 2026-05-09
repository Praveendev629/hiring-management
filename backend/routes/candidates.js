const express = require('express');
const router  = express.Router();
const { store, ids } = require('../store/data');

// GET all candidates
router.get('/', (req, res) => {
  res.json(Object.values(store.candidates));
});

// GET single candidate
router.get('/:id', (req, res) => {
  const c = store.candidates[parseInt(req.params.id)];
  if (!c) return res.status(404).json({ error: 'Candidate not found' });
  res.json(c);
});

// POST register candidate
router.post('/', (req, res) => {
  const { name, college, cgpa } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: 'Candidate name is required' });
  if (cgpa === undefined || cgpa === null || cgpa === '')
    return res.status(400).json({ error: 'CGPA is required' });
  const cgpaNum = parseFloat(cgpa);
  if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10)
    return res.status(400).json({ error: 'CGPA must be between 0 and 10' });

  const id = ids.nextCid();
  const candidate = { id, name: name.trim(), college: (college || '').trim(), cgpa: cgpaNum };
  store.candidates[id] = candidate;
  res.status(201).json(candidate);
});

module.exports = router;
