/**
 * UI99 (@99/ui) — npm Kit Entry (Phase 2.2)
 *
 * The published package exports ONLY context-free primitives: every module
 * reachable from this entry depends solely on react, radix-*, motion/react,
 * cva/clsx/tailwind-merge and lucide-react (acceptance formula, ROADMAP §2.1).
 *
 * Domain composites (ToastContainer, TopHeader, BottomNavigation, ObjectCard,
 * LinearIssueTracker, TokensAuditPlayground) require AppContext/AuthContext/
 * domain types and are deliberately excluded — they live in the app barrel
 * `index.ts`. This split is verified in CI-style smoke checks after lib:build
 * (bundle must not contain AppContext/AuthContext/ObjectContext references).
 */

// Actions & Buttons
export { Button, IconButton, Tag, Avatar } from './Button';
export type { ButtonProps, IconButtonProps, TagProps, AvatarProps } from './Button';

// Surfaces & Cards
export { Card, Surface, GlassSurface, ElevatedSurface, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export type { SurfaceProps, SurfaceVariant } from './Card';

// Form Controls & Inputs
export { Input, Textarea, SearchBar } from './Input';
export type { InputProps, TextareaProps, SearchBarProps } from './Input';
export { Switch } from './Switch';
export type { SwitchProps } from './Switch';
export { Checkbox, Radio } from './Checkbox';
export type { CheckboxProps, RadioProps } from './Checkbox';
export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownOption } from './Dropdown';
export { Slider } from './Slider';
export type { SliderProps } from './Slider';

// Navigation & Segments
export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './SegmentedControl';
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

// Data Display & Indicators
export { PriorityBadge, StatusBadge, Badge } from './Badge';
export type { PriorityBadgeProps, StatusBadgeProps, PriorityLevel, IssueStatus, BadgeProps } from './Badge';
export { Kbd } from './Kbd';
export type { KbdProps } from './Kbd';
export { Progress } from './Progress';
export type { ProgressProps } from './Progress';
export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';
export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';
export { Accordion } from './Accordion';
export type { AccordionProps, AccordionItemProps } from './Accordion';

// Feedback (context-free states)
export { EmptyState, LoadingState } from './Feedback';
export type { EmptyStateProps } from './Feedback';

// Overlays & Modals
export { Modal } from './Modal';
export type { ModalProps } from './Modal';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog';
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './Popover';
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './Sheet';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './DropdownMenu';
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './Command';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

// Brand & Identity
export { UI99BrandLogo, SafaBrandLogo } from './SafaBrandLogo';
export type { UI99BrandLogoProps } from './SafaBrandLogo';

// Theme protocol (kit-local, no app context)
export { useIsDark, useThemeClass } from './theme';
export type { KitThemeMode } from './theme';

// =====================================================================
// WAVE A — layout & primitives (roster expansion toward 60+)
// =====================================================================

export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';
export { Label } from './Label';
export type { LabelProps } from './Label';
export { Toggle, toggleVariants } from './Toggle';
export type { ToggleProps } from './Toggle';
export { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
export type { ToggleGroupItemProps } from './ToggleGroup';
export { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
export { ScrollArea, ScrollBar } from './ScrollArea';
export { AspectRatio } from './AspectRatio';
export { FormField, FormHint, FormError } from './Field';
export type { FormFieldProps } from './Field';
export { Alert, alertVariants } from './Alert';
export type { AlertProps } from './Alert';
