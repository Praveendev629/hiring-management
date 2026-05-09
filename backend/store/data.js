// ─── In-Memory Data Store ───────────────────────────────────────────────────
let _cid = 0, _iid = 0, _aid = 0, _intv = 0;

const store = {
  candidates:   {},   // { [id]: {id,name,college,cgpa} }
  interviewers: {},   // { [id]: {id,name} }
  assessments:  [],   // [{aid,cid,type,score,date}]
  interviews:   [],   // [{intv_id,cid,iid,date,status}]
};

const ids = {
  nextCid:  () => ++_cid,
  nextIid:  () => ++_iid,
  nextAid:  () => ++_aid,
  nextIntv: () => ++_intv,
};

// ─── Seed Demo Data ──────────────────────────────────────────────────────────
function seedDemo() {
  const demos = [
    { name: "Alice Johnson",  college: "IIT Bombay",  cgpa: 9.1 },
    { name: "Bob Sharma",     college: "NIT Trichy",  cgpa: 8.4 },
    { name: "Clara Patel",    college: "BITS Pilani", cgpa: 8.8 },
    { name: "David Kumar",    college: "VIT Vellore", cgpa: 7.9 },
  ];
  demos.forEach(({ name, college, cgpa }) => {
    const id = ids.nextCid();
    store.candidates[id] = { id, name, college, cgpa };
  });

  ["Priya Menon", "Rohit Verma"].forEach(name => {
    const id = ids.nextIid();
    store.interviewers[id] = { id, name };
  });

  [
    [1,"DSA",      8.5,"2025-04-10"],
    [1,"Aptitude", 9.0,"2025-04-12"],
    [2,"DSA",      7.0,"2025-04-10"],
    [2,"Aptitude", 7.5,"2025-04-12"],
    [3,"DSA",      9.5,"2025-04-11"],
    [3,"Aptitude", 8.0,"2025-04-13"],
    [4,"DSA",      6.5,"2025-04-10"],
  ].forEach(([cid,type,score,date]) => {
    store.assessments.push({ aid: ids.nextAid(), cid, type, score, date });
  });

  [
    [1,1,"2026-05-20","Scheduled"],
    [2,1,"2026-05-21","Scheduled"],
    [3,2,"2026-05-22","Scheduled"],
    [4,2,"2026-05-23","Scheduled"],
  ].forEach(([cid,iid,date,status]) => {
    store.interviews.push({ intv_id: ids.nextIntv(), cid, iid, date, status });
  });
}

seedDemo();

module.exports = { store, ids };
