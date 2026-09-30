import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, Code, Cpu, CheckCircle2, Terminal } from 'lucide-react';
import { PipelineStep } from '../types';

export const SqlPipelineView: React.FC = () => {
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sql-pipeline')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPipelineSteps(data.steps);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Blueprint Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Database className="w-4 h-4" />
          <span>Architecture & Data Pipeline Blueprint</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">From Raw Relational Tables to AI Risk Scoring</h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed mb-6">
          [Raw Relational Tables] ➔ [Secure SQL Feature Pipeline] ➔ [Python/Pandas Feature Engineering] ➔ [XGBoost & SHAP Risk Scoring] ➔ [Executive & Clinical Dashboard]
        </p>

        {/* HIPAA Privacy Note Badge */}
        <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-xl flex items-start space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-200">Portfolio Highlight: HIPAA-Compliant Data Privacy & Pseudonymization</h4>
            <p className="text-xs text-emerald-300/90 mt-1 leading-relaxed">
              To simulate a HIPAA-compliant environment, all explicit patient identifiers (Patient Name, SSN/Aadhar, Exact Street Address, Phone Number) are automatically dropped or cryptographically masked at the SQL Ingestion layer using SHA-256 salting (`PT-XXXXX`). Only masked demographic initials and clinical metrics are exposed to the analytics engine.
            </p>
          </div>
        </div>
      </div>

      {/* SQL Pipeline Steps */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <Terminal className="w-5 h-5 text-cyan-600 mr-2" />
          Step-by-Step SQL & Feature Engineering Implementation
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading pipeline steps...</div>
        ) : (
          pipelineSteps.map((step) => (
            <div key={step.step} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full border border-cyan-200">
                  PostgreSQL / BigQuery ANSI SQL
                </span>
              </div>

              <div className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
                <pre className="leading-relaxed">
                  <code>{step.sql}</code>
                </pre>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Python Feature Engineering Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-indigo-600 font-mono text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Python & Pandas Clinical Feature Engineering</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Engineering Clinical Context in Pandas</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Healthcare data is inherently noisy. Our Python feature pipeline groups patients into Comorbidity Buckets based on the Charlson Comorbidity Index and generates automated flags for unstable vitals at discharge:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">1. Comorbidity Buckets</h4>
            <p className="text-xs text-slate-500">Grouped patients into low (0-1), moderate (2-3), and high (4+) chronic condition categories to reflect multi-system fragility.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">2. Lab Value Anomalies</h4>
            <p className="text-xs text-slate-500">Flagged patients discharged with HbA1c &gt; 8.0%, Systolic BP &gt; 140 mmHg, or elevated serum creatinine (&gt; 1.5 mg/dL).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">3. SHAP Explainability</h4>
            <p className="text-xs text-slate-500">Integrated TreeExplainer to output exact feature contributions for every 0-100% readmission risk score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
