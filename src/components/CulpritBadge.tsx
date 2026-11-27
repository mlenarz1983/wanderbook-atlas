import { FileText, Search, ShieldCheck } from 'lucide-react';
import { SUSPECTS_BY_ID } from '../data/cases';
import type { CaseKind, CaseMission } from '../types/game';
import { AnimalAvatar } from './art/AnimalAvatar';

interface CulpritBadgeProps {
  mission: CaseMission;
  compact?: boolean;
  onOpenNotebook?: () => void;
}

function MysterySilhouette({ kind, size = 50 }: { kind: CaseKind; size?: number }) {
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
      <circle
        cx="32"
        cy="32"
        r="30"
        fill={
          kind === 'wonder-chase'
            ? '#2E2623'
            : kind === 'lost-explorer'
              ? '#1F4B52'
              : '#2D4B37'
        }
        stroke="#C88A2B"
        strokeWidth="2.4"
      />
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="rgba(251, 245, 232, 0.28)"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />

      {kind === 'wildlife-trail' ? (
        <g>
          {/* Mysterious Winged/Creature Silhouette */}
          <path
            d="M16 42 C18 28 24 22 32 22 C40 22 46 28 48 42 C42 46 22 46 16 42 Z"
            fill="#15281C"
            stroke="#FBF5E8"
            strokeWidth="1.4"
          />
          <path d="M22 25 L18 14 L28 21 Z" fill="#15281C" stroke="#FBF5E8" strokeWidth="1.2" />
          <path d="M42 25 L46 14 L36 21 Z" fill="#15281C" stroke="#FBF5E8" strokeWidth="1.2" />
          <circle cx="26" cy="31" r="2.6" fill="#F2C45A" />
          <circle cx="38" cy="31" r="2.6" fill="#F2C45A" />
          <text
            x="32"
            y="45"
            textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="800"
            fontSize="11"
            fill="#F6DFB1"
          >
            ?
          </text>
        </g>
      ) : (
        <g>
          {/* Detective Cloak & Shoulders */}
          <path
            d="M14 53 C16 41 23 36 32 36 C41 36 48 41 50 53 Z"
            fill="#1A1512"
            stroke="#C88A2B"
            strokeWidth="1.4"
          />
          {/* Collar */}
          <path
            d="M21 38 L32 45 L43 38"
            fill="none"
            stroke="#C4533A"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Shadow Head */}
          <circle cx="32" cy="30" r="10.5" fill="#1A1512" />
          {/* Storybook Fedora / Explorer Hat */}
          <ellipse cx="32" cy="23" rx="18" ry="4.2" fill="#14100E" stroke="#C88A2B" strokeWidth="1.4" />
          <path
            d="M20 22 L23 11 C27 10 37 10 41 11 L44 22 Z"
            fill="#14100E"
            stroke="#C88A2B"
            strokeWidth="1.4"
          />
          <rect x="21.5" y="18.5" width="21" height="3" rx="1" fill="#C4533A" />
          {/* Glowing Curious Eyes Peeking Under Brim */}
          <ellipse cx="27.5" cy="30.5" rx="2.4" ry="1.8" fill="#F6DFB1" />
          <ellipse cx="36.5" cy="30.5" rx="2.4" ry="1.8" fill="#F6DFB1" />
          <circle cx="28" cy="30.5" r="0.9" fill="#2B231D" />
          <circle cx="37" cy="30.5" r="0.9" fill="#2B231D" />
        </g>
      )}
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

  const targetLabel =
    mission.kind === 'wonder-chase'
      ? 'CHASING CULPRIT'
      : mission.kind === 'lost-explorer'
        ? 'SEARCHING FOR EXPLORER'
        : 'TRACKING RARE WILDLIFE';

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
        <MysterySilhouette kind={mission.kind} size={compact ? 42 : 48} />
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
              ? 'CASE TARGET REVEALED'
              : revealedSuspect
                ? 'WARRANT TARGET LOCKED'
                : targetLabel}
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
            : `Mystery Shadow • ${mission.stolenOrTargetItem}`}
        </div>

        {!compact && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {traits.length === 0 ? (
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: 'var(--ink-soft)',
                }}
              >
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
