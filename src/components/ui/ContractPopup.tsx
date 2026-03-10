import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const CONTRACT = '0x7b86bd98011b9e42708aeca08a433d0003659b07';

interface ContractPopupProps {
  onClose: () => void;
}

export function ContractPopup({ onClose }: ContractPopupProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto bg-[#1a1008] border border-[#ff6622]/30 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
        style={{ boxShadow: '0 0 40px rgba(255,102,34,0.2)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#ff8844]">🦀 $MMC Contract</h2>
          <button
            onClick={onClose}
            className="text-[#ff8844]/60 hover:text-[#ff8844] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div
          onClick={handleCopy}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0e0e0e] border border-[#ff6622]/20 hover:border-[#ff6622]/50 cursor-pointer transition-all"
        >
          <code className="text-[#cca070] text-sm break-all flex-1 select-all">{CONTRACT}</code>
          {copied ? (
            <Check size={18} className="text-green-400 shrink-0" />
          ) : (
            <Copy size={18} className="text-[#ff8844]/60 shrink-0" />
          )}
        </div>
        <p className="text-[#cca070]/60 text-xs mt-3 text-center">
          {copied ? 'Copié !' : 'Clique pour copier'}
        </p>
      </div>
    </div>
  );
}
