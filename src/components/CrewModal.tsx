import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import type { AvatarId, DifficultyLevel, Player } from '../types/game';
import { AVATAR_OPTIONS } from '../data/avatars';
import { AnimalAvatar } from './art/AnimalAvatar';

interface CrewModalProps {
  player: Player | null; // null = creating new player
  canDelete: boolean;
  onSave: (data: { name: string; avatar: AvatarId; defaultLevel: DifficultyLevel }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const LEVELS: { id: DifficultyLevel; title: string; desc: string }[] = [
  {
    id: 'scout',
    title: 'Scout',
    desc: 'Starter — animals, continents & playful visual clues',
  },
  {
    id: 'navigator',
    title: 'Navigator',
    desc: 'Medium — landmarks, origins, seasons & big world wonders',
  },
  {
    id: 'trailblazer',
    title: 'Trailblazer',
    desc: 'Stretch — rivers, ancient history & explorer challenges',
  },
];

export function CrewModal({
  player,
  canDelete,
  onSave,
  onDelete,
  onClose,
}: CrewModalProps) {
  const [name, setName] = useState(player?.name ?? '');
  const [avatar, setAvatar] = useState<AvatarId>(player?.avatar ?? 'fox');
  const [defaultLevel, setDefaultLevel] = useState<DifficultyLevel>(
    player?.defaultLevel ?? 'scout'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || 'Explorer',
      avatar,
      defaultLevel,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={player ? 'Edit Crew Member' : 'Add Crew Member'}
      >
        <div className="section-header" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: '1.45rem' }}>
            {player ? 'Edit Explorer Profile' : 'Add Family Explorer'}
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              htmlFor="explorer-name-input"
              style={{ display: 'block', fontWeight: 800, marginBottom: 6 }}
            >
              Explorer Name
            </label>
            <input
              id="explorer-name-input"
              className="input-field"
              type="text"
              maxLength={22}
              placeholder="e.g., Maya, Leo, Mom, Dad..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Choose Animal Companion</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              {AVATAR_OPTIONS.map((opt) => {
                const selected = avatar === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatar(opt.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 5,
                      padding: '10px 6px',
                      borderRadius: 14,
                      background: selected ? 'var(--mariner-soft)' : 'var(--parchment-bright)',
                      border: selected
                        ? '2.5px solid var(--mariner)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                    }}
                  >
                    <AnimalAvatar avatar={opt.id} size={46} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              Default Opt-In Comfort Level
              <span style={{ fontWeight: 600, color: 'var(--ink-muted)', marginLeft: 6, fontSize: '0.86rem' }}>
                (can change on any turn!)
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LEVELS.map((lvl) => {
                const active = defaultLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDefaultLevel(lvl.id)}
                    style={{
                      textAlign: 'left',
                      padding: '11px 14px',
                      borderRadius: 14,
                      border: active
                        ? '2.5px solid var(--mariner)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                      background: active ? 'var(--parchment-bright)' : 'rgba(253,249,240,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <div>
                      <span className={`level-pill ${lvl.id}`}>{lvl.title}</span>
                      <div style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>
                        {lvl.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 4,
            }}
          >
            {player && canDelete && onDelete ? (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--terracotta-dark)' }}
                onClick={onDelete}
              >
                <Trash2 size={16} /> Remove
              </button>
            ) : (
              <span />
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Explorer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
