import { useState } from 'react';
import { Compass, ShieldCheck, X } from 'lucide-react';
import type { CaseKind, Player } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface NewMissionModalProps {
  players: Player[];
  onCreate: (params: {
    title?: string;
    kind: CaseKind | 'random';
    stopsCount: number;
    playerIds: string[];
  }) => void;
  onClose: () => void;
}

const CASE_TYPES: { id: CaseKind | 'random'; title: string; desc: string }[] = [
  {
    id: 'random',
    title: 'Rotating Mystery Case (Surprise!)',
    desc: 'Draws a fresh random story—either a Stolen Wonder Chase, Lost Explorer, or Rare Wildlife Trail!',
  },
  {
    id: 'wonder-chase',
    title: 'Stolen World Wonder Chase',
    desc: 'Classic Carmen Sandiego! Track a mischievous thief, gather clues in town, and issue a Warrant.',
  },
  {
    id: 'lost-explorer',
    title: 'Lost Explorer Rescue',
    desc: 'Follow field notes across harbors, markets & archives to locate a stranded Wanderbook explorer.',
  },
  {
    id: 'wildlife-trail',
    title: 'Rare Wildlife Migration',
    desc: 'Track a legendary migrating creature across continents before the seasonal window closes!',
  },
];

const LENGTH_OPTIONS: { label: string; stops: number; sub: string }[] = [
  { label: 'Quick Case', stops: 4, sub: '4 Cities • 9 Days' },
  { label: 'Classic Case', stops: 5, sub: '5 Cities • 12 Days' },
  { label: 'Epic Chase', stops: 7, sub: '7 Cities • 17 Days' },
];

export function NewMissionModal({ players, onCreate, onClose }: NewMissionModalProps) {
  const [kind, setKind] = useState<CaseKind | 'random'>('random');
  const [customTitle, setCustomTitle] = useState('');
  const [stopsCount, setStopsCount] = useState<number>(5);
  const [selectedIds, setSelectedIds] = useState<string[]>(players.map((p) => p.id));

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
      kind,
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
            <ShieldCheck size={24} color="var(--terracotta)" /> Open a New Mystery Case
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>1. Choose Case Style</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {CASE_TYPES.map((t) => {
                const active = kind === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setKind(t.id)}
                    style={{
                      textAlign: 'left',
                      padding: '11px 13px',
                      borderRadius: 14,
                      background: active ? 'var(--mariner-soft)' : 'var(--parchment-bright)',
                      border: active
                        ? '2.5px solid var(--mariner)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.98rem' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.35 }}>
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>2. Trail Length & Travel Clock</div>
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

          <div>
            <label htmlFor="mission-title-input" style={{ display: 'block', fontWeight: 800, marginBottom: 6 }}>
              3. Custom Save Name <span style={{ fontWeight: 600, color: 'var(--ink-muted)' }}>(optional — leave blank for auto-title)</span>
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
