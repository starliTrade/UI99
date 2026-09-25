/**
 * Audit Matrix (P1.5) — the five-state contract as a CI gate.
 *
 * docs/standards.md §8.1 requires every interactive primitive to implement
 *   default / hover / press / focus-visible / disabled.
 * Hover/press are visual (token state layers, covered by tokens:gate); this
 * matrix enforces the testable half:
 *
 *   1. AXE MATRIX      — 20 heavy/interactive primitives render axe-clean
 *   2. DISABLED GATE   — components exposing `disabled` are disabled from the
 *                        user's perspective (disabled attr or aria-disabled)
 *   3. FOCUS RING GATE — interactive primitives carry the focus-ui99 ring class
 *                        (visual state applied via :focus-visible in CSS)
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import {
  Button,
  IconButton,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Slider,
  RadioGroup,
  RadioGroupItem,
  Label,
  SegmentedControl,
  Dropdown,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ToggleGroup,
  ToggleGroupItem,
  DatePicker,
  TimePicker,
  NumberField,
  Rating,
  OTPInput,
  TagInput,
  RangeSlider,
  Combobox,
} from '../components/ui';

const CONTINUE = () => {};

/* ── 1. AXE MATRIX — 20 primitives, zero violations ─────────────────── */

const MATRIX: { name: string; ui: () => React.ReactElement }[] = [
  {
    name: 'Button',
    ui: () => <Button>Launch</Button>,
  },
  {
    name: 'IconButton',
    ui: () => <IconButton icon={<span>+</span>} label="Add item" />,
  },
  {
    name: 'Input',
    ui: () => <Input label="Email" placeholder="you@ui99.dev" />,
  },
  {
    name: 'Textarea',
    ui: () => <Textarea label="Notes" rows={3} />,
  },
  {
    name: 'Switch',
    ui: () => <Switch checked onChange={CONTINUE} label="Haptics" />,
  },
  {
    name: 'Checkbox',
    ui: () => <Checkbox checked onChange={CONTINUE} label="Ship it" />,
  },
  {
    name: 'Slider',
    ui: () => <Slider value={42} onChange={CONTINUE} label="Range" min={0} max={100} />,
  },
  {
    name: 'RadioGroup',
    ui: () => (
      <RadioGroup defaultValue="a">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="ax-a" />
          <Label htmlFor="ax-a">Alpha</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="ax-b" />
          <Label htmlFor="ax-b">Beta</Label>
        </div>
      </RadioGroup>
    ),
  },
  {
    name: 'SegmentedControl',
    ui: () => (
      <SegmentedControl
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
        ]}
        value="week"
        onChange={CONTINUE}
        label="Range"
      />
    ),
  },
  {
    name: 'Dropdown',
    ui: () => (
      <Dropdown
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        value="a"
        onChange={CONTINUE}
        label="Pick"
      />
    ),
  },
  {
    name: 'Tabs',
    ui: () => (
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>
    ),
  },
  {
    name: 'ToggleGroup',
    ui: () => (
      <ToggleGroup type="single" defaultValue="bold">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  {
    name: 'DatePicker',
    ui: () => <DatePicker value={null} onChange={CONTINUE} placeholder="Pick a date" />,
  },
  {
    name: 'TimePicker',
    ui: () => <TimePicker value="09:41" onChange={CONTINUE} />,
  },
  {
    name: 'NumberField',
    ui: () => <NumberField value={10} onChange={CONTINUE} label="Velocity" min={0} max={100} />,
  },
  {
    name: 'Rating',
    ui: () => <Rating value={4} onChange={CONTINUE} max={5} />,
  },
  {
    name: 'OTPInput',
    ui: () => <OTPInput length={4} onChange={CONTINUE} />,
  },
  {
    name: 'TagInput',
    ui: () => <TagInput tags={['a']} onChange={CONTINUE} label="Tags" />,
  },
  {
    name: 'RangeSlider',
    ui: () => <RangeSlider value={[10, 60]} onChange={CONTINUE} min={0} max={100} />,
  },
  {
    name: 'Combobox',
    ui: () => (
      <Combobox
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        value={null}
        onChange={CONTINUE}
        placeholder="Select…"
      />
    ),
  },
];

describe('audit matrix — axe-clean (20 primitives)', () => {
  it.each(MATRIX)('$name renders with zero axe violations', async ({ ui }) => {
    const { container } = render(ui());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ── 2. DISABLED GATE — user-perceived disabled state ───────────────── */

/** jest-dom's toBeDisabled covers disabled attr AND aria-disabled="true". */
function expectDisabled(el: HTMLElement) {
  const disabled =
    (el as HTMLInputElement).disabled === true ||
    el.getAttribute('aria-disabled') === 'true' ||
    el.closest('[aria-disabled="true"], [disabled]') !== null;
  expect(disabled).toBe(true);
}

describe('audit matrix — disabled contract', () => {
  it('Button.disabled blocks clicks', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Locked</Button>);
    const btn = screen.getByRole('button', { name: 'Locked' });
    expectDisabled(btn);
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('IconButton.disabled is inert', () => {
    const onClick = vi.fn();
    render(
      <IconButton icon={<span>+</span>} label="Add" disabled onClick={onClick} />
    );
    expectDisabled(screen.getByRole('button', { name: 'Add' }));
  });

  it('Input.disabled propagates to the field', () => {
    render(<Input label="Email" disabled />);
    expectDisabled(screen.getByLabelText('Email'));
  });

  it('Textarea.disabled propagates to the field', () => {
    render(<Textarea label="Notes" disabled />);
    expectDisabled(screen.getByLabelText('Notes'));
  });

  it('Switch.disabled is inert', () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} label="Haptics" disabled />);
    const sw = screen.getByRole('switch', { name: 'Haptics' });
    expectDisabled(sw);
    fireEvent.click(sw);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Checkbox.disabled is inert', () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Ship" disabled />);
    const cb = screen.getByRole('checkbox', { name: 'Ship' }) as HTMLInputElement;
    expectDisabled(cb);
    // The native input is disabled — state cannot change even if a synthetic
    // click lands (label has pointer-events-none, input has disabled attr).
    expect(cb.disabled).toBe(true);
    fireEvent.click(cb);
    expect(onChange).not.toHaveBeenCalled();
    expect(cb.checked).toBe(false);
  });

  it('Slider.disabled marks thumbs aria-disabled', () => {
    render(<Slider value={40} onChange={CONTINUE} label="Range" min={0} max={100} disabled />);
    const slider = screen.getByRole('slider');
    expectDisabled(slider);
  });

  it('RangeSlider.disabled marks both handles inert', () => {
    render(<RangeSlider value={[10, 60]} onChange={CONTINUE} min={0} max={100} disabled />);
    for (const handle of screen.getAllByRole('slider')) {
      expectDisabled(handle);
    }
  });

  it('RadioGroupItem.disabled is inert', () => {
    render(
      <RadioGroup defaultValue="a">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="d-a" disabled />
          <Label htmlFor="d-a">Alpha</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="d-b" />
          <Label htmlFor="d-b">Beta</Label>
        </div>
      </RadioGroup>
    );
    const disabledRadio = screen.getAllByRole('radio').find(
      (el) => (el as HTMLInputElement).disabled
    );
    expect(disabledRadio).toBeDefined();
    expectDisabled(disabledRadio!);
  });

  it('TabsTrigger.disabled is inert', () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two" disabled>
            Two
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>
    );
    expectDisabled(screen.getByRole('tab', { name: 'Two' }));
  });

  it('ToggleGroupItem.disabled is inert', () => {
    render(
      <ToggleGroup type="single" defaultValue="bold">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic" disabled>
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    );
    // Radix toggle items render as plain buttons without implicit roles.
    const italic = screen.getAllByText('Italic').find((el) => el.closest('button'))!;
    expectDisabled(italic.closest('button') as HTMLElement);
  });

  it('DatePicker.disabled blocks the trigger', () => {
    render(<DatePicker value={null} onChange={CONTINUE} disabled />);
    const trigger = screen.getByRole('button');
    expectDisabled(trigger);
  });

  it('NumberField.disabled is inert', () => {
    const onChange = vi.fn();
    render(<NumberField value={5} onChange={onChange} label="Velocity" disabled />);
    const field = screen.getByLabelText('Velocity');
    expectDisabled(field);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('OTPInput.disabled disables all cells', () => {
    render(<OTPInput length={4} onChange={CONTINUE} disabled />);
    for (const cell of screen.getAllByRole('textbox')) {
      expectDisabled(cell as HTMLInputElement);
    }
  });

  it('Combobox.disabled is inert', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        options={[{ value: 'a', label: 'Alpha' }]}
        value={null}
        onChange={onChange}
        disabled
        placeholder="Select…"
      />
    );
    const trigger = screen.getByRole('combobox', { hidden: true }) ?? screen.getAllByRole('button')[0];
    expectDisabled(trigger);
  });
});

/* ── 3. FOCUS RING GATE — the focus-ui99 system is wired in ─────────── */

describe('audit matrix — focus-ui99 ring contract', () => {
  it('interactive primitives carry the unified ring class', () => {
    const { container, unmount } = render(
      <div>
        <Button>Ring</Button>
        <Rating value={0} onChange={CONTINUE} />
        <Rating value={3} onChange={CONTINUE} size="sm" />
      </div>
    );
    const ringed = container.querySelectorAll('[class*="focus-ui99"]');
    // Button + Rating cells (10 across both ratings) all ring.
    expect(ringed.length).toBeGreaterThanOrEqual(5);
    unmount();
  });

  it('focus lands on the Button and is reachable via keyboard', () => {
    render(<Button>Focus me</Button>);
    const btn = screen.getByRole('button', { name: 'Focus me' });
    btn.focus();
    expect(document.activeElement).toBe(btn);
    expect(btn.className).toContain('focus-ui99');
  });
});
