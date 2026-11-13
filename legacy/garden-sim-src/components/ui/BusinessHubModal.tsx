import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  Award, 
  Layers, 
  Rocket, 
  Check, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

interface BusinessHubProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignLaunched: (bonusXp: number) => void;
}

export const BusinessHubModal: React.FC<BusinessHubProps> = ({
  isOpen,
  onClose,
  onCampaignLaunched
}) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'revenue' | 'kmatrix' | 'campaign'>('pitch');

  // Campaign Creator state
  const [tagline, setTagline] = useState<string>('Dive into Delight');
  const [audience, setAudience] = useState<string>('Health-Conscious Parents & Kids');
  const [platform, setPlatform] = useState<string>('Freezer Bikes at School Summer Camps');
  const [campaignLaunched, setCampaignLaunched] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLaunchCampaign = () => {
    setCampaignLaunched(true);
    sounds.playCashRegister();
    onCampaignLaunched(75);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-amber-300 max-w-3xl w-full p-5 sm:p-7 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              📊
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-xl">
                Skippi Strategic Business Hub
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Interactive Case Study & Financial Decision Room
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'pitch', label: 'Shark Tank Deal', icon: Award },
            { id: 'revenue', label: 'Revenue Journey', icon: BarChart3 },
            { id: 'kmatrix', label: 'K-Matrix Arena', icon: Layers },
            { id: 'campaign', label: 'Campaign Studio', icon: Rocket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Shark Tank Pitch Room */}
        {activeTab === 'pitch' && (
          <div className="flex flex-col gap-4 animate-fade-in text-xs sm:text-sm">
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 rounded-2xl border border-amber-200 flex flex-col gap-2">
              <span className="font-extrabold text-rose-600 uppercase text-[11px] tracking-wider">
                Historic Television Milestone
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                The First Ever 'All-Sharks' Deal in Shark Tank India History!
              </h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                Founders Ravi and Anuja Kabra entered asking for <strong>₹45 Lakh for 5% equity</strong> (valuing the business at ₹9 Crore). The Sharks loved the product's hygiene, nostalgia, and ready-to-freeze supply chain, teaming up to invest <strong>₹1 Crore for 15% equity</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 p-3.5 rounded-2xl bg-white shadow-xs">
                <span className="text-slate-500 font-bold text-[11px] uppercase block mb-1">
                  Original Founder Ask
                </span>
                <span className="text-xl font-extrabold text-slate-800 block">₹45 Lakh</span>
                <span className="text-xs font-semibold text-slate-500">For 5% Equity (Valuation: ₹9 Cr)</span>
              </div>

              <div className="border-2 border-emerald-400 p-3.5 rounded-2xl bg-emerald-50/60 shadow-xs">
                <span className="text-emerald-700 font-bold text-[11px] uppercase block mb-1">
                  Final All-Sharks Offer
                </span>
                <span className="text-xl font-extrabold text-emerald-700 block">₹1 Crore</span>
                <span className="text-xs font-semibold text-emerald-800">
                  For 15% Equity (Implied Valuation: ~₹6.67 Cr)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-slate-700 text-xs font-medium">
                <strong>Why did all 5 Sharks invest?</strong> Because Skippi turned an unorganized, unhygienic street commodity (ice gola) into a standardized, branded, tamper-proof FMCG product.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: The Revenue Curve & Case Study Analysis */}
        {activeTab === 'revenue' && (
          <div className="flex flex-col gap-4 animate-fade-in text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Skippi's Reported Revenue Curve (FY22 – FY25)
                </h3>
                <p className="text-slate-500 text-xs">
                  Source: Inc42 and Media Financial Filings
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Financial Literacy</span>
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {[
                { year: 'FY22', rev: '₹2.5 Cr', width: '12%', color: 'bg-sky-500', note: 'Post Shark Tank launch' },
                { year: 'FY23', rev: '₹15.4 Cr', width: '77%', color: 'bg-emerald-500', note: 'National retail rollout' },
                { year: 'FY24', rev: '₹20.0 Cr', width: '100%', color: 'bg-emerald-600', note: 'Peak revenue reach' },
                { year: 'FY25', rev: '₹8.2 Cr', width: '41%', color: 'bg-rose-500', note: 'Revenue drop (Inc42 report)' },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-slate-800">{bar.year}</span>
                    <span className="text-slate-900 font-extrabold">{bar.rev} <span className="text-slate-400 font-normal">({bar.note})</span></span>
                  </div>
                  <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color} rounded-full transition-all duration-1000 flex items-center justify-end px-2 text-[10px] text-white font-bold`}
                      style={{ width: bar.width }}
                    >
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Thinking Question from POA Section 5 */}
            <div className="bg-rose-50 border-2 border-rose-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-rose-950">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-extrabold mb-1">
                  The Billion-Rupee Lesson: High Revenue ≠ Profitability
                </strong>
                <p className="text-xs font-medium opacity-90 leading-relaxed">
                  Notice how revenue fell from ₹20 Cr to ₹8.2 Cr in FY25. Why? Ice pops face severe <strong>seasonal demand</strong> in Indian winters. Without strong off-season demand forecasting and tight inventory management, unsold stocks and marketing overhead can strain a young company.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: The Competitive K-Matrix */}
        {activeTab === 'kmatrix' && (
          <div className="flex flex-col gap-3 animate-fade-in text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm">
              K-Matrix: Comparing Skippi with Substitutes (POA Section 7)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 text-[11px]">
                    <th className="p-2.5">Feature</th>
                    <th className="p-2.5 text-rose-600 bg-rose-50/50">Skippi Ice Pops</th>
                    <th className="p-2.5 text-slate-600">Local Street Gola</th>
                    <th className="p-2.5 text-slate-600">Branded Ice Cream</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-2.5 font-bold">Childhood Nostalgia</td>
                    <td className="p-2.5 bg-rose-50/30 text-emerald-600 font-bold">✔ High</td>
                    <td className="p-2.5 text-emerald-600 font-bold">✔ High</td>
                    <td className="p-2.5 text-emerald-600 font-bold">✔ High</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Hygienic RO Water</td>
                    <td className="p-2.5 bg-rose-50/30 text-emerald-600 font-bold">✔ 100% Certified</td>
                    <td className="p-2.5 text-rose-500 font-bold">✘ Unverified / Tap</td>
                    <td className="p-2.5 text-emerald-600 font-bold">✔ Certified</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Ready-to-Freeze (Ambient)</td>
                    <td className="p-2.5 bg-rose-50/30 text-emerald-600 font-bold">✔ Yes (Travel Friendly)</td>
                    <td className="p-2.5 text-rose-500 font-bold">✘ Instant Melt</td>
                    <td className="p-2.5 text-rose-500 font-bold">✘ Melts in 15 mins</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Cold Chain Freight Cost</td>
                    <td className="p-2.5 bg-rose-50/30 text-emerald-600 font-bold">✔ Low (Standard Trucks)</td>
                    <td className="p-2.5 text-slate-500">Local only</td>
                    <td className="p-2.5 text-rose-500 font-bold">✘ Very High (Freezers)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Price Point</td>
                    <td className="p-2.5 bg-rose-50/30 font-bold text-slate-800">₹15 – Affordable</td>
                    <td className="p-2.5 text-slate-600">₹10 – Cheap</td>
                    <td className="p-2.5 text-slate-600">₹40 - ₹80+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Student Campaign Studio */}
        {activeTab === 'campaign' && (
          <div className="flex flex-col gap-3 animate-fade-in text-xs sm:text-sm">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Design Your Skippi Summer Campaign (POA Section 6)
              </h3>
              <p className="text-slate-500 text-xs">
                Create a marketing campaign to drive customer loyalty and off-season repeat purchases.
              </p>
            </div>

            {!campaignLaunched ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* 1. Slogan */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Campaign Slogan / Hook:</label>
                  <select
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 font-bold"
                  >
                    <option value="Dive into Delight">"Dive into Delight" (Authentic Skippi Summer Ad)</option>
                    <option value="Freeze the Fun, Not the Quality">"Freeze the Fun, Not the Quality"</option>
                    <option value="100% Pure RO Ice, 0% Guilt">"100% Pure RO Ice, 0% Guilt"</option>
                  </select>
                </div>

                {/* 2. Platform */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Promotional Platform:</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 font-bold"
                  >
                    <option value="Freezer Bikes at School Summer Camps">Skippi Freezer Bikes at Sports & School Camps</option>
                    <option value="Blinkit & Zepto Quick Commerce Bundles">Quick-Commerce 10-Minute Summer Bundles</option>
                    <option value="Instagram Viral Reel Challenge">Instagram Influencer Nostalgia Challenge</option>
                  </select>
                </div>

                <button
                  onClick={handleLaunchCampaign}
                  className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold py-3 rounded-xl shadow-lg active:scale-98 transition flex items-center justify-center gap-2 text-xs sm:text-sm mt-2"
                >
                  <Rocket className="w-4 h-4 text-amber-200" />
                  <span>Launch Campaign & Earn +75 XP</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Campaign Live Across India!</span>
                </div>
                <p className="text-slate-700 text-xs font-medium">
                  Your campaign <strong>"{tagline}"</strong> is now running via <strong>{platform}</strong>! It reinforced customer repeat purchase behavior and awarded you <strong>+75 XP</strong>!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

