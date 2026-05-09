const express = require('express');
const router  = express.Router();
const { store, ids } = require('../store/data');

router.get('/', (req, res) => {
  res.json(Object.values(store.interviewers));
});

router.get('/:id', (req, res) => {
  const i = store.interviewers[parseInt(req.params.id)];
  if (!i) return res.status(404).json({ error: 'Interviewer not found' });
  res.json(i);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: 'Interviewer name is required' });

  const id = ids.nextIid();
  const interviewer = { id, name: name.trim() };
  store.interviewers[id] = interviewer;
  res.status(201).json(interviewer);
});

module.exports = router;
