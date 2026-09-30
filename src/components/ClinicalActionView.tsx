import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, Activity, ChevronRight, Stethoscope, User, Heart, Sparkles, X, PlusCircle } from 'lucide-react';
import { PatientRecord } from '../types';

interface ClinicalActionViewProps {
  patients: PatientRecord[];
  onRefreshPatients: () => void;
}

export const ClinicalActionView: React.FC<ClinicalActionViewProps> = ({ patients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All');
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Custom risk simulator state
  const [showSimulator, setShowSimulator] = useState(false);
  const [simAge, setSimAge] = useState(70);
  const [simCharlson, setSimCharlson] = useState(4);
  const [simHbA1c, setSimHbA1c] = useState(8.5);
  const [simBp, setSimBp] = useState(150);
  const [simCreatinine, setSimCreatinine] = useState(1.9);
  const [simPriors, setSimPriors] = useState(2);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  // Filter logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.wardType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.maskedName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || p.riskCategory === riskFilter;
    const matchesWard = wardFilter === 'All' || p.wardType === wardFilter;
    return matchesSearch && matchesRisk && matchesWard;
  });

  const handleRunPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPrediction(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: simAge,
          charlsonIndex: simCharlson,
          hba1c: simHbA1c,
          systolicBp: simBp,
          creatinine: simCreatinine,
          priorReadmissions: simPriors
        })
      });
      const data = await res.json();
      if (data.success) {
        setPredictionResult(data.prediction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clinical Action View & Risk Tracker</h2>
          <p className="text-xs text-slate-500">Prioritized patient discharge list sorted by AI Readmission Risk Score (0-100%)</p>
        </div>
        <button
          onClick={() => setShowSimulator(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulate Patient Risk & SHAP</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search patient ID, ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Risk Category Filter */}
        <div className="flex items-center space-x-2 bg-white px-4 py-2 border border-slate-200 rounded-xl">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Risk:</span>
          <select
            value={riskFilter}
            onChange={(e: any) => setRiskFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk (&gt;70%)</option>
            <option value="Moderate">Moderate Risk (40-70%)</option>
            <option value="Low">Low Risk (&lt;40%)</option>
          </select>
        </div>

        {/* Ward Filter */}
        <div className="flex items-center space-x-2 bg-white px-4 py-2 border border-slate-200 rounded-xl">
          <Stethoscope className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Ward:</span>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer w-full"
          >
            <option value="All">All Wards</option>
            <option value="ICU">ICU</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Patient Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-4 px-6">Patient ID</th>
                <th className="py-4 px-6">Ward / Stay</th>
                <th className="py-4 px-6">Charlson / Vitals</th>
                <th className="py-4 px-6">AI Risk Score</th>
                <th className="py-4 px-6">Risk Category</th>
                <th className="py-4 px-6 text-right">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.map((patient) => {
                const riskColor = patient.riskCategory === 'High' 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : patient.riskCategory === 'Moderate' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                        <span>{patient.id}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans">{patient.maskedName} | {patient.age}y / {patient.gender}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">{patient.wardType}</span>
                      <p className="text-xs text-slate-500">LOS: {patient.lengthOfStay} Days</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs space-y-0.5">
                        <p><span className="text-slate-400">Charlson:</span> <span className="font-bold text-slate-700">{patient.charlsonIndex}</span></p>
                        <p><span className="text-slate-400">HbA1c:</span> <span className="font-medium text-slate-700">{patient.hba1c}%</span> | <span className="text-slate-400">BP:</span> {patient.bloodPressure}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 text-base">{patient.riskScore}%</span>
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${patient.riskScore >= 70 ? 'bg-rose-500' : patient.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${patient.riskScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${riskColor}`}>
                        {patient.riskCategory} Risk
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="inline-flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-sm"
                      >
                        <span>SHAP Breakdown</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal with SHAP Breakdown */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold font-mono text-lg">
                  {selectedPatient.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Patient Risk & SHAP Explainability</h3>
                  <p className="text-xs text-slate-500">{selectedPatient.maskedName} — {selectedPatient.wardType} Ward</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Banner */}
            <div className={`p-4 rounded-xl mb-6 flex items-center justify-between border ${
              selectedPatient.riskCategory === 'High' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider">AI Readmission Risk Assessment</p>
                <p className="text-2xl font-ext500 font-bold mt-0.5">{selectedPatient.riskScore}% Probability</p>
              </div>
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                selectedPatient.riskCategory === 'High' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {selectedPatient.riskCategory} Risk Profile
              </span>
            </div>

            {/* SHAP Explanation Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center">
                  <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                  SHAP Model Decision Drivers (Why this score?)
                </h4>
                <span className="text-xs text-slate-400 font-mono">XGBoost Feature Attribution</span>
              </div>

              <div className="space-y-3">
                {selectedPatient.shapFactors.map((factor, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-slate-800 text-sm">{factor.feature}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                        +{factor.impact}% Risk Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Discharge Protocol */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-cyan-400 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" /> Recommended Discharge Care Plan
              </h4>
              <ul className="text-xs space-y-2 text-slate-300 font-sans">
                <li>• Schedule mandatory follow-up within 48 hours with primary care physician.</li>
                <li>• Medication reconciliation by clinical pharmacist (check anti-hypertensive & glycemic agents).</li>
                <li>• Home health nurse visit on Day 3 post-discharge to monitor vitals and HbA1c stability.</li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Risk Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Predictive Risk Simulator (SHAP ML)</h3>
              </div>
              <button 
                onClick={() => setShowSimulator(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRunPrediction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient Age</label>
                  <input 
                    type="number" 
                    value={simAge} 
                    onChange={e => setSimAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Charlson Comorbidities</label>
                  <input 
                    type="number" 
                    value={simCharlson} 
                    onChange={e => setSimCharlson(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">HbA1c Level (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={simHbA1c} 
                    onChange={e => setSimHbA1c(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Systolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    value={simBp} 
                    onChange={e => setSimBp(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Serum Creatinine (mg/dL)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={simCreatinine} 
                    onChange={e => setSimCreatinine(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prior Readmissions</label>
                  <input 
                    type="number" 
                    value={simPriors} 
                    onChange={e => setSimPriors(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPrediction}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2 mt-4"
              >
                {loadingPrediction ? <span>Running XGBoost & SHAP Model...</span> : <span>Calculate 30-Day Readmission Risk</span>}
              </button>
            </form>

            {predictionResult && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase">Predicted Risk Score</span>
                    <p className="text-3xl font-ext500 font-bold text-slate-900">{predictionResult.riskScore}%</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    predictionResult.riskCategory === 'High' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {predictionResult.riskCategory} Risk
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase">SHAP Feature Drivers:</p>
                  {predictionResult.shapFactors.map((f: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-800">{f.feature}: {f.description}</span>
                      <span className="font-bold text-purple-600">+{f.impact}%</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900">
                  <span className="font-bold">Recommendation:</span> {predictionResult.recommendation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
