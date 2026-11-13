import React, { useState } from 'react';
import { Customer, IcePop } from '../../types/game';
import { SKIPPI_PRODUCTS } from '../../data/skippiData';
import { Sparkles, Check } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

interface ProductSelectorProps {
  customer: Customer;
  onProductSelectedAndHandedOver: (product: IcePop) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  customer,
  onProductSelectedAndHandedOver
}) => {
  const [selectedProduct, setSelectedProduct] = useState<IcePop>(
    SKIPPI_PRODUCTS.find((p) => p.id === customer.preferredFlavorId) || SKIPPI_PRODUCTS[0]
  );

  const handleSelectProduct = (product: IcePop) => {
    setSelectedProduct(product);
    sounds.playPickup();
  };

  const handleHandover = () => {
    sounds.playCashRegister();
    onProductSelectedAndHandedOver(selectedProduct);
  };

  return (
    <div className="fixed inset-x-0 bottom-3 sm:bottom-5 z-50 px-3 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border-3 border-amber-300 rounded-3xl shadow-2xl p-3 sm:p-4 max-w-lg w-full flex flex-col gap-2.5 animate-pop-in">
        {/* Header with Customer Goal */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍧</span>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base leading-none">
                Pick a Skippi Treat!
              </h3>
              <p className="text-[10px] font-bold text-slate-500 font-body">
                Budget: <strong className="text-emerald-600 font-extrabold">₹{customer.budget}</strong> • Wants:{' '}
                <span className="capitalize font-extrabold text-rose-600">{customer.preferredFlavorId.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-display border border-emerald-300">
            100% RO Water
          </span>
        </div>

        {/* Product Selection Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {SKIPPI_PRODUCTS.map((product) => {
            const isSelected = selectedProduct.id === product.id;
            return (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`p-1.5 sm:p-2 rounded-2xl flex flex-col items-center text-center transition-all duration-150 relative cursor-pointer ${
                  isSelected
                    ? 'border-2 border-rose-500 bg-rose-50 shadow-md scale-105 ring-2 ring-rose-300'
                    : 'border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg mb-1 shadow-inner"
                  style={{ backgroundColor: `${product.colorHex}22` }}
                >
                  {product.emoji}
                </div>
                <span className="font-display font-extrabold text-[10px] text-slate-800 leading-tight truncate w-full">
                  {product.flavor}
                </span>
                <span className="font-extrabold text-[9px] text-emerald-600 font-display">
                  ₹{product.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Product Banner & Handover Button */}
        <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-amber-50 to-rose-50 p-2 sm:p-2.5 rounded-2xl border border-amber-200/80">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-xs border-2 border-white shrink-0"
              style={{ backgroundColor: selectedProduct.colorHex }}
            >
              {selectedProduct.emoji}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                  {selectedProduct.name}
                </h4>
                <span className="text-[10px] font-black text-rose-600 bg-white px-1.5 py-0.2 rounded-full shadow-xs shrink-0 font-display">
                  ₹{selectedProduct.price}
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 truncate font-body">
                {selectedProduct.benefits[0]}
              </p>
            </div>
          </div>

          <button
            onClick={handleHandover}
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-display font-black px-3.5 py-2 rounded-2xl shadow-md active:scale-95 transition flex items-center gap-1 text-xs shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
            <span>Hand Over! 🍧</span>
          </button>
        </div>
      </div>
    </div>
  );
};
