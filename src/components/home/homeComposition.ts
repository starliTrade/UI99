/**
 * UI99 — Home Composition Engine (Build 04)
 * The foundational projection layer that turns the Universal Object Graph
 * into a breathing, emotionally intelligent, beautifully composed personal world.
 *
 * Architecture:
 * Object Graph + Time/Date Context + User Preference → Composition Engine → Composed Home Surfaces
 */

import { BaseObject, ObjectType, ObjectStatus } from '../../core/types/objects';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type SpotlightDomain =
  | 'ATELIER'
  | 'MUSIC'
  | 'INSPIRATION'
  | 'MEMORY'
  | 'MOVEMENT'
  | 'READING'
  | 'TRAVEL'
  | 'REFLECTION';

export type HomeSurfaceType =
  | 'ATMOSPHERE'
  | 'EDITORIAL_MOMENT'
  | 'TODAY_RAIL'
  | 'PERSONAL_SPOTLIGHT'
  | 'ATELIER'
  | 'MUSIC'
  | 'MOVEMENT'
  | 'INSPIRATION'
  | 'MEMORY'
  | 'READING'
  | 'TRAVEL'
  | 'FORTUNE'
  | 'EXECUTION';

export interface TimelineScheduleItem {
  id: string;
  time: string;
  hour: number;
  minute: number;
  title: string;
  category: 'STUDIO' | 'LIFE' | 'PERSONAL' | 'REST' | 'RITUAL';
  description?: string;
  isCompleted?: boolean;
  objectId?: string;
  location?: string;
}

export interface HomeCompositionContext {
  currentTime: Date;
  selectedDate: Date;
  isToday: boolean;
  dayOfWeek: number;
  timeOfDay: TimeOfDay;
  objects: BaseObject[];
}

export interface HomeCompositionResult {
  timeOfDay: TimeOfDay;
  spotlightDomain: SpotlightDomain;
  primarySpotlightObject?: BaseObject;
  
  // Real domain-specific selectors
  songObject?: BaseObject;
  atelierProject?: BaseObject;
  sketchObject?: BaseObject;
  movementHabit?: BaseObject;
  inspirationItems: BaseObject[];
  memoryObject?: BaseObject;
  bookObject?: BaseObject;
  tripObject?: BaseObject;
  
  // Execution items
  scheduledTimelineItems: TimelineScheduleItem[];
  activeTasks: BaseObject[];
  activeHabits: BaseObject[];
  focusObject?: BaseObject;

  // Active surfaces sequence
  activeSurfaces: HomeSurfaceType[];
}

/**
 * Determine Time of Day cleanly
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Intelligent Object Graph Domain Selectors
 * Strict rule: REAL DATA ONLY, ordered by relevance and recency
 */

export function selectBestSong(objects: BaseObject[]): BaseObject | undefined {
  const songs = objects.filter(
    (o) => o.type === ObjectType.SONG && o.status !== ObjectStatus.TRASHED
  );
  if (songs.length === 0) return undefined;

  // Prefer pinned/active > recent > first
  return (
    songs.find((s) => s.status === ObjectStatus.PINNED || s.metadata?.isPlaying) ||
    songs.find((s) => s.metadata?.favorite) ||
    songs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
  );
}

export function selectBestFashionProject(objects: BaseObject[]): BaseObject | undefined {
  const fashionObjs = objects.filter(
    (o) =>
      (o.type === ObjectType.FASHION_PROJECT ||
        o.type === ObjectType.DESIGN ||
        (o.type === ObjectType.PROJECT &&
          (o.tags.includes('fashion') || o.tags.includes('atelier') || o.tags.includes('design')))) &&
      o.status !== ObjectStatus.TRASHED
  );
  if (fashionObjs.length === 0) return undefined;

  return (
    fashionObjs.find((o) => o.status === ObjectStatus.IN_PROGRESS || o.status === ObjectStatus.ACTIVE) ||
    fashionObjs.find((o) => o.status === ObjectStatus.PINNED) ||
    fashionObjs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
  );
}

