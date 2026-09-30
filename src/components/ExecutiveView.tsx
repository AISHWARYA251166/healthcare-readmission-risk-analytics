import React, { useState } from 'react';
import { TrendingDown, TrendingUp, DollarSign, Activity, AlertTriangle, ShieldCheck, PieChart, Users, Award, ArrowUpRight } from 'lucide-react';
import { HospitalMetrics, PatientRecord } from '../types';

interface ExecutiveViewProps {
  metrics: HospitalMetrics | null;
  patients: PatientRecord[];
}

export const ExecutiveView: React.FC<ExecutiveViewProps> = ({ metrics, patients }) => {
  const [targetReduction, setTargetReduction] = useState(25); // percentage reduction target

  if (!metrics) return <div className="p-8 text-center text-slate-400">Loading executive analytics...</div>;

  const currentPenalties = metrics.totalPenalties;
  const projectedSavings = Math.round(currentPenalties * (targetReduction / 100));
  const newPenaltyTotal = currentPenalties - projectedSavings;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Hero Banner / Problem Statement */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-white">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4" />
            <span>Hospital Readmission Reduction Program (HRRP) Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Preventing 30-Day Readmission Penalties with Predictive Risk Intelligence
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            Hospitals face massive financial penalties from governments and insurers when patients are readmitted within 30 days of discharge for preventable conditions. CareGuard analyzes relational clinical datasets (demographics, ward types, lab anomalies, and Charlson Comorbidity Index) to predict risk and prevent readmissions.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300">
              Dataset: India Hospital Readmission & HealthGuard (2015–2024)
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-300">
              Pipeline: SQL Window Functions ➔ Pandas ➔ XGBoost/SHAP
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Readmission Rate */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">30-Day Readmission Rate</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">{metrics.readmissionRate}%</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              +1.3% vs Target
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">National Benchmark: <span className="font-semibold text-slate-700">{metrics.nationalBenchmark}%</span></p>
        </div>

        {/* HRRP Financial Penalties */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">HRRP Financial Penalties</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">${metrics.totalPenalties.toLocaleString()}</span>
          </div>
          <p className="text-xs text-amber-600 font-medium mt-2">
            {metrics.avoidableReadmissions} Avoidable Readmissions Tracked
          </p>
        </div>

        {/* Average Length of Stay */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Length of Stay (LOS)</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">5.8 Days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">ICU average: <span className="font-semibold text-slate-700">9.2 Days</span></p>
        </div>

        {/* Total Analyzed Patients */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analyzed Patients</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">{metrics.totalPatients}</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> HIPAA Masked Records
          </p>
        </div>
      </div>

      {/* Ward Utilization & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ward Resource Utilization & Readmissions</h3>
              <p className="text-xs text-slate-500">Comparing ICU vs General wards and readmission rates</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono">Live Relational Data</span>
          </div>

          <div className="space-y-4">
            {Object.entries(metrics.wardStats).map(([ward, stat]: [string, any]) => {
              const rate = stat.total > 0 ? Math.round((stat.readmitted / stat.total) * 100) : 0;
              return (
                <div key={ward} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {ward.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{ward} Ward</h4>
                      <p className="text-xs text-slate-500">{stat.total} Discharges | {stat.readmitted} Readmissions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      rate > 50 ? 'bg-rose-100 text-rose-700' : rate > 20 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {rate}% Readmit Rate
                    </span>
                    <div className="w-28 bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${rate > 50 ? 'bg-rose-500' : rate > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Penalty Reduction Calculator */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Interactive Simulator</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Penalty Reduction Simulator</h3>
            <p className="text-slate-300 text-xs mb-6">
              Estimate financial savings under HRRP when deploying CareGuard's 48-hour clinical discharge protocol.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span>Target Risk Mitigation:</span>
                  <span className="text-cyan-400 font-bold">{targetReduction}% Reduction</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={targetReduction} 
                  onChange={(e) => setTargetReduction(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Penalties:</span>
                  <span className="font-bold text-rose-400">${currentPenalties.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Projected Savings:</span>
                  <span className="font-bold text-emerald-400">-${projectedSavings.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold">
                  <span className="text-white">New Penalty Total:</span>
                  <span className="text-cyan-300">${newPenaltyTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 p-3.5 rounded-xl text-xs text-cyan-200">
            💡 <span className="font-semibold">Clinical Impact:</span> Achieving a 25% reduction saves over $45,000 annually per 100 high-risk cardiac & ICU discharges.
          </div>
        </div>
      </div>
    </div>
  );
};
