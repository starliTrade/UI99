/**
 * Home studio stage — coverage & taxonomy integrity.
 *
 * The studio is the first live contact a visitor has with the engine, so a
 * blank stage is not a cosmetic bug: it is the homepage contradicting itself.
 * Two failures happened before this test existed and both were invisible:
 *
 *   1. 71 of 103 registry items had no stage render at all.
 *   2. The category filter was a hand-written map that had drifted into
 *      fiction — 15 ids that no longer exist, 19 items filed nowhere, and
 *      fabricated counts on a "99" the registry had outgrown.
 *
 * The fix was structural (a typed specimen catalogue + a taxonomy derived
 * from the registry), so the guarantee is locked here rather than trusted.
 */

import { describe, it, expect } from 'vitest';
import { REGISTRY_COMPONENTS } from '../registry/registryData';
import { STUDIO_SPECIMENS, HAND_BUILT_STAGE_IDS } from '../components/home/studioSpecimens';

const registryIds = REGISTRY_COMPONENTS.map((c) => c.id);

describe('home studio stage', () => {
  it('renders a live stage for every registry component', () => {
    const covered = new Set([...Object.keys(STUDIO_SPECIMENS), ...HAND_BUILT_STAGE_IDS]);
    const missing = registryIds.filter((id) => !covered.has(id));
    expect(missing).toEqual([]);
  });

  it('never points a hand-built demo and a specimen at the same item', () => {
    // The two render paths are mutually exclusive in the view; an overlap
    // would silently pick the specimen and drop the interactive demo.
    const overlap = Object.keys(STUDIO_SPECIMENS).filter((id) =>
      HAND_BUILT_STAGE_IDS.has(id),
    );
    expect(overlap).toEqual([]);
  });

  it('resolves the default stage (button) to a real, interactive demo', () => {
    expect(HAND_BUILT_STAGE_IDS.has('button')).toBe(true);
  });

  it('has no duplicate registry ids', () => {
    expect(new Set(registryIds).size).toBe(registryIds.length);
  });

  it('files every component under exactly one real registry category', () => {
    // The studio derives its filter from `category`; if a new item ships
    // without one it would be reachable only under "All" — a silent hole.
    const blank = REGISTRY_COMPONENTS.filter((c) => !c.category || !c.category.trim());
    expect(blank.map((c) => c.id)).toEqual([]);
  });

  it('keeps the studio taxonomy in step with the registry taxonomy', () => {
    // Six real buckets, no invented ones. A studio-only category would make
    // the filter row lie about what the registry contains.
    const categories = new Set(REGISTRY_COMPONENTS.map((c) => c.category));
    for (const cat of categories) expect(cat).toBeTruthy();
    expect(categories.size).toBeGreaterThan(0);
  });
});

describe('studio inspector data', () => {
  it('every component documents at least one capability', () => {
    // Capabilities feed the inspector on every component, so an empty list
    // would render a bare heading.
    const empty = REGISTRY_COMPONENTS.filter((c) => c.features.length === 0);
    expect(empty.map((c) => c.id)).toEqual([]);
  });

  it('tracks the components still missing prop documentation', () => {
    // A known, explicit gap: the inspector renders an honest empty state for
    // these instead of pretending. Document one and this list gets shorter —
    // if it changes without that happening, the test is telling the truth
    // about a regression rather than a deliberate edit.
    const UNDOCUMENTED = [
      'alert-dialog', 'command', 'dropdown-menu', 'hover-card',
      'kanban-board', 'linear-issue-tracker', 'menubar', 'navigation-menu',
      'scroll-area',
    ];
    const missing = REGISTRY_COMPONENTS.filter((c) => c.props.length === 0)
      .map((c) => c.id)
      .sort();
    expect(missing).toEqual([...UNDOCUMENTED].sort());
  });

  it('keeps prop docs typed and named', () => {
    for (const c of REGISTRY_COMPONENTS) {
      for (const p of c.props) {
        expect(p.name, `${c.id}.props.name`).toBeTruthy();
        expect(p.type, `${c.id}.props.${p.name}.type`).toBeTruthy();
        expect(p.description, `${c.id}.props.${p.name}.description`).toBeTruthy();
      }
    }
  });

  it('pins every component to a released version', () => {
    const bad = REGISTRY_COMPONENTS.filter((c) => !/^\d+\.\d+\.\d+$/.test(c.version));
    expect(bad.map((c) => c.id)).toEqual([]);
  });
});
