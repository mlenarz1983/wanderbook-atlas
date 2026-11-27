import { useState } from 'react';
import { CheckCircle2, FileText, ShieldCheck, X } from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import { DESTINATIONS_BY_ID } from '../data/destinations';
import type { CaseMission, SuspectProfile } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';
import { ClueGlyph } from './art/ClueGlyph';

interface CaseNotebookModalProps {
  mission: CaseMission;
  onSelectWarrant: (suspectId: string) => void;
  onClose: () => void;
}

export function CaseNotebookModal({
  mission,
  onSelectWarrant,
  onClose,
}: CaseNotebookModalProps) {
  const [tab, setTab] = useState<'clues' | 'warrant'>('clues');

  const suspects: SuspectProfile[] = mission.suspectIds
    .map((id) => SUSPECTS_BY_ID[id])
    .filter(Boolean);

  const discoveredTraitEntries = Object.entries(mission.discoveredSuspectTraits) as Array<
    ['accessory' | 'favoriteTreat' | 'companion' | 'hobby', string]
  >;

  const currentCityClues = mission.cluesLog.filter(
    (c) => c.cityId === mission.lastValidDestId
  );
  const olderClues = mission.cluesLog.filter(
    (c) => c.cityId !== mission.lastValidDestId
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card-wide"
        style={{ width: 'min(860px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Case Notebook and Suspect Dossier"
      >
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="stamp-label" style={{ color: 'var(--terracotta)' }}>
              DETECTIVE DOSSIER • {mission.stolenOrTargetItem.toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: 2 }}>{mission.title}</h2>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} /> Close
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'clues' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('clues')}
          >
            <FileText size={16} /> Witness Clues ({mission.cluesLog.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'warrant' ? 'btn-terracotta' : 'btn-secondary'}`}
            onClick={() => setTab('warrant')}
          >
            <ShieldCheck size={16} /> Suspect Warrant ({discoveredTraitEntries.length}/4 Traits)
          </button>
        </div>

        {/* TAB 1: WITNESS CLUES */}
        {tab === 'clues' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="paper-card" style={{ padding: 14, background: 'var(--parchment)' }}>
              <div className="stamp-label" style={{ color: 'var(--mariner)', marginBottom: 4 }}>
                CASE BRIEFING
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--ink-soft)', fontWeight: 600 }}>
                {mission.briefing}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.12rem', marginBottom: 8 }}>
                Latest Leads from {DESTINATIONS_BY_ID[mission.lastValidDestId]?.name}
              </h3>
              {currentCityClues.length === 0 ? (
                <p style={{ color: 'var(--ink-muted)', fontWeight: 700, fontSize: '0.92rem' }}>
                  No landmarks investigated here yet—visit any of the 5 real spots around town to gather clues!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {currentCityClues.map((entry, idx) => (
                    <div key={`${entry.cityId}-${entry.spotId}-${idx}`} className="paper-card" style={{ padding: 14 }}>
                      <div className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.72rem' }}>
                        {entry.spotTitle} • {entry.witnessName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 6 }}>
                        <ClueGlyph kind={entry.icon ?? 'geography'} size={21} />
                        <p style={{ fontWeight: 800, fontSize: '0.96rem', lineHeight: 1.45, margin: 0 }}>
                          {entry.destinationClue}
                        </p>
                      </div>
                      {entry.eraClue && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: '7px 10px',
                            borderRadius: 10,
                            background: 'var(--mariner-soft)',
                            border: '1px solid rgba(31,90,99,0.35)',
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            color: 'var(--mariner-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <ClueGlyph kind="era" size={18} />
                          <span>{entry.eraClue}</span>
                        </div>
                      )}
                      {entry.suspectClue && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: '7px 10px',
                            borderRadius: 10,
                            background: 'var(--ochre-soft)',
                            border: '1px solid rgba(200,138,43,0.4)',
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            color: 'var(--ochre-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <ClueGlyph kind="suspect" size={18} />
                          <span>{entry.suspectClue}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {olderClues.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--ink-soft)', marginBottom: 8 }}>
                  Earlier Trail Notes ({olderClues.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[...olderClues].reverse().map((entry, idx) => (
                    <div
                      key={`old-${idx}`}
                      className="paper-card"
                      style={{ padding: 12, opacity: 0.85, fontSize: '0.86rem' }}
                    >
                      <div className="stamp-label" style={{ color: 'var(--ink-muted)', fontSize: '0.68rem' }}>
                        {DESTINATIONS_BY_ID[entry.cityId]?.name} • {entry.spotTitle}
                      </div>
                      <p style={{ marginTop: 3, fontWeight: 700 }}>{entry.destinationClue}</p>
                      {entry.suspectClue && (
                        <div style={{ marginTop: 4, color: 'var(--ochre-dark)', fontWeight: 800 }}>
                          ★ {entry.suspectClue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUSPECT WARRANT */}
        {tab === 'warrant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="paper-card" style={{ padding: 14, background: 'var(--ochre-soft)' }}>
              <div className="stamp-label" style={{ color: 'var(--ochre-dark)', marginBottom: 6 }}>
                CONFIRMED PROFILE TRAITS COLLECTED SO FAR
              </div>
              {discoveredTraitEntries.length === 0 ? (
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                  Keep interviewing witnesses across cities—they’ll drop personal clues about accessories,
                  favorite treats, travel companions, and hobbies!
                </p>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {discoveredTraitEntries.map(([k, val]) => (
                    <span
                      key={k}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: '#FDF9F0',
                        border: '1.5px solid var(--ochre)',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                      }}
                    >
                      ✓ {val}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 12,
              }}
            >
              {suspects.map((s) => {
                const isSelected = mission.selectedWarrantSuspectId === s.id;
                const matchingTraits = discoveredTraitEntries.filter(
                  ([key, val]) => s[key] === val
                ).length;
                const eliminated =
                  discoveredTraitEntries.length > 0 &&
                  matchingTraits < discoveredTraitEntries.length;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectWarrant(s.id)}
                    className="paper-card"
                    style={{
                      padding: 14,
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      opacity: eliminated ? 0.52 : 1,
                      border: isSelected
                        ? '2.5px solid var(--terracotta)'
                        : eliminated
                          ? '1.5px dashed rgba(43,35,29,0.22)'
                          : '1.5px solid rgba(43,35,29,0.2)',
                      background: isSelected ? 'var(--terracotta-soft)' : 'var(--parchment-bright)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <AnimalAvatar avatar={s.avatar} size={48} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.08rem' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                          {s.title}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 size={22} color="var(--terracotta)" />}
                    </div>

                    <div style={{ fontSize: '0.82rem', lineHeight: 1.45, color: 'var(--ink)' }}>
                      <div><strong>Wears/Carries:</strong> {s.accessory}</div>
                      <div><strong>Favorite Treat:</strong> {s.favoriteTreat}</div>
                      <div><strong>Companion:</strong> {s.companion}</div>
                      <div><strong>Hobby:</strong> {s.hobby}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                      <span
                        className="stamp-label"
                        style={{
                          fontSize: '0.7rem',
                          color: eliminated
                            ? 'var(--ink-muted)'
                            : discoveredTraitEntries.length > 0
                              ? 'var(--sage-dark)'
                              : 'var(--mariner)',
                        }}
                      >
                        {eliminated
                          ? 'DOES NOT MATCH ALL CLUES'
                          : discoveredTraitEntries.length > 0
                            ? `MATCHES ${matchingTraits}/${discoveredTraitEntries.length} CLUES`
                            : 'POSSIBLE MATCH'}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--terracotta)' }}>
                        {isSelected ? 'Warrant Locked!' : 'Tap to Issue Warrant'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
