const express = require('express');
const router  = express.Router();
const { store, ids } = require('../store/data');

const TRANSITIONS = {
  Scheduled: ['Completed'],
  Completed: ['Selected', 'Rejected'],
  Selected:  [],
  Rejected:  [],
};

router.get('/', (req, res) => {
  const enriched = store.interviews.map(iv => ({
    ...iv,
    candidateName:   store.candidates[iv.cid]?.name   || 'Unknown',
    interviewerName: store.interviewers[iv.iid]?.name || 'Unknown',
  }));
  res.json(enriched);
});

router.post('/', (req, res) => {
  const { cid, iid, date } = req.body;

  if (!store.candidates[parseInt(cid)])
    return res.status(404).json({ error: 'Candidate not found' });
  if (!store.interviewers[parseInt(iid)])
    return res.status(404).json({ error: 'Interviewer not found' });
  if (!date) return res.status(400).json({ error: 'Interview date is required' });

  const iDate = new Date(date);
  if (isNaN(iDate)) return res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' });

  // Allow today or future
  const today = new Date(); today.setHours(0,0,0,0);
  if (iDate < today) return res.status(400).json({ error: 'Interview date cannot be in the past' });

  const intv_id = ids.nextIntv();
  const interview = { intv_id, cid: parseInt(cid), iid: parseInt(iid), date, status: 'Scheduled' };
  store.interviews.push(interview);
  res.status(201).json({
    ...interview,
    candidateName:   store.candidates[interview.cid].name,
    interviewerName: store.interviewers[interview.iid].name,
  });
});

// PATCH status
router.patch('/:id/status', (req, res) => {
  const iv = store.interviews.find(x => x.intv_id === parseInt(req.params.id));
  if (!iv) return res.status(404).json({ error: 'Interview not found' });

  const { status } = req.body;
  const allowed = TRANSITIONS[iv.status] || [];
  if (!allowed.includes(status))
    return res.status(400).json({
      error: `Cannot transition from '${iv.status}' to '${status}'. Allowed: [${allowed.join(', ') || 'none'}]`,
    });

  iv.status = status;
  res.json({ ...iv,
    candidateName:   store.candidates[iv.cid]?.name,
    interviewerName: store.interviewers[iv.iid]?.name,
  });
});

module.exports = router;
