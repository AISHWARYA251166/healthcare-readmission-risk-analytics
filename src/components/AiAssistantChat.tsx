import React, { useState } from 'react';
import { Sparkles, Send, Stethoscope, Bot, User, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PatientRecord } from '../types';

interface AiAssistantChatProps {
  patients: PatientRecord[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantChat: React.FC<AiAssistantChatProps> = ({ patients }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am CareGuard Clinical AI, powered by Gemini. I can help you analyze hospital readmission trends, explain SHAP risk scores, or formulate evidence-based discharge care plans. How can I assist your clinical team today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          patientContext: patients.slice(0, 3) // send sample high-risk patients for clinical context
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to generate response'}` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error connecting to CareGuard AI server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 border border-purple-900/50 shadow-xl text-white">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold">CareGuard AI Clinical Assistant</h2>
            <p className="text-xs text-purple-300">Powered by Gemini 3.5 Flash Server-Side Intelligence</p>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
          Ask questions about patient risk factors, readmission penalty mitigation strategies, or request customized clinical discharge protocols.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickPrompt("What are the primary clinical drivers for high readmission rates in Cardiology?")}
          className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 font-medium transition-all shadow-sm"
        >
          🩺 Cardiology readmission drivers?
        </button>
        <button
          onClick={() => handleQuickPrompt("How can we mitigate financial penalties under HRRP for diabetic patients?")}
          className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 font-medium transition-all shadow-sm"
        >
          💰 HRRP penalty mitigation strategy
        </button>
        <button
          onClick={() => handleQuickPrompt("Draft a 48-hour post-discharge care protocol for a patient with Charlson Index >= 4.")}
          className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 font-medium transition-all shadow-sm"
        >
          📋 Draft 48-hr discharge protocol
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-purple-100 text-purple-700'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-100 rounded-2xl p-4 text-sm text-slate-500 animate-pulse">
                CareGuard AI is analyzing clinical data and SHAP factors...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask CareGuard AI anything about patient risk or discharge care..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2 shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
