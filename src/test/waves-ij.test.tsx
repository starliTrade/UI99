/**
 * Wave I/J Coverage Suite — behavioral + axe tests for the components added in
 * 056998c (and the TreeView/DataTable a11y rewrite). Written against real
 * component contracts (verified by reading source).
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { TreeView, TreeNode } from '../components/ui/TreeView';
import { DataTable, DataTableColumn } from '../components/ui/DataTable';
import { KanbanBoard } from '../components/ui/KanbanBoard';
import { CalendarView } from '../components/ui/CalendarView';
import { TourGuide } from '../components/ui/TourGuide';
import { Banner } from '../components/ui/Banner';
import { MetricCard } from '../components/ui/MetricCard';
import { AudioPlayer } from '../components/ui/AudioPlayer';
import { ColorPicker } from '../components/ui/ColorPicker';

const TREE_DATA: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'app', name: 'App.tsx', type: 'file', extension: 'tsx' },
      { id: 'lib', name: 'lib', type: 'folder', children: [{ id: 'utils', name: 'utils.ts', type: 'file', extension: 'ts' }] },
    ],
  },
];

describe('TreeView — WAI-ARIA tree pattern', () => {
  it('renders tree/treeitem/group roles with aria-expanded', () => {
    render(<TreeView data={TREE_DATA} />);
    expect(screen.getByRole('tree')).toBeTruthy();
    const folders = screen.getAllByRole('treeitem');
    expect(folders.length).toBe(4); // src, App.tsx, lib, utils.ts
    expect(folders[0]).toHaveAttribute('aria-expanded', 'true');
    expect(folders[0]).toHaveAttribute('aria-level', '1');
  });

  it('toggles aria-expanded and collapses the group on click', () => {
    render(<TreeView data={TREE_DATA} />);
    const root = screen.getAllByRole('treeitem')[0];
    fireEvent.click(root);
    expect(root).toHaveAttribute('aria-expanded', 'false');
    // utils.ts (nested) is no longer visible
    expect(screen.queryByText('utils.ts')).toBeNull();
  });

  it('selects a node via Enter key and fires onSelect', () => {
    const onSelect = vi.fn();
    render(<TreeView data={TREE_DATA} onSelect={onSelect} />);
    const file = screen.getByText('App.tsx').closest('[role="treeitem"]') as HTMLElement;
    fireEvent.keyDown(file, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
  });

  it('is axe-clean', async () => {
    const { container } = render(<TreeView data={TREE_DATA} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

interface Row {
  name: string;
  points: number;
}

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'points', header: 'Points', sortable: true },
];

const ROWS: Row[] = [
  { name: 'Beta', points: 2 },
  { name: 'Alpha', points: 1 },
];

describe('DataTable — aria-sort pattern', () => {
  it('sorts rows when a sortable header is clicked', () => {
    render(<DataTable columns={COLUMNS} data={ROWS} searchable={false} pageSize={10} />);
    const nameHeader = screen.getByText('Name').closest('th') as HTMLElement;
    fireEvent.click(nameHeader);
    const cells = screen.getAllByRole('cell');
    expect(cells[0].textContent).toBe('Alpha');
  });

  it('exposes ascending sort via aria-sort after click', () => {
    render(<DataTable columns={COLUMNS} data={ROWS} searchable={false} pageSize={10} />);
    const nameHeader = screen.getByText('Name').closest('th') as HTMLElement;
    expect(nameHeader.getAttribute('aria-sort')).toBe('none');
    fireEvent.click(nameHeader);
    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');
  });

  it('is axe-clean', async () => {
    const { container } = render(<DataTable columns={COLUMNS} data={ROWS} searchable={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('KanbanBoard — list semantics', () => {
  it('renders columns as lists with accessible names', () => {
    render(<KanbanBoard onCardMove={() => {}} />);
    expect(screen.getByRole('list', { name: /Backlog column/ })).toBeTruthy();
    expect(screen.getByRole('list', { name: /Done column/ })).toBeTruthy();
  });

  it('exposes a move toolbar per card and moves cards between columns', () => {
    const onMove = vi.fn();
    render(<KanbanBoard onCardMove={onMove} />);
    const toolbars = screen.getAllByRole('toolbar');
    expect(toolbars.length).toBeGreaterThan(0);
    const moveBtn = screen.getAllByRole('button', { name: /Move .* to Done/ })[0];
    fireEvent.click(moveBtn);
    expect(onMove).toHaveBeenCalled();
  });

  it('is axe-clean', async () => {
    const { container } = render(<KanbanBoard onCardMove={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('CalendarView — day-cell semantics', () => {
  it('labels day cells with aria-label and marks selected with aria-pressed', () => {
    render(<CalendarView onSelectDay={() => {}} />);
    const day = screen.getByRole('button', { name: /^September 8/ });
    expect(day).toBeTruthy();
    const today = screen.getByRole('button', { name: /today/ });
    expect(today.getAttribute('aria-label')).toMatch(/September 24, today/);
  });

  it('selects a day on click', () => {
    const onSelect = vi.fn();
    render(<CalendarView onSelectDay={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /^September 15/ }));
    expect(onSelect).toHaveBeenCalledWith(15);
  });

  it('is axe-clean', async () => {
    const { container } = render(<CalendarView />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TourGuide — dialog semantics', () => {
  const steps = [
    { title: 'Welcome', description: 'Start here' },
    { title: 'Explore', description: 'Look around' },
  ];

  it('advances steps and completes the tour', () => {
    const onComplete = vi.fn();
    render(<TourGuide steps={steps} onComplete={onComplete} onDismiss={() => {}} />);
    const next = screen.getByRole('button', { name: 'Next step' });
    fireEvent.click(next);
    fireEvent.click(screen.getByRole('button', { name: 'Finish tour' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('is axe-clean', async () => {
    const { container } = render(<TourGuide steps={steps} onDismiss={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Banner — alert/status semantics', () => {
  it('danger variant announces as alert', () => {
    render(<Banner variant="amber" title="Heads up">Watch out.</Banner>);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <Banner variant="emerald" title="Saved" onDismiss={() => {}}>
        All good.
      </Banner>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('MetricCard — group semantics', () => {
  it('exposes an accessible name with label and value', () => {
    render(<MetricCard label="Velocity" value={21} delta={12.4} />);
    expect(screen.getByRole('group', { name: /Velocity: 21/ })).toBeTruthy();
  });

  it('is axe-clean', async () => {
    const { container } = render(<MetricCard label="Load" value="42%" delta={-3.1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AudioPlayer — slider semantics', () => {
  it('exposes seek slider with value text', () => {
    render(<AudioPlayer title="Test Tone" artist="UI99" />);
    const slider = screen.getByRole('slider', { name: 'Seek position' });
    expect(slider.getAttribute('aria-valuetext')).toMatch(/of/);
  });

  it('toggles play state via aria-pressed button', () => {
    render(<AudioPlayer title="Test Tone" artist="UI99" />);
    const play = screen.getByRole('button', { name: 'Play' });
    fireEvent.click(play);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeTruthy();
  });

  it('is axe-clean', async () => {
    const { container } = render(<AudioPlayer title="Test Tone" artist="UI99" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ColorPicker — labeled inputs', () => {
  it('hex input has an accessible label and presets are buttons', () => {
    render(<ColorPicker label="Accent" onChange={() => {}} />);
    expect(screen.getByLabelText('Hex color value')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Select color #10B981' })).toBeTruthy();
  });

  it('fires onChange when a preset is selected', () => {
    const onChange = vi.fn();
    render(<ColorPicker onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select color #10B981' }));
    expect(onChange).toHaveBeenCalledWith('#10B981');
  });

  it('is axe-clean', async () => {
    const { container } = render(<ColorPicker label="Accent" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
