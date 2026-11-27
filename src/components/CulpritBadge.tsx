import { FileText, Search, ShieldCheck } from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import type { CaseMission } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface CulpritBadgeProps {
  mission: CaseMission;
  compact?: boolean;
  onOpenNotebook?: () => void;
}

function MysterySilhouette({ size = 50 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#2E2623" stroke="#C88A2B" strokeWidth="2.4" />
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="rgba(251, 245, 232, 0.28)"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />

      {/* Detective Cloak & Shoulders */}
      <path
        d="M14 53 C16 41 23 36 32 36 C41 36 48 41 50 53 Z"
        fill="#1A1512"
        stroke="#C88A2B"
        strokeWidth="1.4"
      />
      <path
        d="M21 38 L32 45 L43 38"
        fill="none"
        stroke="#C4533A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Shadow Head & Hat */}
      <circle cx="32" cy="30" r="10.5" fill="#1A1512" />
      <ellipse cx="32" cy="23" rx="18" ry="4.2" fill="#14100E" stroke="#C88A2B" strokeWidth="1.4" />
      <path
        d="M20 22 L23 11 C27 10 37 10 41 11 L44 22 Z"
        fill="#14100E"
        stroke="#C88A2B"
        strokeWidth="1.4"
      />
      <rect x="21.5" y="18.5" width="21" height="3" rx="1" fill="#C4533A" />
      {/* Glowing Curious Eyes */}
      <ellipse cx="27.5" cy="30.5" rx="2.4" ry="1.8" fill="#F6DFB1" />
      <ellipse cx="36.5" cy="30.5" rx="2.4" ry="1.8" fill="#F6DFB1" />
      <circle cx="28" cy="30.5" r="0.9" fill="#2B231D" />
      <circle cx="37" cy="30.5" r="0.9" fill="#2B231D" />
    </svg>
  );
}

export function CulpritBadge({ mission, compact = false, onOpenNotebook }: CulpritBadgeProps) {
  const revealedSuspect =
    mission.status !== 'active'
      ? SUSPECTS_BY_ID[mission.culpritId]
      : mission.selectedWarrantSuspectId
        ? SUSPECTS_BY_ID[mission.selectedWarrantSuspectId]
        : null;

  const traits = Object.entries(mission.discoveredSuspectTraits).filter(
    ([, v]) => Boolean(v)
  ) as Array<['accessory' | 'favoriteTreat' | 'companion' | 'hobby', string]>;

  return (
    <div
      className="culprit-badge"
      onClick={onOpenNotebook}
      role={onOpenNotebook ? 'button' : undefined}
      tabIndex={onOpenNotebook ? 0 : undefined}
      onKeyDown={
        onOpenNotebook
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenNotebook();
              }
            }
          : undefined
      }
      style={{
        cursor: onOpenNotebook ? 'pointer' : 'default',
        padding: compact ? '8px 12px' : '11px 13px',
      }}
    >
      {revealedSuspect ? (
        <AnimalAvatar avatar={revealedSuspect.avatar} size={compact ? 42 : 48} />
      ) : (
        <MysterySilhouette size={compact ? 42 : 48} />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            className="stamp-label"
            style={{
              fontSize: compact ? '0.64rem' : '0.68rem',
              color: revealedSuspect ? 'var(--sage-dark)' : 'var(--terracotta)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {revealedSuspect ? <ShieldCheck size={12} /> : <Search size={12} />}
            {mission.status !== 'active'
              ? 'CULPRIT REVEALED'
              : revealedSuspect
                ? 'WARRANT TARGET LOCKED'
                : 'CHASING CULPRIT'}
          </span>

          {onOpenNotebook && !compact && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--mariner)',
              }}
            >
              <FileText size={12} /> Dossier ({traits.length}/4)
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: compact ? '0.96rem' : '1.04rem',
            lineHeight: 1.2,
            marginTop: 2,
          }}
        >
          {revealedSuspect
            ? `${revealedSuspect.name} — ${revealedSuspect.title}`
            : `Mystery Thief • ${mission.stolenOrTargetItem}`}
        </div>

        {!compact && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {traits.length === 0 ? (
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                Interview local witnesses to uncover suspect traits (0/4 found).
              </span>
            ) : (
              traits.map(([k, val]) => (
                <span key={k} className="culprit-trait-chip">
                  ✓ {val}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