export function selectBestSketch(objects: BaseObject[]): BaseObject | undefined {
  const sketches = objects.filter(
    (o) => o.type === ObjectType.SKETCH && o.status !== ObjectStatus.TRASHED
  );
  if (sketches.length === 0) return undefined;
  return sketches.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
}

export function selectBestMovementHabit(objects: BaseObject[]): BaseObject | undefined {
  const habits = objects.filter(
    (o) => o.type === ObjectType.HABIT && o.status !== ObjectStatus.TRASHED
  );
  if (habits.length === 0) return undefined;

  return (
    habits.find(
      (h) =>
        h.tags.includes('movement') ||
        h.tags.includes('pilates') ||
        h.tags.includes('wellness') ||
        h.tags.includes('walk') ||
        h.tags.includes('yoga')
    ) ||
    habits.find((h) => h.status === ObjectStatus.PINNED) ||
    habits[0]
  );
}

export function selectInspirationItems(objects: BaseObject[]): BaseObject[] {
  return objects.filter(
    (o) =>
      (o.type === ObjectType.PHOTO ||
        o.type === ObjectType.SKETCH ||
        o.tags.includes('inspiration') ||
        o.tags.includes('moodboard') ||
        o.tags.includes('aesthetic') ||
        o.tags.includes('art')) &&
      o.status !== ObjectStatus.TRASHED
  );
}

export function selectBestMemory(objects: BaseObject[], selectedDate: Date): BaseObject | undefined {
  const memories = objects.filter(
    (o) =>
      (o.type === ObjectType.MEMORY || o.type === ObjectType.JOURNAL_ENTRY) &&
      o.status !== ObjectStatus.TRASHED
  );
  if (memories.length === 0) return undefined;

  // Check if any memory matches the month and day ("On this day")
  const onThisDay = memories.find((m) => {
    const d = new Date(m.createdAt);
    return d.getMonth() === selectedDate.getMonth() && d.getDate() === selectedDate.getDate();
  });
  if (onThisDay) return onThisDay;

  // Otherwise return the most cherished or recent
  return (
    memories.find((m) => m.status === ObjectStatus.PINNED || m.metadata?.favorite) ||
    memories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
  );
}

export function selectBestBook(objects: BaseObject[]): BaseObject | undefined {
  const books = objects.filter(
    (o) => o.type === ObjectType.BOOK && o.status !== ObjectStatus.TRASHED
  );
  if (books.length === 0) return undefined;

  return (
    books.find((b) => b.status === ObjectStatus.IN_PROGRESS || b.status === ObjectStatus.ACTIVE) ||
    books.find((b) => b.status === ObjectStatus.PINNED) ||
    books[0]
  );
}

export function selectBestTrip(objects: BaseObject[]): BaseObject | undefined {
  const trips = objects.filter(
    (o) =>
      (o.type === ObjectType.TRIP ||
        o.type === ObjectType.PLACE ||
        (o.type === ObjectType.WISHLIST_ITEM && o.tags.includes('travel'))) &&
      o.status !== ObjectStatus.TRASHED
  );
  if (trips.length === 0) return undefined;

  return (
    trips.find((t) => t.status === ObjectStatus.ACTIVE || t.status === ObjectStatus.IN_PROGRESS) ||
    trips.find((t) => t.status === ObjectStatus.PINNED) ||
    trips[0]
  );
}

/**
 * Extract REAL schedule items for selectedDate from objects.
 * Never fabricates fake schedule items!
 */
