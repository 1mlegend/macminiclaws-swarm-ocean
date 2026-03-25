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
        className="pointer-events-auto bg-card border border-primary/30 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
        style={{ boxShadow: '0 0 40px hsla(210,90%,55%,0.2)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">🐙 $OCTAW Contract</h2>
          <button
            onClick={onClose}
            className="text-primary/60 hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div
          onClick={handleCopy}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-primary/20 hover:border-primary/50 cursor-pointer transition-all"
        >
          <code className="text-muted-foreground text-sm break-all flex-1 select-all">{CONTRACT}</code>
          {copied ? (
            <Check size={18} className="text-green-400 shrink-0" />
          ) : (
            <Copy size={18} className="text-primary/60 shrink-0" />
          )}
        </div>
        <p className="text-muted-foreground/60 text-xs mt-3 text-center">
          {copied ? 'Copié !' : 'Clique pour copier'}
        </p>
      </div>
    </div>
  );
}