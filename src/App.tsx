/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveView } from './components/ExecutiveView';
import { ClinicalActionView } from './components/ClinicalActionView';
import { SqlPipelineView } from './components/SqlPipelineView';
import { ModelTrainingView } from './components/ModelTrainingView';
import { BiDashboardView } from './components/BiDashboardView';
import { MongoDbManagerView } from './components/MongoDbManagerView';
import { AiAssistantChat } from './components/AiAssistantChat';
import { PatientRecord, HospitalMetrics } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'executive' | 'clinical' | 'training' | 'bi' | 'mongodb' | 'pipeline' | 'ai-chat'>('executive');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [metrics, setMetrics] = useState<HospitalMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [patRes, metRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/metrics')
      ]);
      const patData = await patRes.json();
      const metData = await metRes.json();

      if (patData.success) setPatients(patData.data);
      if (metData.success) setMetrics(metData.metrics);
    } catch (err) {
      console.error("Failed to fetch application data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} metrics={metrics} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Loading CareGuard Hospital Readmission Analytics...</p>
          </div>
        ) : (
          <>
            {activeTab === 'executive' && <ExecutiveView metrics={metrics} patients={patients} />}
            {activeTab === 'clinical' && <ClinicalActionView patients={patients} onRefreshPatients={fetchData} />}
            {activeTab === 'training' && <ModelTrainingView />}
            {activeTab === 'bi' && <BiDashboardView patients={patients} />}
            {activeTab === 'mongodb' && <MongoDbManagerView patients={patients} onRefreshPatients={fetchData} />}
            {activeTab === 'pipeline' && <SqlPipelineView />}
            {activeTab === 'ai-chat' && <AiAssistantChat patients={patients} />}
          </>
        )}
      </main>
    </div>
  );
}

