import { useState } from 'react';
import { Award, BookOpen, Clock, Lock, Search, X } from 'lucide-react';
import { CONTINENT_ORDER, DESTINATIONS, DESTINATIONS_BY_ID } from '../data/destinations';
import type { ContinentName } from '../types/game';
import { PostcardScene } from './art/PostcardScene';
import { SouvenirArt } from './art/SouvenirArt';
import { TimeFlipPostcard } from './TimeFlipPostcard';

interface PassportViewProps {
  discoveredDestIds: string[];
  flippedHistoryIds: string[];
  onFlipHistory: (destId: string) => void;
  onReadAloud: (text: string) => void;
  onHighlightDest?: (destId: string | null) => void;
  onClose: () => void;
}

export function PassportView({
  discoveredDestIds,
  flippedHistoryIds,
  onFlipHistory,
  onReadAloud,
  onHighlightDest,
  onClose,
}: PassportViewProps) {
  const [tab, setTab] = useState<'postcards' | 'souvenirs'>('postcards');
  const [selectedContinent, setSelectedContinent] = useState<'All' | ContinentName>('All');
  const [search, setSearch] = useState('');
  const [inspectId, setInspectId] = useState<string | null>(null);
  const [inspectFlipped, setInspectFlipped] = useState(false);

  const discoveredSet = new Set(discoveredDestIds);
  const flippedSet = new Set(flippedHistoryIds);

  const q = search.trim().toLowerCase();
  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (selectedContinent !== 'All' && d.continent !== selectedContinent) return false;
    if (!q) return true;
    return `${d.name} ${d.country} ${d.subregion} ${d.souvenirName}`
      .toLowerCase()
      .includes(q);
  }).sort((a, b) => Number(discoveredSet.has(b.id)) - Number(discoveredSet.has(a.id)));

  const inspectDest = inspectId ? DESTINATIONS_BY_ID[inspectId] : null;

  const openInspect = (id: string) => {
    setInspectId(id);
    setInspectFlipped(false);
    onHighlightDest?.(id);
  };

  const closeInspect = () => {
    setInspectId(null);
    setInspectFlipped(false);
    onHighlightDest?.(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card-wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Family Passport and Souvenir Cabinet"
      >
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
              MASTER FAMILY COLLECTION • {DESTINATIONS.length} WORLD STOPS
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: 2 }}>
              Wanderbook Passport & Souvenirs
            </h2>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} /> Close
          </button>
        </div>

        {/* Progress Bar & Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
            marginBottom: 14,
            padding: '12px 16px',
            borderRadius: 16,
            background: 'var(--parchment-deep)',
            border: '1.5px solid rgba(43,35,29,0.16)',
          }}
        >
          <div style={{ flex: '1 1 240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.92rem', marginBottom: 6 }}>
              <span>{discoveredDestIds.length} of {DESTINATIONS.length} World Postcards Stamped</span>
              <span style={{ color: 'var(--ochre-dark)' }}>
                {flippedHistoryIds.length} Time-Flips Read
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(discoveredDestIds.length / DESTINATIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className={`btn btn-sm ${tab === 'postcards' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('postcards')}
            >
              <BookOpen size={16} /> Postcards ({discoveredDestIds.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tab === 'souvenirs' ? 'btn-ochre' : 'btn-secondary'}`}
              onClick={() => setTab('souvenirs')}
            >
              <Award size={16} /> Souvenir Shelf ({discoveredDestIds.length})
            </button>
          </div>
        </div>

        {/* Search + Continent Filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: '1 1 210px' }}>
            <Search
              size={16}
              color="var(--ink-muted)"
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              className="input-field"
              type="search"
              placeholder="Filter 100 destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 12px 8px 34px', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['All', ...CONTINENT_ORDER] as const).map((cont) => {
              const active = selectedContinent === cont;
              return (
                <button
                  key={cont}
                  type="button"
                  onClick={() => setSelectedContinent(cont)}
                  style={{
                    padding: '6px 11px',
                    borderRadius: 999,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    background: active ? 'var(--mariner)' : 'var(--parchment-bright)',
                    color: active ? '#FDF9F0' : 'var(--ink-soft)',
                    border: active ? '1.5px solid var(--mariner-dark)' : '1.5px solid rgba(43,35,29,0.18)',
                  }}
                >
                  {cont}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Postcards */}
        {tab === 'postcards' && (
          <div className="passport-grid">
            {filteredDestinations.map((dest) => {
              const unlocked = discoveredSet.has(dest.id);
              const readHistory = flippedSet.has(dest.id);
              return (
                <button
                  key={dest.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && openInspect(dest.id)}
                  className={`passport-tile ${unlocked ? 'unlocked' : 'locked'}`}
                >
                  {unlocked ? (
                    <div style={{ padding: 8 }}>
                      <PostcardScene destination={dest} compact />
                    </div>
                  ) : (
                    <div
                      style={{
                        aspectRatio: '16 / 10',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        color: 'var(--ink-muted)',
                        background: 'rgba(43,35,29,0.04)',
                        margin: 8,
                        borderRadius: 10,
                        border: '1.5px dashed rgba(43,35,29,0.2)',
                      }}
                    >
                      <Lock size={22} />
                      <span className="stamp-label" style={{ fontSize: '0.68rem' }}>
                        UNDISCOVERED
                      </span>
                    </div>
                  )}

                  <div style={{ padding: '4px 12px 12px' }}>
                    <div className="stamp-label" style={{ color: 'var(--ink-muted)', fontSize: '0.68rem' }}>
                      {dest.continent}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', marginTop: 2 }}>
                      {unlocked ? dest.name : `Mystery Stop in ${dest.country}`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                        {unlocked ? dest.country : 'Fly here to stamp!'}
                      </span>
                      {unlocked && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: readHistory ? 'var(--sage-dark)' : 'var(--ochre-dark)',
                          }}
                        >
                          <Clock size={12} /> {readHistory ? 'Time-Flipped' : 'Tap to flip'}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Souvenir Cabinet */}
        {tab === 'souvenirs' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
              gap: 14,
            }}
          >
            {filteredDestinations.map((dest) => {
              const unlocked = discoveredSet.has(dest.id);
              return (
                <button
                  key={dest.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && openInspect(dest.id)}
                  className="paper-card"
                  style={{
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 8,
                    opacity: unlocked ? 1 : 0.55,
                    borderStyle: unlocked ? 'solid' : 'dashed',
                  }}
                >
                  {unlocked ? (
                    <SouvenirArt id={dest.souvenirId} size={64} />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        border: '2px dashed rgba(43,35,29,0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      <Lock size={22} />
                    </div>
                  )}
                  <div style={{ fontWeight: 800, fontSize: '0.96rem', lineHeight: 1.2 }}>
                    {unlocked ? dest.souvenirName : 'Hidden Souvenir'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                    {dest.country} • {dest.souvenirCategory === 'artifact' ? 'History Artifact' : 'Nature Keepsake'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Focused Postcard Inspector Modal */}
      {inspectDest && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 130 }}
          onClick={(e) => {
            e.stopPropagation();
            closeInspect();
          }}
        >
          <div
            style={{ width: 'min(540px, 100%)', display: 'flex', flexDirection: 'column', gap: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <TimeFlipPostcard
              destination={inspectDest}
              flipped={inspectFlipped}
              onToggleFlip={() => {
                setInspectFlipped((f) => {
                  const next = !f;
                  if (next) onFlipHistory(inspectDest.id);
                  return next;
                });
              }}
              onReadAloud={onReadAloud}
            />
            <button type="button" className="btn btn-secondary" onClick={closeInspect}>
              Back to Passport
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
