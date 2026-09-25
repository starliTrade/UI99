/**
 * UI99 — SignaturePad Component
 * Precision smooth vector signature canvas with clear, undo, stroke width, and export options.
 */

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, Download, Check, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface SignaturePadProps {
  onSave?: (dataUrl: string) => void;
  strokeColor?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function SignaturePad({
  onSave,
  strokeColor,
  strokeWidth = 2.5,
  width = 460,
  height = 180,
  className,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas resolution & dark mode default
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot for undo
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), current]);

    setIsDrawing(true);
    setIsEmpty(false);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Resolve color
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    ctx.strokeStyle =
      strokeColor ||
      (isDark
        ? getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#EDEDEF'
        : '#18181B');
    ctx.lineWidth = strokeWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && onSave) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    setHistory([]);
    onSave?.('');
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previous = history[history.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory((prev) => prev.slice(0, -1));
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={cn('flex flex-col gap-2.5 p-3.5 rounded-(--radius-control) bg-white dark:bg-(--bg-card) border border-black/[0.06] dark:border-white/[0.04] shadow-md', className)}>
      <div className="flex items-center justify-between pb-1">
        <span className="type-caption font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="icon-sm text-emerald-500" />
          Draw signature with finger or stylus
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={undo}
            disabled={history.length === 0}
            className="p-1.5 type-caption text-(--text-muted) hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 rounded-(--radius-sm) transition-colors"
            title="Undo"
          >
            <RotateCcw className="icon-sm" />
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={isEmpty}
            className="p-1.5 type-caption text-rose-500 hover:bg-rose-500/10 disabled:opacity-30 rounded-(--radius-sm) transition-colors"
            title="Clear canvas"
          >
            <Trash2 className="icon-sm" />
          </button>
        </div>
      </div>

      <div className="relative rounded-(--radius-field) overflow-hidden bg-zinc-50 dark:bg-(--bg-canvas) border border-dashed border-black/10 dark:border-white/10 touch-none">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full cursor-crosshair block"
          style={{ height: `${height}px` }}
        />
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center type-caption text-(--text-secondary) dark:text-zinc-600 font-mono">
            Sign on the line below
          </div>
        )}
        <div className="absolute bottom-6 left-6 right-6 border-b border-zinc-200 dark:border-zinc-800/80 pointer-events-none" />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="type-micro text-(--text-secondary) font-mono">PNG / SVG Alpha</span>
        <Button
          size="xs"
          variant="secondary"
          disabled={isEmpty}
          onClick={download}
          icon={<Download className="icon-xs" />}
        >
          Export
        </Button>
      </div>
    </div>
  );
}
