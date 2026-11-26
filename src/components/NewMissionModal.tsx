import { useState } from 'react';
import { Compass, X } from 'lucide-react';
import type { MissionTheme, Player } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface NewMissionModalProps {
  players: Player[];
  onCreate: (params: {
    title: string;
    theme: MissionTheme;
    targetStops: number | null;
    playerIds: string[];
    startDestId: string;
  }) => void;
  onClose: () => void;
}

const THEMES: { id: MissionTheme; title: string; desc: string; defaultTitle: string; startId: string }[] = [
  {
    id: 'grand-tour',
    title: 'Grand World Tour',
    desc: 'A joyful mix of cute animals, landmarks, oceans, and stories.',
    defaultTitle: 'Family World Tour',
    startId: 'iceland',
  },
  {
    id: 'animal-safari',
    title: 'Wild Animal Safari',
    desc: 'Follow pandas, sea turtles, penguins, lions, and butterflies!',
    defaultTitle: 'Wild Animal Safari',
    startId: 'tanzania',
  },
  {
    id: 'time-travel',
    title: 'Time-Travel Wonders',
    desc: 'Pyramids, Vikings, ancient chocolate, kites, and star navigators!',
    defaultTitle: 'Time-Travel Wonders',
    startId: 'egypt',
  },
  {
    id: 'open-atlas',
    title: 'Open Atlas Roam',
    desc: 'No finish line—fly anywhere curiosity pulls your crew!',
    defaultTitle: 'Open Atlas Adventure',
    startId: 'grand-canyon',
  },
];

const STOP_OPTIONS: { label: string; value: number | null; sub: string }[] = [
  { label: '5 Stops', value: 5, sub: '~10 min' },
  { label: '8 Stops', value: 8, sub: '~15 min' },
  { label: '12 Stops', value: 12, sub: '~25 min' },
  { label: 'Endless', value: null, sub: 'Free roam' },
];

export function NewMissionModal({ players, onCreate, onClose }: NewMissionModalProps) {
  const [theme, setTheme] = useState<MissionTheme>('grand-tour');
  const [title, setTitle] = useState('Family World Tour');
  const [targetStops, setTargetStops] = useState<number | null>(8);
  const [selectedIds, setSelectedIds] = useState<string[]>(players.map((p) => p.id));

  const handleThemePick = (t: (typeof THEMES)[number]) => {
    setTheme(t.id);
    setTitle(t.defaultTitle);
    if (t.id === 'open-atlas') {
      setTargetStops(null);
    } else if (targetStops === null) {
      setTargetStops(8);
    }
  };

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least 1 explorer
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const themeObj = THEMES.find((t) => t.id === theme) ?? THEMES[0];
    onCreate({
      title: title.trim() || themeObj.defaultTitle,
      theme,
      targetStops,
      playerIds: selectedIds.length > 0 ? selectedIds : [players[0].id],
      startDestId: themeObj.startId,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Start New Expedition"
      >
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Compass size={24} color="var(--terracotta)" /> Start a New Expedition
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Mission Theme */}
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>1. Pick an Adventure Theme</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemePick(t)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: active ? 'var(--mariner-soft)' : 'var(--parchment-bright)',
                      border: active
                        ? '2.5px solid var(--mariner)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.35 }}>
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expedition Title */}
          <div>
            <label htmlFor="mission-title-input" style={{ display: 'block', fontWeight: 800, marginBottom: 6 }}>
              2. Name This Save Slot
            </label>
            <input
              id="mission-title-input"
              className="input-field"
              type="text"
              maxLength={32}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Friday Night World Tour"
            />
          </div>

          {/* Trip Length */}
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>3. Trip Length</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
              {STOP_OPTIONS.map((opt) => {
                const active = targetStops === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setTargetStops(opt.value)}
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
                    <div style={{ fontSize: '0.74rem', opacity: active ? 0.9 : 0.7 }}>{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crew Selection */}
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>4. Who’s Aboard the Balloon?</div>
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
                        {included ? 'Joining' : 'Tap to join'}
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
              Launch Balloon!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
