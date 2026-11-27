import { Clock, RotateCcw, Sparkles } from 'lucide-react';
import type { Destination } from '../types/game';
import { MiniFlag } from './art/MiniFlag';
import { PostcardScene } from './art/PostcardScene';
import { SouvenirArt } from './art/SouvenirArt';

interface TimeFlipPostcardProps {
  destination: Destination;
  flipped: boolean;
  onToggleFlip: () => void;
  isNewDiscovery?: boolean;
  large?: boolean;
}

export function TimeFlipPostcard({
  destination,
  flipped,
  onToggleFlip,
  isNewDiscovery = false,
  large = false,
}: TimeFlipPostcardProps) {
  const [m0, m1] = destination.history;

  return (
    <div className="postcard-scene-wrap">
      <div className={`postcard-flipper ${flipped ? 'flipped' : ''}`}>
        {/* FRONT FACE — TODAY */}
        <div className="postcard-face">
          <div className="airmail-frame">
            <div className="airmail-inner" style={{ padding: large ? 22 : 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                    {isNewDiscovery ? '★ NEW PASSPORT STAMP' : 'AIRMAIL POSTCARD'} • {destination.subregion}
                  </div>
                  <h3
                    style={{
                      fontSize: large ? '1.65rem' : '1.26rem',
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                    }}
                  >
                    <MiniFlag dest={destination} width={large ? 36 : 30} />
                    <span>{destination.name}</span>
                  </h3>
                </div>
              </div>

              <PostcardScene destination={destination} />

              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: large ? '1.18rem' : '1.02rem',
                    color: 'var(--mariner-dark)',
                    marginBottom: 4,
                  }}
                >
                  {destination.worldWonder}
                </div>
                <p
                  style={{
                    fontSize: large ? '1.02rem' : '0.9rem',
                    lineHeight: 1.48,
                    color: 'var(--ink-soft)',
                    fontWeight: 600,
                  }}
                >
                  {destination.todayFact}
                </p>
              </div>

              {/* Souvenir Earned Strip */}
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 12px',
                  borderRadius: 14,
                  background: 'var(--parchment)',
                  border: '1.5px solid rgba(43,35,29,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SouvenirArt id={destination.souvenirId} size={large ? 52 : 44} />
                  <div>
                    <div className="stamp-label" style={{ color: 'var(--ochre-dark)', fontSize: '0.7rem' }}>
                      SOUVENIR COLLECTED
                    </div>
                    <div style={{ fontWeight: 800, fontSize: large ? '1.02rem' : '0.94rem' }}>
                      {destination.souvenirName}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-ochre btn-sm"
                  onClick={onToggleFlip}
                >
                  <Clock size={16} />
                  Peek Back in Time
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE — TWO REAL HISTORICAL MILESTONES */}
        <div className="postcard-face postcard-back">
          <div className="airmail-frame" style={{ height: '100%' }}>
            <div
              className="airmail-inner"
              style={{
                padding: large ? 24 : 16,
                background: 'linear-gradient(180deg, #FBF2DE 0%, #F2E2BE 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div
                    className="stamp-label"
                    style={{
                      color: 'var(--terracotta)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Sparkles size={14} /> TIME-FLIP ARCHIVE • {destination.country}
                  </div>
                  <h3 style={{ fontSize: large ? '1.55rem' : '1.22rem', marginTop: 3 }}>
                    {m0.title}
                  </h3>
                </div>
                <div className="ink-stamp-circle" style={{ flexShrink: 0, width: 70, height: 70 }}>
                  <span>{destination.country.slice(0, 10)}</span>
                  <span style={{ fontSize: '0.55rem', marginTop: 2 }}>{m0.era}</span>
                </div>
              </div>

              {/* Dual Historical Stories */}
              <div
                style={{
                  background: 'rgba(253, 249, 240, 0.82)',
                  border: '1.5px dashed rgba(43, 35, 29, 0.25)',
                  borderRadius: 14,
                  padding: large ? '16px 18px' : '12px 14px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 10,
                  overflowY: 'auto',
                }}
              >
                <div>
                  <div className="stamp-label" style={{ color: 'var(--mariner)', fontSize: '0.7rem' }}>
                    {m0.era} — {m0.title}
                  </div>
                  <p style={{ fontSize: large ? '1.02rem' : '0.88rem', lineHeight: 1.48, fontWeight: 700, marginTop: 2 }}>
                    {m0.fact}
                  </p>
                </div>

                <div style={{ borderTop: '1px dashed rgba(43,35,29,0.2)', paddingTop: 8 }}>
                  <div className="stamp-label" style={{ color: 'var(--ochre-dark)', fontSize: '0.7rem' }}>
                    {m1.era} — {m1.title}
                  </div>
                  <p style={{ fontSize: large ? '1.02rem' : '0.88rem', lineHeight: 1.48, fontWeight: 700, marginTop: 2 }}>
                    {m1.fact}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onToggleFlip}
                >
                  <RotateCcw size={16} /> Back to Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
