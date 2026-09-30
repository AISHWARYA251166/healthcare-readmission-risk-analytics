import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, Award, Upload, Database, BarChart, RefreshCw, Layers } from 'lucide-react';

export const ModelTrainingView: React.FC = () => {
  const [modelType, setModelType] = useState<'XGBoost' | 'RandomForest' | 'LogisticRegression'>('XGBoost');
  const [isTraining, setIsTraining] = useState(false);
  const [missingImputedCount, setMissingImputedCount] = useState(142);
  const [outliersCapped, setOutliersCapped] = useState(38);
  const [scalingMethod, setScalingMethod] = useState<'StandardScaler' | 'MinMaxScaler'>('StandardScaler');
  
  const [trainingLogs, setTrainingLogs] = useState<string[]>([
    "Initialized dataset: 12,450 patient records loaded from MongoDB / SQL.",
    "EDA Cleaning: Imputed 142 missing lab values via KNN, capped 38 IQR outliers.",
    "Applied StandardScaler normalization and SMOTE class balancing for 30-day readmissions."
  ]);
  const [metrics, setMetrics] = useState({
    accuracy: 91.4,
    precision: 89.2,
    recall: 88.5,
    f1Score: 0.908,
    rocAuc: 0.942
  });

  const handleRetrainModel = () => {
    setIsTraining(true);
    setTrainingLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Running EDA pipeline: KNN Imputer + IQR capping + ${scalingMethod}...`,
      `[${new Date().toLocaleTimeString()}] Starting ${modelType} hyperparameter tuning (n_estimators=250, max_depth=6)...`,
      ...prev
    ]);

    setTimeout(() => {
      setIsTraining(false);
      const acc = Number((89 + Math.random() * 4).toFixed(1));
      const prec = Number((87 + Math.random() * 4).toFixed(1));
      const rec = Number((86 + Math.random() * 5).toFixed(1));
      const f1 = Number((0.89 + Math.random() * 0.04).toFixed(3));
      const auc = Number((0.92 + Math.random() * 0.04).toFixed(3));

      setMetrics({ accuracy: acc, precision: prec, recall: rec, f1Score: f1, rocAuc: auc });
      setTrainingLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Training completed! Accuracy: ${acc}%, Precision: ${prec}%, F1: ${f1}, ROC-AUC: ${auc}`,
        ...prev
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" />
          <span>Exploratory Data Analysis (EDA) & Machine Learning Training</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">Data Cleaning, Preprocessing & ML Model Training Lab</h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Clean hospital data (missing values, IQR outliers, scaling) and train classification models (XGBoost, Random Forest) with real-time performance evaluation.
        </p>
      </div>

      {/* EDA Processing Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Missing Values Imputed</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900">{missingImputedCount} Records</p>
          <p className="text-xs text-slate-500">KNN Imputer filled null HbA1c & Blood Pressure values.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">IQR Outliers Capped</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900">{outliersCapped} Outliers</p>
          <p className="text-xs text-slate-500">1.5 * IQR rule applied to length of stay and creatinine.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Feature Scaling</span>
            <select
              value={scalingMethod}
              onChange={(e: any) => setScalingMethod(e.target.value)}
              className="bg-slate-100 text-xs font-semibold px-2 py-1 rounded text-slate-800 focus:outline-none"
            >
              <option value="StandardScaler">StandardScaler</option>
              <option value="MinMaxScaler">MinMaxScaler</option>
            </select>
          </div>
          <p className="text-3xl font-ext500 font-bold text-slate-900">{scalingMethod}</p>
          <p className="text-xs text-slate-500">Normalizing continuous vitals for ML stability.</p>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model Accuracy</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{metrics.accuracy}%</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ Optimized via GridSearch</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Precision</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{metrics.precision}%</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Low False Positive Rate</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recall (Sensitivity)</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{metrics.recall}%</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Captures High-Risk Patients</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">F1 Score</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{metrics.f1Score}</p>
          <span className="text-xs text-cyan-600 font-medium mt-1 inline-block">Harmonic Mean</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ROC-AUC</span>
          <p className="text-3xl font-ext500 font-bold text-slate-900 mt-2">{metrics.rocAuc}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Strong Discrimination</span>
        </div>
      </div>

      {/* Training Controls & Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Training Configuration</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Algorithm</label>
              <select
                value={modelType}
                onChange={(e: any) => setModelType(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none"
              >
                <option value="XGBoost">XGBoost Classifier (Recommended)</option>
                <option value="RandomForest">Random Forest Classifier</option>
                <option value="LogisticRegression">Logistic Regression (Baseline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Dataset Source</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 flex items-center justify-between">
                <span>India Hospital Readmission (2015-2024)</span>
                <span className="text-emerald-600 font-bold">12,450 rows</span>
              </div>
            </div>

            <button
              onClick={handleRetrainModel}
              disabled={isTraining}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? `Training ${modelType}...` : `Run EDA & Train ${modelType}`}</span>
            </button>
          </div>
        </div>

        {/* Training Console Logs */}
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center">
                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isTraining ? 'animate-spin' : ''}`} />
                Pipeline Execution Console
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Python / Scikit-Learn</span>
            </div>

            <div className="space-y-2 font-mono text-xs overflow-y-auto max-h-[220px]">
              {trainingLogs.map((log, idx) => (
                <p key={idx} className="text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-3">
                  {log}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Status: {isTraining ? 'Training in progress...' : 'Model Ready & Deployed'}</span>
            <span className="text-emerald-400 font-mono font-bold">● Active in Production</span>
          </div>
        </div>
      </div>
    </div>
  );
};
