import { useMemo, useState } from 'react';
import { BookOpen, Compass, Search, X } from 'lucide-react';
import { CONTINENT_ORDER, DESTINATIONS } from '../data/destinations';
import { getUsStateMeta } from '../data/destinations/usStatesMeta';
import type { ContinentName, Destination } from '../types/game';
import { MiniFlag } from './art/MiniFlag';

interface FieldGuideModalProps {
  /** Optional 5 Departure Board IDs so players can compare candidate stops side-by-side! */
  compareDestIds?: string[];
  initialSearch?: string;
  onClose: () => void;
}

export function FieldGuideModal({
  compareDestIds = [],
  initialSearch = '',
  onClose,
}: FieldGuideModalProps) {
  const hasCompare = compareDestIds.length > 0;
  const [compareOnly, setCompareOnly] = useState<boolean>(hasCompare);
  const [continent, setContinent] = useState<'All' | ContinentName>('All');
  const [query, setQuery] = useState<string>(initialSearch);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const compareSet = new Set(compareDestIds);
    const q = query.trim().toLowerCase();

    return DESTINATIONS.filter((d) => {
      if (compareOnly && hasCompare && !compareSet.has(d.id)) return false;
      if (!compareOnly && continent !== 'All' && d.continent !== continent) return false;
      if (!q) return true;
      const us = getUsStateMeta(d.id);
      const haystack = [
        d.name,
        d.country,
        d.capital,
        d.continent,
        d.subregion,
        d.currency,
        d.currencyCode,
        d.languages.join(' '),
        d.flagDescription,
        d.waterway,
        d.landform,
        d.climate,
        d.borders.join(' '),
        d.animalName,
        d.famousFood,
        d.worldWonder,
        d.greeting,
        us?.stateName ?? '',
        us?.nickname ?? '',
        us?.stateCapital ?? '',
        d.history[0].era,
        d.history[0].title,
        d.history[0].fact,
        d.history[1].era,
        d.history[1].title,
        d.history[1].fact,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [compareOnly, hasCompare, compareDestIds, continent, query]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="paper-panel modal-card-wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Illustrated Atlas Field Guide and Almanac"
      >
        <div className="section-header" style={{ marginBottom: 12 }}>
          <div>
            <div className="stamp-label" style={{ color: 'var(--sage-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={15} /> ALWAYS FREE TO CONSULT • {DESTINATIONS.length} WORLD ENTRIES
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: 2 }}>
              Wanderbook Illustrated Field Guide
            </h2>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} /> Close Almanac
          </button>
        </div>

        {/* Search & Quick Compare Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 16,
            padding: '12px 14px',
            borderRadius: 16,
            background: 'var(--parchment-deep)',
            border: '1.5px solid rgba(43,35,29,0.16)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search
                size={17}
                color="var(--ink-muted)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                className="input-field"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim()) setCompareOnly(false);
                }}
                placeholder="Search currency (Yen, Pula), river, capital, flag, animal, or history..."
                style={{ paddingLeft: 38 }}
              />
            </div>

            {hasCompare && (
              <button
                type="button"
                className={`btn btn-sm ${compareOnly ? 'btn-terracotta' : 'btn-secondary'}`}
                onClick={() => {
                  setCompareOnly((c) => !c);
                  setQuery('');
                }}
              >
                <Compass size={16} />
                {compareOnly
                  ? `Showing My ${compareDestIds.length} Flight Options`
                  : `Compare My ${compareDestIds.length} Flight Options`}
              </button>
            )}
          </div>

          {!compareOnly && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['All', ...CONTINENT_ORDER] as const).map((cont) => {
                const active = continent === cont;
                return (
                  <button
                    key={cont}
                    type="button"
                    onClick={() => setContinent(cont)}
                    style={{
                      padding: '5px 11px',
                      borderRadius: 999,
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: active ? 'var(--mariner)' : 'var(--parchment-bright)',
                      color: active ? '#FDF9F0' : 'var(--ink-soft)',
                      border: active
                        ? '1.5px solid var(--mariner-dark)'
                        : '1.5px solid rgba(43,35,29,0.18)',
                    }}
                  >
                    {cont}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Almanac Entries Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--ink-soft)', fontWeight: 700 }}>
            No atlas entries matched “{query}”. Try searching a currency, continent, or landmark!
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 14,
            }}
          >
            {filtered.map((dest: Destination) => {
              const isOpen = expandedId === dest.id || compareOnly;
              return (
                <article
                  key={dest.id}
                  className="paper-card"
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    borderColor: compareOnly ? 'rgba(196,83,58,0.45)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div className="stamp-label" style={{ color: 'var(--mariner)', fontSize: '0.68rem' }}>
                        {dest.subregion} • {dest.latLabel}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', marginTop: 2 }}>
                        {dest.country} — {dest.name}
                      </h3>
                      {getUsStateMeta(dest.id) && (
                        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--terracotta)' }}>
                          {getUsStateMeta(dest.id)?.nickname}
                        </div>
                      )}
                    </div>
                    <MiniFlag dest={dest} width={34} />
                  </div>

                  {/* Quick Fact Table */}
                  <div style={{ fontSize: '0.84rem', lineHeight: 1.48, color: 'var(--ink)' }}>
                    <div><strong>Capital:</strong> {dest.capital}</div>
                    <div>
                      <strong>Currency:</strong> {dest.currency}{' '}
                      {dest.currencyCode !== 'NONE' && (
                        <span style={{ fontFamily: 'var(--font-stamp)', color: 'var(--terracotta)' }}>
                          ({dest.currencyCode})
                        </span>
                      )}
                    </div>
                    <div><strong>Languages:</strong> {dest.languages.join(', ')} (<em>“{dest.greeting}”</em>)</div>
                    <div><strong>Waterway:</strong> {dest.waterway}</div>
                    <div><strong>Landform:</strong> {dest.landform}</div>
                  </div>

                  {isOpen ? (
                    <div
                      style={{
                        borderTop: '1px dashed rgba(43,35,29,0.2)',
                        paddingTop: 8,
                        fontSize: '0.83rem',
                        lineHeight: 1.48,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                        color: 'var(--ink-soft)',
                      }}
                    >
                      <div><strong style={{ color: 'var(--ink)' }}>Flag:</strong> {dest.flagDescription}</div>
                      <div><strong style={{ color: 'var(--ink)' }}>Borders:</strong> {dest.borders.join(', ')}</div>
                      <div><strong style={{ color: 'var(--ink)' }}>Climate:</strong> {dest.climate} ({dest.hemisphere} Hemisphere)</div>
                      <div><strong style={{ color: 'var(--ink)' }}>Food & Wonder:</strong> {dest.famousFood} • {dest.worldWonder}</div>
                      <div
                        style={{
                          marginTop: 4,
                          padding: '8px 10px',
                          borderRadius: 10,
                          background: 'var(--parchment)',
                          border: '1px solid rgba(43,35,29,0.12)',
                        }}
                      >
                        <div className="stamp-label" style={{ color: 'var(--ochre-dark)', fontSize: '0.68rem', marginBottom: 3 }}>
                          HISTORICAL TIMELINE
                        </div>
                        <div>
                          <strong>{dest.history[0].era} — {dest.history[0].title}:</strong> {dest.history[0].fact}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <strong>{dest.history[1].era} — {dest.history[1].title}:</strong> {dest.history[1].fact}
                        </div>
                      </div>
                      {!compareOnly && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ alignSelf: 'flex-start', padding: '4px 8px' }}
                          onClick={() => setExpandedId(null)}
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-start', marginTop: 2 }}
                      onClick={() => setExpandedId(dest.id)}
                    >
                      Flag, Borders & History →
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
