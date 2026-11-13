import React from 'react';
import { Customer } from '../../types/game';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface CelebrationBannerProps {
  customer: Customer;
  xpEarned: number;
  onNextCustomer: () => void;
  isLastCustomer: boolean;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({
  customer,
  xpEarned,
  onNextCustomer,
  isLastCustomer
}) => {
  return (
    <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 px-3 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white rounded-3xl shadow-2xl p-3.5 sm:p-4 max-w-md w-full border-3 border-white flex flex-col gap-2.5 animate-pop-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-wiggle">🎉</span>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base leading-none">
                Sale Complete!
              </h3>
              <p className="text-[10px] text-emerald-100 font-bold font-body">
                {customer.name} loved the treat!
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-display font-black text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>+{xpEarned} XP</span>
          </div>
        </div>

        {/* Customer reaction quote */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-start gap-2">
          <Heart className="w-4 h-4 text-rose-300 shrink-0 mt-0.5 fill-rose-300" />
          <p className="text-xs font-bold text-white italic font-body leading-snug">
            "{customer.successReaction}"
          </p>
        </div>

        {customer.badgeUnlock && (
          <div className="self-start bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-xl text-[10px] font-display font-black shadow-xs flex items-center gap-1">
            <span>🏆 Badge:</span>
            <span>{customer.badgeUnlock}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onNextCustomer}
          className="self-end bg-white hover:bg-amber-100 text-slate-900 font-display font-black px-4 py-2 rounded-2xl shadow-md active:scale-95 transition flex items-center gap-1.5 text-xs cursor-pointer"
        >
          <span>{isLastCustomer ? 'Meet the Shark Tank 🦈' : 'Next Customer!'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
        </button>
      </div>
    </div>
  );
};
