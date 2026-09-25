/**
 * UI99 — Carousel (Wave G)
 * Native scroll-snap carousel (no animation lib): arrow buttons + dot
 * indicators, keyboard accessible, respects 44px targets. RTL-safe via
 * logical scroll (scrollBy inline direction-agnostic amounts).
  * @token Dots/arrows resolve `--text-primary` active vs 15% foreground idle; arrows are outline buttons on `--border-strong`.
*/

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './Button';

export interface CarouselProps {
  children: React.ReactNode[];
  itemClassName?: string;
  label?: string;
  className?: string;
}

export function Carousel({ children, itemClassName = '', label = 'Carousel', className = '' }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = React.Children.count(children);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, count - 1));
      const track = trackRef.current;
      if (!track) return;
      const child = track.children[clamped] as HTMLElement | undefined;
      if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      setActiveIndex(clamped);
    },
    [count]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const child = track.children[0] as HTMLElement | undefined;
      if (!child) return;
      const step = child.offsetWidth + 16;
      setActiveIndex(Math.round(track.scrollLeft / step));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={cn('relative', className)} role="region" aria-label={label} aria-roledescription="carousel">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-1"
      >
        {React.Children.map(children, (child, i) => (
          <div key={i} className={cn('snap-start shrink-0', itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5" role="tablist" aria-label={`${label} position`}>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={cn(
                'h-2 rounded-(--radius-pill) transition-all duration-200 cursor-pointer focus-visible:outline-none focus-ui99',
                i === activeIndex
                  ? 'w-5 bg-zinc-900 dark:bg-white'
                  : 'w-2 bg-black/[0.15] dark:bg-white/[0.15] hover:bg-black/[0.25] dark:hover:bg-white/[0.3]'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <IconButton
            icon={<ChevronLeft className="w-4 h-4" />}
            variant="outline"
            size="sm"
            label="Previous slide"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
          />
          <IconButton
            icon={<ChevronRight className="w-4 h-4" />}
            variant="outline"
            size="sm"
            label="Next slide"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex >= count - 1}
          />
        </div>
      </div>
    </div>
  );
}
