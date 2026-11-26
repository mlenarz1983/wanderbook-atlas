import { useState } from 'react';
import { Tv, X } from 'lucide-react';
import { normalizeRoomCode } from '../utils/tvSync';

interface TvConnectModalProps {
  initialCode?: string;
  isConnecting: boolean;
  errorMsg: string | null;
  onConnect: (code: string) => void;
  onClose: () => void;
}

export function TvConnectModal({
  initialCode = '',
  isConnecting,
  errorMsg,
  onConnect,
  onClose,
}: TvConnectModalProps) {
  const [code, setCode] = useState(normalizeRoomCode(initialCode));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      onConnect(code);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card"
        style={{ width: 'min(480px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Connect Tablet to TV"
      >
        <div className="section-header" style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Tv size={22} color="var(--mariner)" /> Connect to Your TV
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 18 }}>
          Open <strong>TV Big Screen</strong> mode on your TV, then enter the 4-letter code shown on
          screen. This tablet keeps your family’s saved Passport and becomes the pass-around
          controller!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            className="input-field"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            maxLength={4}
            placeholder="KITE"
            value={code}
            onChange={(e) => setCode(normalizeRoomCode(e.target.value))}
            autoFocus
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-stamp)',
              fontSize: '2rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
            }}
          />

          {errorMsg && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 12,
                background: 'var(--terracotta-soft)',
                color: 'var(--terracotta-dark)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={code.length !== 4 || isConnecting}
            >
              {isConnecting ? 'Linking to TV...' : 'Link Tablet to TV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
