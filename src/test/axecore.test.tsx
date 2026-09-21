import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { AppProvider } from '../core/context/AppContext';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';

describe('axe-core', () => {
  it('Button is axe-clean', async () => {
    const { container } = render(
      <AppProvider>
        <Button>Ship it</Button>
      </AppProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Checkbox is axe-clean', async () => {
    const { container } = render(
      <AppProvider>
        <Checkbox checked={true} onChange={() => {}} label="Persist" />
      </AppProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
