/**
 * UI99 — Combobox (Wave F)
 * Popover + cmdk filtered list with "both worlds" input (shadcn pattern):
 * filter-as-you-type, create-option affordance, 44px rows, full keyboard nav.
  * @token Panel resolves `--bg-elevated` + `--border-subtle`; rows hover via `--state-hover`; selected check rides `--text-primary`.
*/

import React, { useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './Command';

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Currently selected value; `null` = nothing selected. */
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Allow creating an option from free-typed text (Enter). */
  allowCreate?: boolean;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  allowCreate = false,
  emptyText = 'No results',
  disabled = false,
  className = '',
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((o) => o.value === value) ?? null;

  const exactMatch = options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  const createOption = () => {
    const label = query.trim();
    if (!label) return;
    onChange(label);
    setOpen(false);
    setQuery('');
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            'inline-flex h-10 w-full items-center justify-between gap-2 rounded-(var(--radius-field)) border border-black/[0.07] bg-white px-3 text-sm',
            'dark:border-white/[0.07] dark:bg-(--bg-elevated)',
            'transition-colors hover:bg-(--state-hover)',
            'focus-visible:outline-none focus-ui99-inset cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-45',
            className
          )}
        >
          <span className={cn('truncate', !selected && 'text-zinc-400 dark:text-(--text-secondary)')}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown className="w-4 h-4 shrink-0 text-(--text-muted)" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-(var(--radius-control)) border border-black/[0.06] bg-white shadow-(var(--elevation-4)) dark:border-white/[0.06] dark:bg-(--bg-elevated)"
        >
          <Command shouldFilter>
            <CommandInput placeholder={searchPlaceholder} onValueChange={setQuery} />
            <CommandList className="max-h-64">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery('');
                    }}
                    className="min-h-[44px]"
                  >
                    <Check
                      className={cn(
                        'mr-2 w-4 h-4 shrink-0',
                        option.value === value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                    {option.hint && (
                      <span className="ml-auto pl-2 text-[10px] font-mono text-(--text-muted)">
                        {option.hint}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {allowCreate && query.trim() && !exactMatch && (
                <CommandGroup>
                  <CommandItem onSelect={createOption} className="min-h-[44px]">
                    <span className="mr-2 flex w-4 justify-center text-zinc-400">+</span>
                    Create “{query.trim()}”
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
