/**
 * UI99 — Table (Wave B)
 * Composable table primitives with hairline rows, sticky header option,
 * and mobile-friendly overflow wrapper.
 */

import React from 'react';
import { cn } from '../../lib/utils';

export function Table({ className = '', ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn('w-full caption-bottom border-collapse text-xs', className)}
        {...props}
      />
    </div>
  );
}
Table.displayName = 'Table';

export function TableHeader({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b [&_tr]:border-black/[0.06] dark:[&_tr]:border-white/[0.05]', className)} {...props} />;
}
TableHeader.displayName = 'TableHeader';

export function TableBody({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}
TableBody.displayName = 'TableBody';

export function TableFooter({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        'border-t border-black/[0.06] dark:border-white/[0.05] bg-zinc-50 dark:bg-[#0E0E13] font-medium',
        className
      )}
      {...props}
    />
  );
}
TableFooter.displayName = 'TableFooter';

export function TableRow({ className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-black/[0.05] dark:border-white/[0.04] transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] data-[state=selected]:bg-black/[0.03] dark:data-[state=selected]:bg-white/[0.04]',
        className
      )}
      {...props}
    />
  );
}
TableRow.displayName = 'TableRow';

export function TableHead({ className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-10 px-3 text-left align-middle text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-[#8E8E98] [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}
TableHead.displayName = 'TableHead';

export function TableCell({ className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('px-3 py-2.5 align-middle text-zinc-800 dark:text-[#D4D4D8] [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
}
TableCell.displayName = 'TableCell';

export function TableCaption({ className = '', ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('mt-3 text-[11px] text-zinc-500 dark:text-[#8E8E98]', className)} {...props} />;
}
TableCaption.displayName = 'TableCaption';
