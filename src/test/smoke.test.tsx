import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { AppProvider } from '../core/context/AppContext';
import { Button } from '../components/ui/Button';

describe('smoke', () => {
  it('button renders and clicks', () => {
    const clicked: string[] = [];
    render(
      <AppProvider>
        <Button onClick={() => clicked.push('x')}>Launch</Button>
      </AppProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Launch' }));
    expect(clicked).toHaveLength(1);
  });
});
