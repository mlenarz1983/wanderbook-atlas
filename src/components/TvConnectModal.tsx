import { useState } from 'react';
import { RefreshCw, Smartphone, Tv, X } from 'lucide-react';
import { normalizeRoomCode } from '../utils/tvSync';

interface TvConnectModalProps {
  initialCode?: string;
  isConnecting: boolean;
  tabletHostCode: string | null;
  errorMsg: string | null;
  onConnectToTvCode: (code: string) => void;
  onStartTabletHost: () => void;
  onRefreshTabletHost: () => void;
  onStopTabletHost: () => void;
  onClose: () => void;
}

export function TvConnectModal({
  initialCode = '',
  isConnecting,
  tabletHostCode,
  errorMsg,
  onConnectToTvCode,
  onStartTabletHost,
  onRefreshTabletHost,
  onStopTabletHost,
  onClose,
}: TvConnectModalProps) {
  const [mode, setMode] = useState<'enter-tv' | 'show-tablet'>(
    tabletHostCode && !initialCode ? 'show-tablet' : 'enter-tv'
  );
  const [code, setCode] = useState(normalizeRoomCode(initialCode));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      onConnectToTvCode(code);
    }
  };

  const handleSwitchMode = (next: 'enter-tv' | 'show-tablet') => {
    setMode(next);
    if (next === 'show-tablet' && !tabletHostCode) {
      onStartTabletHost();
    } else if (next === 'enter-tv' && tabletHostCode) {
      onStopTabletHost();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card"
        style={{ width: 'min(520px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Connect Tablet to TV"
      >
        <div className="section-header" style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.38rem', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Tv size={22} color="var(--mariner)" /> Two-Way TV & Tablet Link
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Two-Way Mode Switcher */}
        <div className="pairing-mode-tabs" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className={`pairing-mode-tab ${mode === 'enter-tv' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('enter-tv')}
          >
            <Tv size={15} /> Enter TV’s Code
          </button>
          <button
            type="button"
            className={`pairing-mode-tab ${mode === 'show-tablet' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('show-tablet')}
          >
            <Smartphone size={15} /> Show My Tablet Code
          </button>
        </div>

        {mode === 'enter-tv' ? (
          <>
            <p
              style={{
                color: 'var(--ink-soft)',
                fontSize: '0.94rem',
                lineHeight: 1.5,
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              Already opened <strong>TV Big Screen</strong> on your TV? Type the 4-letter code
              shown on your TV screen below:
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
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
            <p
              style={{
                color: 'var(--ink-soft)',
                fontSize: '0.94rem',
                lineHeight: 1.5,
                fontWeight: 600,
                textAlign: 'left',
              }}
            >
              Setting up on your tablet first? Keep this code open and type it into the{' '}
              <strong>“Have a Tablet Code?”</strong> box on your TV’s Big Screen—your tablet will
              connect automatically!
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: '14px 10px',
                background: 'var(--parchment)',
                borderRadius: 16,
                border: '1.5px solid rgba(43,35,29,0.18)',
              }}
            >
              <div className="stamp-label" style={{ color: 'var(--mariner)' }}>
                YOUR TABLET’S PAIRING CODE
              </div>
              <div className="tv-code-digits" style={{ fontSize: '2.5rem', padding: '8px 22px 8px 28px' }}>
                {tabletHostCode ?? '....'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--sage-dark)' }}>
                  Listening for TV to connect...
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={onRefreshTabletHost}
                >
                  <RefreshCw size={14} /> New Code
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'var(--terracotta-soft)',
                  color: 'var(--terracotta-dark)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textAlign: 'left',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Keep Waiting in Background
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
