import { useRef, useState } from 'react';
import { Download, Tv, Upload, X } from 'lucide-react';
import type { SavedAtlasState } from '../types/game';
import { validateImportedState } from '../utils/storage';

interface SettingsModalProps {
  state: SavedAtlasState;
  onImportState: (next: SavedAtlasState) => void;
  onClose: () => void;
}

export function SettingsModal({
  state,
  onImportState,
  onClose,
}: SettingsModalProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wanderbook-atlas-family-save.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const validated = validateImportedState(text);
      if (validated) {
        onImportState(validated);
        setImportMsg('Family Passport & Expeditions restored!');
      } else {
        setImportMsg('That file did not look like a Wanderbook Atlas save.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Atlas Save and TV Setup"
      >
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.45rem' }}>Family Save & TV Setup</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Family Save Info & Backup */}
          <div className="paper-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 800, fontSize: '1.02rem' }}>
              Family Save File (Stored on This Tablet)
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              Your explorers, active missions, and all {state.discoveredDestIds.length} collected
              postcards save automatically on this device—and automatically sync to your TV whenever
              you link up. You can also export a backup file to move your Passport to another device.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
                <Download size={16} /> Export Family Save
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={16} /> Restore Save File
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {importMsg && (
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--mariner)' }}>
                {importMsg}
              </div>
            )}
          </div>

          {/* Google TV + Android Tablet Quick Guide */}
          <div className="paper-card" style={{ padding: 16, background: 'var(--mariner-soft)' }}>
            <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <Tv size={18} color="var(--mariner)" /> Google TV Streamer + Android Tablet Tips
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <strong>Two easy ways to play on TV:</strong>
              <br />
              1. <strong>TV + Tablet Living Room Mode:</strong> Open this URL in a Google TV browser
              app (like <em>BrowseHere</em> or <em>TV Bro</em>) and open <em>TV Big Screen</em>.
              Pair in either direction—enter the TV’s 4-letter code on your tablet, or display a
              Tablet Code and type it right into your TV!
              <br />
              2. <strong>Instant Cast:</strong> Swipe down on your Android tablet, tap{' '}
              <em>Cast Screen</em> to your Google TV Streamer, and play in Single-Screen mode!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