export function extractRealTimelineItems(
  objects: BaseObject[],
  selectedDate: Date
): TimelineScheduleItem[] {
  const items: TimelineScheduleItem[] = [];
  const selDateString = selectedDate.toISOString().split('T')[0];

  // 1. Events on this date
  const events = objects.filter(
    (o) => o.type === ObjectType.EVENT && o.status !== ObjectStatus.TRASHED
  );
  for (const evt of events) {
    const evtDate = evt.metadata?.date || evt.metadata?.startDate || evt.createdAt;
    const evtDateStr = typeof evtDate === 'string' ? evtDate.split('T')[0] : '';
    if (evtDateStr === selDateString || evt.metadata?.recurring) {
      const timeStr = evt.metadata?.time || evt.metadata?.startTime || '10:00';
      const [h, m] = timeStr.split(':').map((v: string) => parseInt(v, 10) || 0);
      items.push({
        id: evt.id,
        objectId: evt.id,
        time: timeStr,
        hour: isNaN(h) ? 10 : h,
        minute: isNaN(m) ? 0 : m,
        title: evt.title,
        description: evt.description,
        category: (evt.metadata?.category as any) || 'STUDIO',
        location: evt.metadata?.location,
        isCompleted: evt.status === ObjectStatus.COMPLETED,
      });
    }
  }

  // 2. Scheduled Tasks with specific times on this date
  const tasks = objects.filter(
    (o) => o.type === ObjectType.TASK && o.status !== ObjectStatus.TRASHED
  );
  for (const task of tasks) {
    const dueDate = task.metadata?.dueDate || task.metadata?.scheduledDate;
    const dueDateStr = typeof dueDate === 'string' ? dueDate.split('T')[0] : '';
    if (dueDateStr === selDateString) {
      const timeStr = task.metadata?.dueTime || task.metadata?.time || '14:00';
      const [h, m] = timeStr.split(':').map((v: string) => parseInt(v, 10) || 0);
      items.push({
        id: task.id,
        objectId: task.id,
        time: timeStr,
        hour: isNaN(h) ? 14 : h,
        minute: isNaN(m) ? 0 : m,
        title: task.title,
        description: task.description,
        category: task.tags.includes('fashion') ? 'STUDIO' : 'LIFE',
        isCompleted: task.status === ObjectStatus.COMPLETED,
      });
    }
  }

  // 3. Sort chronologically by hour and minute
  return items.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
}

/**
 * Main Home Composition Calculator
 */
