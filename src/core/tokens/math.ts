/**
 * UI99 — Mathematical Design System Algorithms & Validation Utilities (Build 02.2)
 *
 * Implements strict optical, geometric, and chromatic rules:
 * 1. Concentric Corner Radius Nesting: r_inner = Math.max(0, r_outer - padding)
 * 2. WCAG Contrast Calculation (AA >= 4.5:1, AAA >= 7:1)
 * 3. Strict Anti-Slop Brightness Limit:
 *    - Dark mode: brightness difference <= 12% between canvas and surface
 *    - Light mode: brightness difference <= 7% between canvas and surface
 * 4. Button Padding Math: Horizontal padding must equal exactly 2x vertical padding
 * 5. Container Padding Math: Container outer padding must always >= inner element gap
 */

/**
 * Calculates relative luminance according to WCAG 2.1 specifications.
 * sRGB space transformed to linear luminance.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function calculateLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates WCAG contrast ratio between two colors (range: 1.0 to 21.0).
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Calculates perceived brightness (0 to 100%) using HSP / ITU-R BT.709 color science.
 */
export function calculateBrightness(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  // Perceived brightness formula
  const brightness = Math.sqrt(
    0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
  );
  return Math.round((brightness / 255) * 1000) / 10; // e.g. 5.2%
}

/**
 * Verifies Anti-Slop Brightness Rule:
 * Dark Mode: container brightness difference <= 12%
 * Light Mode: container brightness difference <= 7%
 */
export interface BrightnessAuditResult {
  bgHex: string;
  surfaceHex: string;
  bgBrightness: number;
  surfaceBrightness: number;
  difference: number;
  maxAllowed: number;
  passesRule: boolean;
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'VIOLATION';
}

export function auditBrightnessLimit(
  bgHex: string,
  surfaceHex: string,
  mode: 'dark' | 'light'
): BrightnessAuditResult {
  const bgBri = calculateBrightness(bgHex);
  const surfaceBri = calculateBrightness(surfaceHex);
  const diff = Math.round(Math.abs(surfaceBri - bgBri) * 10) / 10;
  const maxAllowed = mode === 'dark' ? 12.0 : 7.0;
  const passesRule = diff <= maxAllowed;

  let status: 'OPTIMAL' | 'ACCEPTABLE' | 'VIOLATION' = 'OPTIMAL';
  if (!passesRule) {
    status = 'VIOLATION';
  } else if (diff > maxAllowed * 0.75) {
    status = 'ACCEPTABLE';
  }

  return {
    bgHex,
    surfaceHex,
    bgBrightness: bgBri,
    surfaceBrightness: surfaceBri,
    difference: diff,
    maxAllowed,
    passesRule,
    status,
  };
}

/**
 * Concentric Corner Radius Nesting:
 * Inner Radius = Outer Radius - Distance Between the Two (Padding)
 * When outer is rounded and inner sits inside with uniform padding, this formula guarantees
 * exact geometric concentricity, preventing visual discordance or corner pinching.
 */
export interface ConcentricRadiusResult {
  outerRadius: number;
  padding: number;
  calculatedInnerRadius: number;
  isConcentric: boolean;
  isClipped: boolean;
  note: string;
}

export function calculateConcentricRadius(
  outerRadius: number,
  padding: number
): ConcentricRadiusResult {
  const calculatedInner = Math.max(0, outerRadius - padding);
  const isClipped = outerRadius <= padding;

  let note = 'Perfect concentricity achieved. Inner corner centers align with outer corner centers.';
  if (isClipped) {
    note = 'Outer radius <= padding. Inner element corners resolve to a crisp right-angle (0px).';
  }

  return {
    outerRadius,
    padding,
    calculatedInnerRadius: calculatedInner,
    isConcentric: !isClipped,
    isClipped,
    note,
  };
}

/**
 * Verifies Button 2:1 Padding Rule:
 * Horizontal padding must equal exactly 2x vertical padding.
 */
export interface ButtonPaddingAudit {
  py: number;
  px: number;
  ratio: number;
  isExact2x: boolean;
  optimalPx: number;
}

export function auditButtonPadding(py: number, px: number): ButtonPaddingAudit {
  const ratio = Math.round((px / (py || 1)) * 100) / 100;
  const isExact2x = Math.abs(ratio - 2.0) <= 0.05;
  return {
    py,
    px,
    ratio,
    isExact2x,
    optimalPx: py * 2,
  };
}

/**
 * Verifies Container Padding Rule:
 * Container outer padding must always equal or exceed the inner padding/gap between its child elements.
 */
export interface ContainerPaddingAudit {
  outerPadding: number;
  innerGap: number;
  isValid: boolean;
  note: string;
}

export function auditContainerPadding(
  outerPadding: number,
  innerGap: number
): ContainerPaddingAudit {
  const isValid = outerPadding >= innerGap;
  return {
    outerPadding,
    innerGap,
    isValid,
    note: isValid
      ? 'Compliant: Container outer padding establishes proper boundary containment.'
      : 'Violation: Inner element gap exceeds container outer padding, causing optical leakage.',
  };
}
