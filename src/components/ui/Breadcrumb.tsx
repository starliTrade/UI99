/**
 * UI99 — Breadcrumb Navigation Component (Build 02.2)
 * Dual-theme (Obsidian Dark / Porcelain Light).
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useIsDark } from './theme';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const isDark = useIsDark();

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs font-medium ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-1.5">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0 rtl:rotate-180" />
            )}
            {item.onClick || item.href ? (
              <button
                type="button"
                onClick={item.onClick}
                className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-(var(--radius-xs)) transition-colors cursor-pointer ${
                  isLast || item.active
                    ? isDark
                      ? 'text-(--text-primary) font-semibold'
                      : 'text-zinc-950 font-semibold'
                    : isDark
                    ? 'text-(--text-secondary) hover:text-white'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <span
                className={`flex items-center gap-1.5 px-1.5 py-0.5 ${
                  isLast || item.active
                    ? isDark
                      ? 'text-(--text-primary) font-semibold'
                      : 'text-zinc-950 font-semibold'
                    : isDark
                    ? 'text-(--text-secondary)'
                    : 'text-zinc-500'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
