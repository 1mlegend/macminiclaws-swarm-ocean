import { useState } from 'react';
import { useSubmitJob, useBackendStatus } from '@/hooks/useNetworkData';
import { useWallet } from '@/hooks/useWallet';
import { X, Zap, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const JOB_TYPES = [
  { label: 'AI Inference', compute: 100, icon: '🧠' },
  { label: 'Rendering', compute: 200, icon: '🎨' },
  { label: 'Batch Compute', compute: 150, icon: '⚡' },
  { label: 'Agent Task', compute: 50, icon: '🤖' },
] as const;

interface JobSubmitPanelProps {
  onClose: () => void;
}

export function JobSubmitPanel({ onClose }: JobSubmitPanelProps) {
  const [selectedType, setSelectedType] = useState(0);
  const [customCompute, setCustomCompute] = useState('');
  const { data: backendOnline } = useBackendStatus();
  const { shortAddress } = useWallet();
  const submitJob = useSubmitJob();

  const compute = customCompute
    ? parseInt(customCompute)
    : JOB_TYPES[selectedType].compute;

  const handleSubmit = async () => {
    if (!compute || compute <= 0) {
      toast.error('Invalid compute value');
      return;
    }

    if (!backendOnline) {
      // Simulate job submission for demo
      toast.success(`Job simulated: ${JOB_TYPES[selectedType].label} (${compute} compute)`);
      onClose();
      return;
    }

    try {
      await submitJob.mutateAsync(compute);
      toast.success(`Job submitted! ${compute} compute requested`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit job');
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="w-[420px] bg-card/95 backdrop-blur-md border-2 border-primary/40 rounded-lg p-6 glow-box animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            <h2 className="font-pixel text-[9px] text-primary glow-red tracking-wider">
              SUBMIT COMPUTE JOB
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Job type selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {JOB_TYPES.map((type, i) => (
            <button
              key={type.label}
              onClick={() => { setSelectedType(i); setCustomCompute(''); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md border text-left transition-all text-xs font-mono ${
                selectedType === i && !customCompute
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30'
              }`}
            >
              <span className="text-base">{type.icon}</span>
              <div>
                <p className="text-xs">{type.label}</p>
                <p className="text-[10px] text-muted-foreground">{type.compute} compute</p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom compute */}
        <div className="mb-4">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
            Custom Compute (optional)
          </label>
          <input
            type="number"
            value={customCompute}
            onChange={(e) => setCustomCompute(e.target.value)}
            placeholder="Enter compute units..."
            className="w-full px-3 py-2 rounded-md border border-border/50 bg-muted/30 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md bg-muted/20 border border-border/30">
          {backendOnline ? (
            <>
              <CheckCircle size={12} className="text-green-400" />
              <span className="text-[10px] text-muted-foreground">Backend connected — job will be processed</span>
            </>
          ) : (
            <>
              <AlertCircle size={12} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Demo mode — job will be simulated</span>
            </>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitJob.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-xs hover:bg-primary/90 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
        >
          {submitJob.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Zap size={14} />
          )}
          {submitJob.isPending ? 'Submitting...' : `Submit Job — ${compute} compute`}
        </button>

        {shortAddress && (
          <p className="text-[9px] text-muted-foreground text-center mt-2 font-mono">
            Wallet: {shortAddress}
          </p>
        )}
      </div>
    </div>
  );
}
