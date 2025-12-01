import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Activity, Code, ArrowRight } from 'lucide-react';

const MOCK_DIFF = `
diff --git a/src/UserAuth.hh b/src/UserAuth.hh
index 832a..b123 100644
--- a/src/UserAuth.hh
+++ b/src/UserAuth.hh
@@ -12,4 +12,5 @@
+ // TODO: Remove this before prod
+ var_dump($userData);
+ if ($user->isAdmin) {
+    Auth::bypassChecks();
+ }
`;

function App() {
  const [diffText, setDiffText] = useState(MOCK_DIFF);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff: diffText }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans">
      {/* Header */}
      <nav className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Activity className="text-[#0668E1]" />
          <h1 className="text-xl font-bold tracking-tight">Diff-Focus</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <Code size={18} /> Raw Diff Input
            </h2>
            <textarea
              className="w-full h-96 p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0668E1]"
              value={diffText}
              onChange={(e) => setDiffText(e.target.value)}
              placeholder="Paste git diff here..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-[#0668E1] hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Generate Context'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col gap-4">
          {!analysis && !loading && (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              <p>Waiting for diff input...</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0668E1]"></div>
                <p>Analyzing diff...</p>
              </div>
            </div>
          )}

          {analysis && (
            <div className="flex flex-col gap-4 animate-fade-in">
              
              {/* Risk Card */}
              <div className={`p-6 rounded-lg shadow-sm border-l-4 ${
                analysis.riskLevel === 'High' ? 'bg-red-50 border-red-500' :
                analysis.riskLevel === 'Medium' ? 'bg-orange-50 border-orange-400' :
                'bg-green-50 border-green-500'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm uppercase tracking-wide font-bold text-gray-500">Risk Assessment</h3>
                    <p className={`text-2xl font-bold ${
                      analysis.riskLevel === 'High' ? 'text-red-700' :
                      analysis.riskLevel === 'Medium' ? 'text-orange-700' :
                      'text-green-700'
                    }`}>{analysis.riskLevel} Risk</p>
                  </div>
                  {analysis.riskLevel === 'High' ? <AlertTriangle className="text-red-500" size={32} /> : <CheckCircle className="text-green-500" size={32} />}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-3">Changes Summary</h3>
                <div className="flex gap-2 mb-4">
                  {analysis.fileTypes.map((type, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-xs font-semibold rounded text-gray-600">
                      {type}
                    </span>
                  ))}
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {analysis.summary.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>

              {/* Flags Card */}
              {analysis.flags.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg mb-3">Detection Flags</h3>
                  <div className="space-y-3">
                    {analysis.flags.map((flag, i) => (
                      <div key={i} className={`p-3 rounded border flex items-center gap-3 ${
                        flag.type === 'danger' ? 'bg-red-50 border-red-100 text-red-700' :
                        flag.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                        'bg-blue-50 border-blue-100 text-blue-700'
                      }`}>
                        <AlertTriangle size={16} />
                        <span className="text-sm font-medium">{flag.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
