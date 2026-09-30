import React, { useState } from 'react';
import { Database, Plus, Trash2, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Server, FileText } from 'lucide-react';
import { PatientRecord } from '../types';

interface MongoDbManagerViewProps {
  patients: PatientRecord[];
  onRefreshPatients: () => void;
}

export const MongoDbManagerView: React.FC<MongoDbManagerViewProps> = ({ patients, onRefreshPatients }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [maskedName, setMaskedName] = useState('Patient X.');
  const [age, setAge] = useState(65);
  const [gender, setGender] = useState('Female');
  const [wardType, setWardType] = useState<'ICU' | 'General' | 'Cardiology' | 'Orthopedics' | 'Pulmonology' | 'Neurology'>('Cardiology');
  const [hba1c, setHba1c] = useState(8.2);
  const [bloodPressure, setBloodPressure] = useState('150/92');
  const [creatinine, setCreatinine] = useState(1.8);
  const [charlsonIndex, setCharlsonIndex] = useState(4);
  const [priorReadmissions, setPriorReadmissions] = useState(1);
  const [readmitted30Days, setReadmitted30Days] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maskedName,
          age,
          gender,
          wardType,
          hba1c,
          bloodPressure,
          creatinine,
          charlsonIndex,
          priorReadmissions,
          readmitted30Days
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Patient document successfully inserted into MongoDB cluster! Penalties and readmission rates updated.');
        onRefreshPatients();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm(`Are you sure you want to delete patient ${id} from MongoDB database?`)) return;
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefreshPatients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPenalties = patients.filter(p => p.readmitted30Days).length * 15200;
  const readmissionRate = patients.length > 0 
    ? ((patients.filter(p => p.readmitted30Days).length / patients.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            <span>MongoDB Database & Penalty Calculation Engine</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Live MongoDB Document Collection Manager</h2>
          <p className="text-slate-300 text-sm">
            Add or remove patient records. All changes instantly update HRRP financial penalties and readmission rates in real-time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Patient to MongoDB</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Database Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">MongoDB Documents</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{patients.length} Records</p>
          <span className="text-[11px] text-emerald-600 font-medium">Collection: hospital_patients</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Avoidable Penalties</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">${totalPenalties.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 font-medium">HRRP $15,200 per readmit</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Readmission Rate</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{readmissionRate}%</p>
          <span className="text-[11px] text-cyan-600 font-medium">Dynamic DB calculation</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Database Status</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">Connected</p>
          <span className="text-[11px] text-slate-500 font-medium">MongoDB Atlas Replica</span>
        </div>
      </div>

      {/* Patient Collection Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">mongodb://cluster0.hospital.net/careguard</span>
          <span className="text-xs font-mono text-slate-400">Total Documents: {patients.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="py-3 px-6">_id / Patient ID</th>
                <th className="py-3 px-6">Ward & Vitals</th>
                <th className="py-3 px-6">Charlson / HbA1c</th>
                <th className="py-3 px-6">Risk Score</th>
                <th className="py-3 px-6">30-Day Readmit?</th>
                <th className="py-3 px-6 text-right">Database Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {p.id}
                    <div className="text-xs font-sans text-slate-500">{p.maskedName} ({p.age}y / {p.gender})</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-md">{p.wardType}</span>
                    <div className="text-xs text-slate-500 mt-1">BP: {p.bloodPressure} | Cr: {p.creatinine}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-800">Index: {p.charlsonIndex}</span>
                    <div className="text-xs text-slate-500">HbA1c: {p.hba1c}%</div>
                  </td>
                  <td className="py-4 px-6 font-bold">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${
                      p.riskScore >= 70 ? 'bg-rose-100 text-rose-800' : p.riskScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.riskScore}% ({p.riskCategory})
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {p.readmitted30Days ? (
                      <span className="text-rose-600 font-bold text-xs flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Yes ($15.2k Penalty)
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> No Penalty
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeletePatient(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete document from MongoDB"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Insert Patient Document (MongoDB)</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient Initials</label>
                  <input
                    type="text"
                    value={maskedName}
                    onChange={e => setMaskedName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ward Type</label>
                  <select
                    value={wardType}
                    onChange={(e: any) => setWardType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="ICU">ICU</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">HbA1c (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hba1c}
                    onChange={e => setHba1c(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={e => setBloodPressure(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Creatinine</label>
                  <input
                    type="number"
                    step="0.1"
                    value={creatinine}
                    onChange={e => setCreatinine(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Charlson Index</label>
                  <input
                    type="number"
                    value={charlsonIndex}
                    onChange={e => setCharlsonIndex(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">30-Day Readmission</label>
                  <select
                    value={readmitted30Days ? 'true' : 'false'}
                    onChange={e => setReadmitted30Days(e.target.value === 'true')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="true">Yes (Readmitted / $15.2k penalty)</option>
                    <option value="false">No (Stable)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Inserting into MongoDB...' : 'Save Patient Document & Recalculate Penalties'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
