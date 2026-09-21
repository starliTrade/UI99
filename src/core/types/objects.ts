/**
 * UI99 — Universal Object Model
 * Core foundational abstraction for all entities across the Life OS.
 */

export enum ObjectType {
  // Core Productive
  TASK = 'TASK',
  NOTE = 'NOTE',
  IDEA = 'IDEA',
  PROJECT = 'PROJECT',
  GOAL = 'GOAL',
  HABIT = 'HABIT',
  EVENT = 'EVENT',
  REMINDER = 'REMINDER',

  // Media & Binary
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',

  // Culture & Knowledge
  BOOK = 'BOOK',
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
  SONG = 'SONG',
  PLAYLIST = 'PLAYLIST',

  // Personal & Emotional
  MEMORY = 'MEMORY',
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  MOOD = 'MOOD',
  PERSON = 'PERSON',
  PLACE = 'PLACE',

  // Creative & Studio
  SKETCH = 'SKETCH',
  DESIGN = 'DESIGN',
  FASHION_PROJECT = 'FASHION_PROJECT',
  COLLECTION = 'COLLECTION',
  WISHLIST_ITEM = 'WISHLIST_ITEM',
  TRIP = 'TRIP',

  // Intelligence
  AI_INSIGHT = 'AI_INSIGHT',
}

export enum ObjectStatus {
  INBOX = 'INBOX',
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  TRASHED = 'TRASHED',
  PINNED = 'PINNED',
}

export enum ObjectSource {
  MANUAL = 'MANUAL',
  QUICK_CAPTURE = 'QUICK_CAPTURE',
  AI_EXTRACT = 'AI_EXTRACT',
  VOICE = 'VOICE',
  IMPORT = 'IMPORT',
  SLO_SHARE = 'SLO_SHARE',
}

export interface ObjectAttachment {
  id: string;
  name: string;
  type: string; // mime-type
  url: string;
  sizeBytes?: number;
  uploadedAt: string;
}

export interface ObjectPermissions {
  isPrivate: boolean;
  allowedUserIds?: string[];
  allowSLOAccess?: boolean;
  canEdit?: boolean;
  canComment?: boolean;
}

export interface BaseObject {
  id: string;
  type: ObjectType;
  ownerId: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  title: string;
  description?: string;
  metadata: Record<string, any>;
  tags: string[];
  relations?: string[]; // Array of Relationship IDs
  attachments?: ObjectAttachment[];
  permissions: ObjectPermissions;
  status: ObjectStatus;
  source: ObjectSource;
  version: number;
}

export interface CreateObjectInput {
  type: ObjectType;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  attachments?: ObjectAttachment[];
  status?: ObjectStatus;
  source?: ObjectSource;
  permissions?: Partial<ObjectPermissions>;
}

export interface UpdateObjectInput {
  type?: ObjectType;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  attachments?: ObjectAttachment[];
  status?: ObjectStatus;
  permissions?: Partial<ObjectPermissions>;
}

export interface ObjectFilter {
  types?: ObjectType[];
  statuses?: ObjectStatus[];
  tags?: string[];
  ownerId?: string;
  search?: string;
  source?: ObjectSource;
}