export function composeHomeExperience(ctx: HomeCompositionContext): HomeCompositionResult {
  const { currentTime, selectedDate, dayOfWeek, timeOfDay, objects } = ctx;

  // 1. Extract Real Objects
  const songObject = selectBestSong(objects);
  const atelierProject = selectBestFashionProject(objects);
  const sketchObject = selectBestSketch(objects);
  const movementHabit = selectBestMovementHabit(objects);
  const inspirationItems = selectInspirationItems(objects);
  const memoryObject = selectBestMemory(objects, selectedDate);
  const bookObject = selectBestBook(objects);
  const tripObject = selectBestTrip(objects);

  // 2. Extract Real Execution
  const scheduledTimelineItems = extractRealTimelineItems(objects, selectedDate);
  const activeTasks = objects.filter(
    (o) => o.type === ObjectType.TASK && o.status !== ObjectStatus.TRASHED
  );
  const activeHabits = objects.filter(
    (o) => o.type === ObjectType.HABIT && o.status !== ObjectStatus.TRASHED
  );
  const activeProjects = objects.filter(
    (o) => o.type === ObjectType.PROJECT && o.status !== ObjectStatus.TRASHED
  );

  const focusObject =
    activeProjects.find((p) => p.metadata?.priority === 'high') ||
    activeProjects[0] ||
    activeTasks.find((t) => t.metadata?.priority === 'high') ||
    activeTasks[0];

  // 3. Determine Contextual Personal Spotlight Domain
  let spotlightDomain: SpotlightDomain = 'ATELIER';
  let primarySpotlightObject: BaseObject | undefined = atelierProject;

  // Contextual priority rules:
  if (timeOfDay === 'morning') {
    if (movementHabit) {
      spotlightDomain = 'MOVEMENT';
      primarySpotlightObject = movementHabit;
    } else if (atelierProject) {
      spotlightDomain = 'ATELIER';
      primarySpotlightObject = atelierProject;
    }
  } else if (timeOfDay === 'afternoon') {
    if (atelierProject) {
      spotlightDomain = 'ATELIER';
      primarySpotlightObject = atelierProject;
    } else if (inspirationItems.length > 0) {
      spotlightDomain = 'INSPIRATION';
      primarySpotlightObject = inspirationItems[0];
    }
  } else if (timeOfDay === 'evening') {
    if (songObject) {
      spotlightDomain = 'MUSIC';
      primarySpotlightObject = songObject;
    } else if (memoryObject) {
      spotlightDomain = 'MEMORY';
      primarySpotlightObject = memoryObject;
    }
  } else {
    // Night
    if (bookObject) {
      spotlightDomain = 'READING';
      primarySpotlightObject = bookObject;
    } else if (tripObject) {
      spotlightDomain = 'TRAVEL';
      primarySpotlightObject = tripObject;
    } else if (songObject) {
      spotlightDomain = 'MUSIC';
      primarySpotlightObject = songObject;
    }
  }

  // Fallback to day-of-week rhythm if no specific match
  if (!primarySpotlightObject) {
    const weeklyRotation: SpotlightDomain[] = [
      'REFLECTION', // Sun
      'ATELIER',    // Mon
      'MUSIC',      // Tue
      'INSPIRATION',// Wed
      'MOVEMENT',   // Thu
      'READING',    // Fri
      'TRAVEL',     // Sat
    ];
    spotlightDomain = weeklyRotation[dayOfWeek % 7];
  }

  // 4. Construct Varied, Non-Monotonous Surface Rhythm
  // Visual Rhythm: ATMOSPHERE → EDITORIAL → TIME (TODAY RAIL) → SPOTLIGHT → LIVING MEDIA → CREATIVE → SANCTUARY → EXECUTION
  const activeSurfaces: HomeSurfaceType[] = [
    'ATMOSPHERE',
    'EDITORIAL_MOMENT',
    'TODAY_RAIL',
  ];

  // Add the primary spotlight
  if (spotlightDomain === 'ATELIER') {
    activeSurfaces.push('ATELIER');
  } else if (spotlightDomain === 'MUSIC') {
    activeSurfaces.push('MUSIC');
  } else if (spotlightDomain === 'MOVEMENT') {
    activeSurfaces.push('MOVEMENT');
  } else if (spotlightDomain === 'INSPIRATION') {
    activeSurfaces.push('INSPIRATION');
  } else if (spotlightDomain === 'MEMORY') {
    activeSurfaces.push('MEMORY');
  } else if (spotlightDomain === 'READING') {
    activeSurfaces.push('READING');
  } else if (spotlightDomain === 'TRAVEL') {
    activeSurfaces.push('TRAVEL');
  }

  // Secondary living surfaces with variety:
  // Pair media / visual rhythm so we don't repeat consecutive similar surfaces
  if (spotlightDomain !== 'MUSIC') {
    activeSurfaces.push('MUSIC');
  }
  if (spotlightDomain !== 'ATELIER') {
    activeSurfaces.push('ATELIER');
  }
  if (spotlightDomain !== 'INSPIRATION') {
    activeSurfaces.push('INSPIRATION');
  }
  activeSurfaces.push('FORTUNE');
  if (spotlightDomain !== 'MOVEMENT') {
    activeSurfaces.push('MOVEMENT');
  }
  if (spotlightDomain !== 'READING' && spotlightDomain !== 'MEMORY') {
    activeSurfaces.push('READING');
  }
  if (spotlightDomain !== 'TRAVEL') {
    activeSurfaces.push('TRAVEL');
  }
  if (spotlightDomain !== 'MEMORY') {
    activeSurfaces.push('MEMORY');
  }

  // Execution layer is anchored near the bottom so life comes first!
  activeSurfaces.push('EXECUTION');

  return {
    timeOfDay,
    spotlightDomain,
    primarySpotlightObject,
    songObject,
    atelierProject,
    sketchObject,
    movementHabit,
    inspirationItems,
    memoryObject,
    bookObject,
    tripObject,
    scheduledTimelineItems,
    activeTasks,
    activeHabits,
    focusObject,
    activeSurfaces,
  };
}
