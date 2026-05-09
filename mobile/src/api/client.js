import axios from 'axios';

/**
 * 👉 Change this to your machine's local IP when testing on a physical device.
 *    e.g.  http://192.168.1.10:4000/api
 *    Find it with:  ipconfig (Windows) | ifconfig (Mac/Linux)
 *
 *    For Android Emulator:  http://10.0.2.2:4000/api
 *    For iOS Simulator:     http://localhost:4000/api
 */
const BASE_URL = 'https://hiring-management.onrender.com/api';   // Android emulator default

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Candidates ──────────────────────────────────────────────────────────────
export const getCandidates     = ()       => api.get('/candidates');
export const getCandidate      = (id)     => api.get(`/candidates/${id}`);
export const registerCandidate = (data)   => api.post('/candidates', data);

// ─── Interviewers ────────────────────────────────────────────────────────────
export const getInterviewers  = ()     => api.get('/interviewers');
export const addInterviewer   = (data) => api.post('/interviewers', data);

// ─── Assessments ─────────────────────────────────────────────────────────────
export const getAssessments    = (cid)  => api.get('/assessments', { params: { cid } });
export const recordAssessment  = (data) => api.post('/assessments', data);

// ─── Interviews ──────────────────────────────────────────────────────────────
export const getInterviews     = ()           => api.get('/interviews');
export const assignInterview   = (data)       => api.post('/interviews', data);
export const updateInterviewStatus = (id, status) =>
  api.patch(`/interviews/${id}/status`, { status });

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportCandidateAssessments = (cid) =>
  api.get(`/reports/candidate-assessments/${cid}`);
export const reportPerInterviewer   = () => api.get('/reports/per-interviewer');
export const reportTopCandidates    = () => api.get('/reports/top-candidates');
export const reportSQL              = () => api.get('/reports/sql');

export default api;
