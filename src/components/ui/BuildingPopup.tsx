import { X } from 'lucide-react';

interface BuildingPopupProps {
  onClose: () => void;
}

export function BuildingPopup({ onClose }: BuildingPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto bg-card border border-primary/30 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4"
        style={{ boxShadow: '0 0 40px hsla(210,90%,55%,0.2)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">🐙 Octaw HQ</h2>
          <button
            onClick={onClose}
            className="text-primary/60 hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-muted-foreground text-sm mb-5">Follow us & join the swarm!</p>
        <div className="flex flex-col gap-3">
          <a
            href="https://x.com/OctawOnSolana"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all text-foreground font-medium text-sm"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @OctawOnSolana
          </a>
        </div>
      </div>
    </div>
  );
}