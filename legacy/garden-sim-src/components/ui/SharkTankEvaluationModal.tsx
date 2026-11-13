import React from 'react';
import { GameStats } from '../../types/game';
import { Trophy, CheckCircle, Award, RotateCcw, Share2, Sparkles, BookOpen } from 'lucide-react';

interface EvaluationModalProps {
  stats: GameStats;
  onRestart: () => void;
}

export const SharkTankEvaluationModal: React.FC<EvaluationModalProps> = ({ stats, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Header Ribbon */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-3xl shadow-xl shadow-rose-500/20">
            🏆
          </div>
          <span className="bg-rose-100 text-rose-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-300">
            Shark Tank India • Case Study Completed!
          </span>
          <h2 className="font-extrabold text-slate-900 text-2xl sm:text-3xl leading-tight">
            Skippi Ice Pops Garden Venture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md">
            You successfully navigated customer demand, defended hygiene, leveraged ready-to-freeze logistics, and mastered brand value!
          </p>
        </div>

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
          <div className="text-center p-2">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Total Revenue</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600">₹{stats.revenue}</span>
          </div>
          <div className="text-center p-2">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Customers</span>
            <span className="text-xl sm:text-2xl font-black text-sky-600">{stats.customersServed} / 5</span>
          </div>
          <div className="text-center p-2">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Satisfaction</span>
            <span className="text-xl sm:text-2xl font-black text-amber-600">
              {Math.round(stats.satisfactionScore)}%
            </span>
          </div>
          <div className="text-center p-2">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Total XP</span>
            <span className="text-xl sm:text-2xl font-black text-purple-600">{stats.xp} XP</span>
          </div>
        </div>

        {/* Official Shark Tank Evaluation Rubric (Section 13 of POA) */}
        <div className="flex flex-col gap-2.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-500" />
            <span>Shark Tank Pitch Evaluation Rubric (Marks: 30/30)</span>
          </h3>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {[
              { criteria: 'Problem Understanding & Childhood Nostalgia', marks: '5 / 5', desc: 'Identified unhygienic street gola pain point and modern solution.' },
              { criteria: 'Product Innovation (Ready-to-Freeze Technology)', marks: '5 / 5', desc: 'Eliminated refrigerated cold-chain shipping costs via liquid pouches.' },
              { criteria: 'Business Model & Financial Understanding', marks: '5 / 5', desc: 'Balanced unit economics, margins, and off-season demand planning.' },
              { criteria: 'Marketing & Customer Psychology', marks: '5 / 5', desc: 'Earned parent trust through 100% RO water & natural plant dyes.' },
              { criteria: 'Teamwork & Strategic Problem Solving', marks: '5 / 5', desc: 'Successfully addressed multi-stakeholder questions across all age groups.' },
              { criteria: 'Confidence & Shark Q&A Defense', marks: '5 / 5', desc: 'Mastered the All-Sharks deal negotiation and expansion roadmap.' },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition">
                <div className="flex items-start gap-2 max-w-sm sm:max-w-md">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">{row.criteria}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{row.desc}</span>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {row.marks}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Master Reflection Question from POA Section 13 */}
        <div className="bg-gradient-to-br from-purple-50 to-rose-50 p-4 rounded-2xl border-2 border-purple-200 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Final Shark Tank Student Challenge:</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed italic">
            "If you were given ₹1 Crore to build your own ice-pop brand today, would you focus on making the tastiest product, creating the strongest brand identity, or building the biggest distribution network? Defend your decision!"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Run Another Selling Sprint</span>
          </button>
        </div>
      </div>
    </div>
  );
};

