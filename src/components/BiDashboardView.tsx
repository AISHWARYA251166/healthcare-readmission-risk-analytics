import React, { useState } from 'react';
import { BarChart3, TrendingUp, Filter, Layers, Download, CheckCircle, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { PatientRecord } from '../types';

interface BiDashboardViewProps {
  patients: PatientRecord[];
}

export const BiDashboardView: React.FC<BiDashboardViewProps> = ({ patients }) => {
  const [biTool, setBiTool] = useState<'PowerBI' | 'Tableau'>('PowerBI');
  const [selectedWard, setSelectedWard] = useState('All');

  // Filter patients by selected ward
  const filteredPatients = selectedWard === 'All' 
    ? patients 
    : patients.filter(p => p.wardType === selectedWard);

  const totalPatients = filteredPatients.length;
  const readmittedCount = filteredPatients.filter(p => p.readmitted30Days).length;
  const readmissionRate = totalPatients > 0 ? ((readmittedCount / totalPatients) * 100).toFixed(1) : '0';
  const totalPenalties = readmittedCount * 15200;
  const highRiskCount = filteredPatients.filter(p => p.riskCategory === 'High').length;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header and Toggle */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Interactive Enterprise BI Dashboards</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Tableau & Power BI Live Slicer Dashboard</h2>
          <p className="text-slate-300 text-sm">
            Select ward slicers below to dynamically filter DAX calculations, penalties, and readmission charts.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setBiTool('PowerBI')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              biTool === 'PowerBI' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Microsoft Power BI
          </button>
          <button
            onClick={() => setBiTool('Tableau')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              biTool === 'Tableau' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Tableau Desktop
          </button>
        </div>
      </div>

      {/* BI Slicers & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase">Interactive Slicer (Ward Filter):</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg text-slate-800 focus:outline-none"
          >
            <option value="All">All Wards ({patients.length} patients)</option>
            <option value="Cardiology">Cardiology Ward</option>
            <option value="ICU">ICU Ward</option>
            <option value="Neurology">Neurology Ward</option>
            <option value="Pulmonology">Pulmonology Ward</option>
            <option value="Orthopedics">Orthopedics Ward</option>
            <option value="General">General Ward</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-500">Active Slicer: <strong className="text-slate-800">{selectedWard}</strong></span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">● DAX Calculated</span>
        </div>
      </div>

      {/* Embedded BI Simulator Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${biTool === 'PowerBI' ? 'bg-amber-400' : 'bg-cyan-400'}`}></div>
            <h3 className="font-bold text-sm tracking-wide">
              {biTool === 'PowerBI' ? 'Power BI Service - Readmission_Analytics_v4.pbix' : 'Tableau Cloud - Hospital_Risk_Executive_Workbook'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Filtered View: {totalPatients} Records</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">DAX Penalty Cost</span>
              <p className="text-3xl font-ext500 font-bold text-rose-600 mt-2">${totalPenalties.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">{readmittedCount} avoidable readmissions</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Readmit Rate</span>
              <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{readmissionRate}%</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Benchmark: 13.5%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">High Risk Patients</span>
              <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{highRiskCount}</p>
              <p className="text-xs text-cyan-600 font-medium mt-1">Requires 48h Follow-up</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Sliced Records</span>
              <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{totalPatients}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Filtered by Ward: {selectedWard}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Ward Sliced Monthly Penalty & Risk Trend ({selectedWard})</h4>
            <div className="h-48 flex items-end justify-between gap-3 px-4 pt-8 bg-slate-50 rounded-xl border border-slate-100">
              {[
                { month: 'Jan', rate: Number((Number(readmissionRate) * 1.15).toFixed(1)), height: '70%' },
                { month: 'Feb', rate: Number((Number(readmissionRate) * 1.10).toFixed(1)), height: '65%' },
                { month: 'Mar', rate: Number((Number(readmissionRate) * 1.05).toFixed(1)), height: '60%' },
                { month: 'Apr', rate: Number((Number(readmissionRate) * 1.02).toFixed(1)), height: '58%' },
                { month: 'May', rate: Number((Number(readmissionRate) * 0.98).toFixed(1)), height: '55%' },
                { month: 'Jun', rate: Number(readmissionRate), height: '50%' }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600">{item.rate}%</span>
                  <div 
                    className={`w-full rounded-t-lg transition-all ${biTool === 'PowerBI' ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    style={{ height: item.height }}
                  ></div>
                  <span className="text-xs font-semibold text-slate-700">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
