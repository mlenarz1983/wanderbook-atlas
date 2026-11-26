import { Clock, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import type { Destination } from '../types/game';
import { PostcardScene } from './art/PostcardScene';
import { SouvenirArt } from './art/SouvenirArt';

interface TimeFlipPostcardProps {
  destination: Destination;
  flipped: boolean;
  onToggleFlip: () => void;
  onReadAloud?: (text: string) => void;
  isNewDiscovery?: boolean;
  large?: boolean;
}

export function TimeFlipPostcard({
  destination,
  flipped,
  onToggleFlip,
  onReadAloud,
  isNewDiscovery = false,
  large = false,
}: TimeFlipPostcardProps) {
  const { postcard } = destination;

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
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
                    {isNewDiscovery ? '★ NEW PASSPORT STAMP' : 'AIRMAIL POSTCARD'} • {destination.continent}
                  </div>
                  <h3 style={{ fontSize: large ? '1.65rem' : '1.26rem', marginTop: 2 }}>
                    {destination.name}
                  </h3>
                </div>
                {onReadAloud && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      onReadAloud(
                        `${destination.name}, ${destination.country}. ${postcard.headline} ${postcard.todayFact}`
                      )
                    }
                    title="Read postcard aloud"
                    aria-label="Read postcard aloud"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>

              <PostcardScene destination={destination} />

              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: large ? '1.22rem' : '1.05rem',
                    color: 'var(--mariner-dark)',
                    marginBottom: 4,
                  }}
                >
                  {postcard.headline}
                </div>
                <p
                  style={{
                    fontSize: large ? '1.05rem' : '0.92rem',
                    lineHeight: 1.5,
                    color: 'var(--ink-soft)',
                    fontWeight: 600,
                  }}
                >
                  {postcard.todayFact}
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
                    <div style={{ fontWeight: 800, fontSize: large ? '1.05rem' : '0.95rem' }}>
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

        {/* BACK FACE — TIME-FLIP HISTORY STORY */}
        <div className="postcard-face postcard-back">
          <div className="airmail-frame" style={{ height: '100%' }}>
            <div
              className="airmail-inner"
              style={{
                padding: large ? 26 : 18,
                background:
                  'linear-gradient(180deg, #FBF2DE 0%, #F2E2BE 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
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
                    <Sparkles size={14} /> TIME-FLIP POSTCARD • {postcard.timeEra}
                  </div>
                  <h3 style={{ fontSize: large ? '1.75rem' : '1.35rem', marginTop: 4 }}>
                    {postcard.historyTitle}
                  </h3>
                </div>
                <div className="ink-stamp-circle" style={{ flexShrink: 0 }}>
                  <span>{destination.country.slice(0, 10)}</span>
                  <span style={{ fontSize: '0.58rem', marginTop: 2 }}>{postcard.timeEra}</span>
                </div>
              </div>

              {/* Vintage Postcard Ruled Writing Area */}
              <div
                style={{
                  background: 'rgba(253, 249, 240, 0.78)',
                  border: '1.5px dashed rgba(43, 35, 29, 0.25)',
                  borderRadius: 14,
                  padding: large ? '20px 22px' : '14px 16px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <p
                  style={{
                    fontSize: large ? '1.22rem' : '1.02rem',
                    lineHeight: 1.6,
                    color: 'var(--ink)',
                    fontWeight: 700,
                  }}
                >
                  “{postcard.historyFact}”
                </p>
                <div
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--ink-soft)',
                    fontFamily: 'var(--font-stamp)',
                  }}
                >
                  — From the Wanderbook Time-Travel Archive ({destination.name})
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                {onReadAloud ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      onReadAloud(
                        `${postcard.timeEra}. ${postcard.historyTitle}. ${postcard.historyFact}`
                      )
                    }
                  >
                    <Volume2 size={16} /> Read Story Aloud
                  </button>
                ) : (
                  <span />
                )}

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
