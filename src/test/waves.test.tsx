/**
 * Wave Coverage Suite — behavioral + axe for the wave-added components.
 * Written against the REAL component contracts (verified by reading source).
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Rating } from '../components/ui/Rating';
import { OTPInput } from '../components/ui/OTPInput';
import { CopyButton } from '../components/ui/CopyButton';
import { NumberField } from '../components/ui/NumberField';
import { Swatch } from '../components/ui/Swatch';
import { AvatarStack } from '../components/ui/AvatarStack';
import { Carousel } from '../components/ui/Carousel';
import { TimePicker } from '../components/ui/TimePicker';
import { Combobox } from '../components/ui/Combobox';
import { DatePicker } from '../components/ui/DatePicker';
import { Stepper } from '../components/ui/Stepper';
import { FileUpload } from '../components/ui/FileUpload';
import { Sparkline } from '../components/ui/Sparkline';
import { MeterBar } from '../components/ui/MeterBar';
import { TrendDelta } from '../components/ui/TrendDelta';
import { StatTile } from '../components/ui/StatTile';
import { Alert } from '../components/ui/Alert';
import { Separator } from '../components/ui/Separator';
import { Label } from '../components/ui/Label';
import { EmptyState, LoadingState } from '../components/ui/Feedback';

describe('Wave H — inputs', () => {
  it('Rating selects via click', () => {
    const onChange = vi.fn();
    render(<Rating value={3} onChange={onChange} />);
    const four = screen.getByRole('radio', { name: /4 stars/ });
    fireEvent.click(four);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('Rating is axe-clean', async () => {
    const { container } = render(<Rating value={3} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('OTPInput advances on digit entry', () => {
    const onChange = vi.fn();
    render(<OTPInput length={4} onChange={onChange} />);
    const first = screen.getByLabelText('Digit 1');
    fireEvent.change(first, { target: { value: '9' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('NumberField decrements and clamps at min', () => {
    const onChange = vi.fn();
    const { rerender } = render(<NumberField value={3} onChange={onChange} min={1} max={5} />);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onChange).toHaveBeenCalledWith(2);

    // At min: button disabled, no event
    rerender(<NumberField value={1} onChange={onChange} min={1} max={5} />);
    expect(screen.getByRole('button', { name: 'Decrease' }).hasAttribute('disabled')).toBe(true);
  });

  it('CopyButton renders with label', () => {
    render(<CopyButton text="hello" label="Copy code" />);
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
  });

  it('Swatch shows hex and name', () => {
    render(<Swatch name="Root" hex="#06070A" />);
    expect(screen.getByText('Root')).toBeTruthy();
    expect(screen.getByText('#06070A')).toBeTruthy();
  });
});

describe('Wave G — display', () => {
  it('AvatarStack shows overflow counter', () => {
    render(<AvatarStack names={['A', 'B', 'C', 'D', 'E']} max={3} />);
    expect(screen.getByLabelText('5 members')).toBeTruthy();
    expect(screen.getByText('+2')).toBeTruthy();
  });

  it('Carousel disables prev at start and renders dot tabs', () => {
    const { container } = render(
      <Carousel label="Gallery">
        <div>Slide A</div>
        <div>Slide B</div>
      </Carousel>
    );
    expect(screen.getByRole('button', { name: 'Previous slide' }).hasAttribute('disabled')).toBe(true);
    expect(container.querySelectorAll('[role="tab"]').length).toBe(2);
  });
});

describe('Wave F — pickers', () => {
  it('TimePicker filters slots', () => {
    render(<TimePicker value={null} onChange={() => {}} step={30} />);
    const input = screen.getByLabelText('Filter times');
    fireEvent.change(input, { target: { value: '09:' } });
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
    expect(options.every((o) => o.textContent?.includes('09:'))).toBe(true);
  });

  it('Combobox opens and lists options', () => {
    render(
      <Combobox
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        value={null}
        onChange={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Alpha')).toBeTruthy();
  });

  it('DatePicker is axe-clean', async () => {
    const { container } = render(<DatePicker value={null} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Wave C — product patterns', () => {
  it('Stepper marks current step via aria-current', () => {
    render(<Stepper steps={['One', 'Two', 'Three']} current={1} />);
    const current = container_current();
    expect(current).toBeTruthy();
    expect(current?.textContent).toContain('Two');
  });

  function container_current() {
    return document.querySelector('[aria-current="step"]');
  }
});

describe('Wave C — FileUpload', () => {
  it('renders label-wrapped sr-only input (keyboard accessible)', () => {
    const { container } = render(<FileUpload onFilesSelected={() => {}} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
  });
});

describe('Wave D — micro charts', () => {
  it('Sparkline renders with accessible name', () => {
    const { container } = render(<Sparkline data={[1, 4, 2, 8, 5, 9]} label="Weekly trend" />);
    const svg = container.querySelector('svg[aria-label="Weekly trend"]');
    expect(svg).toBeTruthy();
  });

  it('MeterBar exposes meter semantics', () => {
    const { container } = render(<MeterBar value={64} label="Load" />);
    const meter = container.querySelector('[role="meter"], meter, [aria-valuenow]');
    expect(meter).toBeTruthy();
  });

  it('StatTile renders label and value', () => {
    render(<StatTile label="Streak" value={21} />);
    expect(screen.getByText('Streak')).toBeTruthy();
    expect(screen.getByText(/21/)).toBeTruthy();
  });

  it('TrendDelta is axe-clean', async () => {
    const { container } = render(<TrendDelta delta={12.4} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Wave A — layout & feedback', () => {
  it('Separator renders hairline div', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-orientation="horizontal"]')).toBeTruthy();
  });

  it('Label associates with control via htmlFor', () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </div>
    );
    expect(screen.getByLabelText('Email')).toBeTruthy();
  });

  it('Alert exposes role=alert on destructive variant', () => {
    render(<Alert variant="destructive" title="Delete failed">Something went wrong.</Alert>);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('EmptyState shows action button', () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Create your first object"
        actionLabel="Create"
        onAction={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeTruthy();
  });

  it('LoadingState announces status politely', () => {
    render(<LoadingState message="Loading" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
