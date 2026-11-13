import React, { useState } from 'react';
import { Customer, DialogueChoice } from '../../types/game';
import { ArrowRight, Sparkles, Check, HelpCircle } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

interface DialogueBoxProps {
  customer: Customer;
  onChoiceSelected: (choice: DialogueChoice) => void;
  onProceedToProductSelection: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  customer,
  onChoiceSelected,
  onProceedToProductSelection
}) => {
  const [selectedChoice, setSelectedChoice] = useState<DialogueChoice | null>(null);

  const getCustomerEmoji = (id: string) => {
    if (id.includes('aarav')) return '⚽ 👦';
    if (id.includes('priya')) return '🌸 👩‍👧';
    if (id.includes('kabir')) return '🎒 👦';
    if (id.includes('simran')) return '✨ 👧';
    return '💼 🦈';
  };

  const handleSelect = (choice: DialogueChoice) => {
    if (selectedChoice) return;
    setSelectedChoice(choice);
    if (choice.isCorrect) {
      sounds.playCashRegister();
    } else {
      sounds.playWrong();
    }
    onChoiceSelected(choice);
  };

  return (
    <div className="fixed inset-x-0 bottom-3 sm:bottom-5 z-50 px-3 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border-3 border-amber-300 rounded-3xl shadow-2xl p-3.5 sm:p-4 max-w-md w-full flex flex-col gap-2.5 animate-pop-in relative">
        {/* Cute Customer Name & Role Badge */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl animate-wiggle">
              {getCustomerEmoji(customer.id)}
            </span>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base leading-none">
                {customer.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 font-body">
                {customer.roleDescription}
              </p>
            </div>
          </div>

          <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display border border-rose-200">
            {customer.gradeLevel}
          </span>
        </div>

        {/* Customer Dialogue Bubble */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 rounded-2xl p-2.5 sm:p-3 border-2 border-amber-200/70 text-slate-800 relative">
          <p className="text-xs sm:text-[13px] font-bold font-body leading-snug">
            "{customer.orderQuery}"
          </p>
        </div>

        {/* Question Choices */}
        {!selectedChoice ? (
          <div className="flex flex-col gap-2 pt-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700/80 font-display flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>What should Ravi say?</span>
            </span>

            {customer.dialogueChoices.map((choice, idx) => (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className="text-left bg-gradient-to-r from-slate-50 to-white hover:from-rose-50 hover:to-amber-50 border-2 border-slate-200 hover:border-rose-400 p-2.5 rounded-2xl transition duration-150 text-[11px] sm:text-xs font-bold text-slate-800 shadow-sm active:scale-[0.98] flex items-start gap-2 group cursor-pointer"
              >
                <span className="w-5 h-5 rounded-xl bg-amber-400 text-amber-950 font-display font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-xs group-hover:scale-110 transition">
                  {idx === 0 ? 'A' : 'B'}
                </span>
                <span className="flex-1 font-body leading-snug">{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Instant Kid-Friendly Feedback */
          <div className="flex flex-col gap-2 pt-0.5 animate-pop-in">
            <div
              className={`p-2.5 rounded-2xl border-2 flex items-start gap-2.5 ${
                selectedChoice.isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div className="text-lg shrink-0 mt-0.5">
                {selectedChoice.isCorrect ? '🎉' : '💡'}
              </div>
              <div className="flex-1 text-[11px] sm:text-xs font-body">
                <p className="font-extrabold text-xs mb-0.5 font-display">
                  {selectedChoice.feedback}
                </p>
                <p className="opacity-90 font-medium leading-snug">
                  {selectedChoice.learningPoint}
                </p>
              </div>
            </div>

            {/* Next Step Button */}
            <button
              onClick={onProceedToProductSelection}
              className="self-end bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-display font-extrabold px-4 py-2 rounded-2xl shadow-md hover:shadow-rose-400/30 active:scale-95 transition flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <span>Pick Ice Pop!</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
