import { useState } from 'react';
import { Compass, ShieldCheck, X } from 'lucide-react';
import { MISSION_DIFFICULTY_INFO } from '../data/destinations/usStatesMeta';
import type { MissionDifficulty, Player } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface NewMissionModalProps {
  players: Player[];
  onCreate: (params: {
    title?: string;
    missionDifficulty: MissionDifficulty;
    stopsCount: number;
    playerIds: string[];
  }) => void;
  onClose: () => void;
}

const DIFFICULTY_STEPS: MissionDifficulty[] = [
  'usa',
  'iconic-world',
  'full-world',
  'time-warp',
];

const LENGTH_OPTIONS: { label: string; stops: number; sub: string }[] = [
  { label: 'Quick Case', stops: 4, sub: '4 Cities' },
  { label: 'Classic Case', stops: 5, sub: '5 Cities' },
  { label: 'Epic Chase', stops: 7, sub: '7 Cities' },
];

export function NewMissionModal({ players, onCreate, onClose }: NewMissionModalProps) {
  const [difficultyIndex, setDifficultyIndex] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState('');
  const [stopsCount, setStopsCount] = useState<number>(5);
  const [selectedIds, setSelectedIds] = useState<string[]>(players.map((p) => p.id));

  const missionDifficulty = DIFFICULTY_STEPS[difficultyIndex];
  const diffMeta = MISSION_DIFFICULTY_INFO[missionDifficulty];

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title: customTitle.trim() || undefined,
      missionDifficulty,
      stopsCount,
      playerIds: selectedIds.length > 0 ? selectedIds : [players[0].id],
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Open a New Mystery Case"
      >
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 9 }}>
            <ShieldCheck size={24} color="var(--terracotta)" /> Open a New Detective Case
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 1. 4-Level Mission Difficulty Slider (Scope, Locality & Time-Warp!) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontWeight: 800 }}>1. Mission Difficulty & Map Scope</span>
              <span className="stamp-label" style={{ color: 'var(--terracotta)', fontSize: '0.72rem' }}>
                {diffMeta.scopeBadge}
              </span>
            </div>

            <div className="paper-card" style={{ padding: '14px 16px', background: 'var(--parchment)' }}>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={difficultyIndex}
                onChange={(e) => setDifficultyIndex(Number(e.target.value))}
                aria-label="Mission Difficulty Level"
                className="mission-slider"
              />
              <div className="mission-slider-ticks">
                {DIFFICULTY_STEPS.map((stepId, idx) => {
                  const active = idx === difficultyIndex;
                  return (
                    <button
                      key={stepId}
                      type="button"
                      className={`mission-tick-btn ${active ? 'active' : ''}`}
                      onClick={() => setDifficultyIndex(idx)}
                    >
                      {MISSION_DIFFICULTY_INFO[stepId].shortLabel}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: '#FDF9F0',
                  border: '1.5px solid rgba(43,35,29,0.18)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--mariner-dark)' }}>
                  {diffMeta.label}
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.45, marginTop: 3 }}>
                  {diffMeta.description}
                </p>
                <div style={{ fontSize: '0.76rem', color: 'var(--sage-dark)', fontWeight: 800, marginTop: 5 }}>
                  Each player still gets quiz questions matched to their own personal skill level!
                </div>
              </div>
            </div>
          </div>

          {/* 2. Trail Length */}
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>2. Trail Length</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {LENGTH_OPTIONS.map((opt) => {
                const active = stopsCount === opt.stops;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setStopsCount(opt.stops)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 12,
                      background: active ? 'var(--terracotta)' : 'var(--parchment-bright)',
                      color: active ? '#FDF9F0' : 'var(--ink)',
                      border: active
                        ? '2px solid var(--terracotta-dark)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.94rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.75rem', opacity: active ? 0.92 : 0.72 }}>{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Custom Name */}
          <div>
            <label htmlFor="mission-title-input" style={{ display: 'block', fontWeight: 800, marginBottom: 6 }}>
              3. Custom Save Name{' '}
              <span style={{ fontWeight: 600, color: 'var(--ink-muted)' }}>(optional)</span>
            </label>
            <input
              id="mission-title-input"
              className="input-field"
              type="text"
              maxLength={38}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g., Friday Night Detective Crew"
            />
          </div>

          {/* 4. Crew Roster */}
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>4. Who’s On the Case?</div>
            <div className="crew-row">
              {players.map((p) => {
                const included = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlayer(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '8px 13px 8px 8px',
                      borderRadius: 14,
                      background: included ? 'var(--sage-soft)' : 'var(--parchment-deep)',
                      border: included
                        ? '2px solid var(--sage)'
                        : '1.5px dashed rgba(43,35,29,0.25)',
                      opacity: included ? 1 : 0.65,
                    }}
                  >
                    <AnimalAvatar avatar={p.avatar} size={36} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 700 }}>
                        {included ? 'On the team' : 'Tap to join'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-terracotta btn-lg">
              <Compass size={19} /> Launch Case!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
