import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { AVATAR_OPTIONS } from '../data/avatars';
import type { AvatarId, DifficultyLevel, Player } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface CrewModalProps {
  player: Player | null;
  canDelete: boolean;
  onSave: (data: { name: string; avatar: AvatarId; defaultLevel: DifficultyLevel }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const LEVELS: { id: DifficultyLevel; title: string; desc: string }[] = [
  {
    id: 'explorer',
    title: 'Explorer (Ages 6–8)',
    desc: 'Continents, oceans, wildlife, landmarks, foods & greetings — 4 real choices, no giveaways!',
  },
  {
    id: 'navigator',
    title: 'Navigator (Ages 8–11)',
    desc: 'Capitals, currencies, flags, landforms, waterways & real historical milestones.',
  },
  {
    id: 'cartographer',
    title: 'Cartographer (Teens+)',
    desc: 'Regional capitals, ISO currencies, vexillology flags, borders & deeper world history.',
  },
  {
    id: 'scholar',
    title: 'Master Scholar (Tough Adult Mode)',
    desc: 'Hard geopolitics, neighbor-only distractors, obscure capitals, currencies & ancient history!',
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
    player?.defaultLevel ?? 'explorer'
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
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.45rem' }}>
            {player ? 'Edit Explorer Profile' : 'Add Family Explorer'}
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                gap: 8,
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
                      padding: '8px 6px',
                      borderRadius: 14,
                      background: selected ? 'var(--mariner-soft)' : 'var(--parchment-bright)',
                      border: selected
                        ? '2.5px solid var(--mariner)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                      fontWeight: 800,
                      fontSize: '0.76rem',
                    }}
                  >
                    <AnimalAvatar avatar={opt.id} size={42} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              Default Opt-In Skill Tier
              <span style={{ fontWeight: 600, color: 'var(--ink-muted)', marginLeft: 6, fontSize: '0.84rem' }}>
                (switch anytime on any turn!)
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {LEVELS.map((lvl) => {
                const active = defaultLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDefaultLevel(lvl.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 13px',
                      borderRadius: 14,
                      border: active
                        ? '2.5px solid var(--mariner)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                      background: active ? 'var(--parchment-bright)' : 'rgba(253,249,240,0.6)',
                    }}
                  >
                    <span className={`level-pill ${lvl.id}`}>{lvl.title}</span>
                    <div style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>
                      {lvl.desc}
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
