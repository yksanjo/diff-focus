const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- The "Intelligence" Engine ---
const analyzeDiff = (diffText) => {
  const analysis = {
    riskLevel: 'Low', // Low, Medium, High
    summary: [],
    flags: [],
    fileTypes: []
  };

  // 1. Detect File Types
  if (diffText.includes('.jsx') || diffText.includes('.tsx')) analysis.fileTypes.push('React Component');
  if (diffText.includes('.php') || diffText.includes('.hh')) analysis.fileTypes.push('Hack/Backend');
  if (diffText.includes('.sql')) analysis.fileTypes.push('Database Migration');

  // 2. Risk Heuristics
  let riskScore = 0;

  // High Risk: Database drops or schema changes
  if (/DROP TABLE|ALTER TABLE|DELETE FROM/i.test(diffText)) {
    analysis.flags.push({ type: 'danger', msg: 'Destructive Database Operation detected.' });
    riskScore += 5;
  }

  // Medium Risk: Authentication/Privacy changes
  if (/Auth::|PrivacyCheck|ViewerContext/i.test(diffText)) {
    analysis.flags.push({ type: 'warning', msg: 'Modifies Authentication or Privacy logic.' });
    riskScore += 2;
  }

  // Low Risk: Console logs left in
  if (/console\.log|var_dump/i.test(diffText)) {
    analysis.flags.push({ type: 'info', msg: 'Debug code (console.log) detected.' });
  }

  // 3. Generate Summary based on syntax
  if (diffText.includes('useEffect') || diffText.includes('componentDidMount')) {
    analysis.summary.push('Modifies component lifecycle methods.');
  }
  if (diffText.includes('className=') && riskScore === 0) {
    analysis.summary.push('Appears to be primarily a UI/Styling update.');
  }
  
  // Calculate final risk
  if (riskScore >= 5) analysis.riskLevel = 'High';
  else if (riskScore >= 2) analysis.riskLevel = 'Medium';
  else analysis.riskLevel = 'Low';

  if (analysis.summary.length === 0) analysis.summary.push('General logic update.');

  return analysis;
};

// API Endpoint
app.post('/api/analyze', (req, res) => {
  const { diff } = req.body;
  
  if (!diff) {
    return res.status(400).json({ error: 'No diff provided' });
  }

  // Simulate processing delay for "AI" feel
  setTimeout(() => {
    const result = analyzeDiff(diff);
    res.json(result);
  }, 800);
});

// Production: Serve static files from client/dist
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
