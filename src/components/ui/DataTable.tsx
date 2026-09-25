/**
 * UI \ [99] — DataTable Primitive
 * High-performance table with search, sorting, and pagination.
 */

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  className?: string;
  /**
   * Scoped density for THIS table only, without touching the page around it.
   * `'inherit'` (the default) defers to whatever `<html data-density>` says,
   * so a consumer who already set the global attribute gets it for free.
   *
   * `compact` is a pointer affordance — at this size it is below the 44px touch
   * floor. It belongs on a desktop table, not on a phone.
   */
  density?: 'inherit' | 'compact' | 'comfortable';
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 5,
  searchable = true,
  className = '',
  density = 'inherit',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  // Filter
  const filtered = data.filter((item) => {
    if (!search) return true;
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div
      className={`space-y-3 ${
        density === 'compact' ? 'density-compact' : density === 'comfortable' ? 'density-comfortable' : ''
      } ${className}`}
    >
      {searchable && (
        <div className="relative w-full max-w-xs">
          <Search className="icon-sm absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search records..."
            aria-label="Search records"
            className="w-full pl-8 pr-3 py-1.5 rounded-(--radius-field) bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] type-caption font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:border-zinc-400 dark:focus:border-white/20 focus-ui99"
          />
        </div>
      )}

      <div className="rounded-(--radius-field) border border-zinc-200/80 dark:border-white/[0.04] overflow-hidden bg-white dark:bg-(--bg-surface)">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                const isSorted = col.sortable && sortKey === col.key;
                return (
                  <TableHead
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    onKeyDown={(e) => {
                      if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSort(String(col.key));
                      }
                    }}
                    aria-sort={
                      isSorted
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : col.sortable
                          ? 'none'
                          : undefined
                    }
                    tabIndex={col.sortable ? 0 : undefined}
                    aria-label={
                      col.sortable
                        ? `${col.header}${isSorted ? (sortDir === 'asc' ? ', sorted ascending' : ', sorted descending') : ', activate to sort'}`
                        : undefined
                    }
                    className={col.sortable ? 'cursor-pointer select-none hover:text-zinc-950 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60' : ''}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && !isSorted && (
                        <span aria-hidden="true" className="text-(--text-secondary)">
                          <ChevronDown className="icon-xs opacity-0" />
                        </span>
                      )}
                      {isSorted && (
                        <span aria-hidden="true">
                          {sortDir === 'asc' ? (
                            <ChevronUp className="icon-xs text-emerald-500" />
                          ) : (
                            <ChevronDown className="icon-xs text-emerald-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-(--text-muted)">
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between type-caption font-mono text-(--text-muted) px-1">
          <span>
            Page {page + 1} of {totalPages} ({sorted.length} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
              className="p-1 rounded-(--radius-sm) hover:bg-zinc-100 dark:hover:bg-white/[0.06] disabled:opacity-40"
            >
              <ChevronLeft className="icon-md" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
              className="p-1 rounded-(--radius-sm) hover:bg-zinc-100 dark:hover:bg-white/[0.06] disabled:opacity-40"
            >
              <ChevronRight className="icon-md" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
