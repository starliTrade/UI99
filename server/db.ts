/**
 * SAFA — Server Persistent Data Store
 * Universal Object & Relationship Database Layer
 */

import fs from 'fs';
import path from 'path';

export interface BaseObjectDoc {
  id: string;
  type: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  metadata: Record<string, any>;
  tags: string[];
  relations?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    sizeBytes?: number;
    uploadedAt: string;
  }>;
  permissions: {
    isPrivate: boolean;
    allowedUserIds?: string[];
    allowSLOAccess?: boolean;
    canEdit?: boolean;
    canComment?: boolean;
  };
  status: string;
  source: string;
  version: number;
}

export interface RelationshipDoc {
  id: string;
  type: string;
  sourceObjectId: string;
  targetObjectId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  permissions?: {
    isPrivate: boolean;
  };
}

export interface UserDoc {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  profile: {
    name: string;
    persianName: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    themePreference: string;
    preferredLanguage: 'en' | 'fa';
    rtlEnabled: boolean;
    captureShortcuts: string[];
  };
  createdAt: string;
  lastLoginAt: string;
}

export interface DatabaseSchema {
  users: UserDoc[];
  objects: BaseObjectDoc[];
  relationships: RelationshipDoc[];
  assets: any[];
  sloConnection: {
    connectionId: string;
    connectionName: string;
    isConnected: boolean;
    defaultAccess: string;
    allowedObjectTypes: string[];
    canViewMoments: boolean;
    canViewCalendar: boolean;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'safa_database.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr_safa_01',
      email: 'safa@personal.os',
      name: 'Safa',
      passwordHash: 'safa_secure_pass',
      profile: {
        name: 'Safa',
        persianName: 'صفا',
        email: 'safa@personal.os',
        avatarUrl: '',
        bio: 'Calm mind, creative visions, intentional life.',
        themePreference: 'warm-paper',
        preferredLanguage: 'en',
        rtlEnabled: false,
        captureShortcuts: ['Task', 'Note', 'Idea', 'Sketch', 'Memory'],
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
  ],
  sloConnection: {
    connectionId: 'slo_conn_01',
    connectionName: 'SLO',
    isConnected: true,
    defaultAccess: 'NO_ACCESS',
    allowedObjectTypes: ['PHOTO', 'MEMORY', 'TRIP'],
    canViewMoments: true,
    canViewCalendar: false,
  },
  objects: [
    {
      id: 'obj_01',
      type: 'PROJECT',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Spring Capsule Wardrobe & Aesthetics',
      description: 'Curating serene neutral silhouettes, linen textures, and minimalist tailoring for the upcoming season.',
      metadata: { progress: 65, category: 'Creative / Fashion', priority: 'high' },
      tags: ['fashion', 'aesthetic', 'minimal', 'spring'],
      permissions: { isPrivate: true, allowSLOAccess: false },
      status: 'IN_PROGRESS',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_02',
      type: 'TASK',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Review fabric swatch samples for Atelier project',
      description: 'Check silk-linen blend weights and drape qualities.',
      metadata: { dueDate: new Date(Date.now() + 86400000).toISOString(), priority: 'high' },
      tags: ['atelier', 'design', 'urgent'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'QUICK_CAPTURE',
      version: 1,
    },
    {
      id: 'obj_03',
      type: 'NOTE',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Principles of Visual Restraint',
      description: 'Luxury is defined by what is left unsaid. Space is breathing room for the soul. Elegance lies in the precision of proportion.',
      metadata: { wordCount: 140, readingTimeMinutes: 1 },
      tags: ['philosophy', 'design', 'quotes'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_04',
      type: 'IDEA',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Monochromatic Ceramic Vases Collection',
      description: 'Hand-thrown terracotta with off-white matte glaze and asymmetric handles.',
      metadata: { stage: 'concept' },
      tags: ['ceramics', 'craft', 'art'],
      permissions: { isPrivate: true },
      status: 'INBOX',
      source: 'QUICK_CAPTURE',
      version: 1,
    },
    {
      id: 'obj_05',
      type: 'HABIT',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Morning Matcha & 15-min Breathwork',
      description: 'Silent morning reflection before opening digital notifications.',
      metadata: { streak: 12, targetDaysPerWeek: 7, timeOfDay: 'morning' },
      tags: ['wellness', 'ritual', 'calm'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_06',
      type: 'BOOK',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'In Praise of Shadows',
      description: 'Junichiro Tanizaki — An essay on Japanese aesthetics, light, shadow, and architecture.',
      metadata: { author: 'Junichiro Tanizaki', rating: 5, status: 'reading', progressPages: 64 },
      tags: ['reading', 'aesthetics', 'architecture'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_07',
      type: 'MEMORY',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Golden Sunset at Côte d’Azur',
      description: 'Gentle Mediterranean sea breeze, warm espresso on the terrace, conversations with SLO about future architectural dreams.',
      metadata: { location: 'Antibes, France', mood: 'serene', season: 'Autumn' },
      tags: ['travel', 'memories', 'slo', 'peace'],
      permissions: { isPrivate: true, allowSLOAccess: true },
      status: 'PINNED',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_08',
      type: 'JOURNAL_ENTRY',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Finding Clarity in Simplicity (صفای درون)',
      description: 'Today I felt a profound sense of lightness. Removing the unnecessary reveals the timeless.',
      metadata: { mood: 'peaceful', language: 'en-fa' },
      tags: ['journal', 'reflection', 'clarity'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_09',
      type: 'SONG',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Spiegel im Spiegel (Mirror in Mirror)',
      description: 'Arvo Pärt, Vladimir Spivakov — Minimalist ambient classical for deep creative focus.',
      metadata: {
        artist: 'Arvo Pärt',
        album: 'Alina',
        duration: '9:32',
        genre: 'Neoclassical / Ambient',
        mood: 'Calm & Contemplative',
        tempo: 'Largo',
        coverGradient: 'from-[#1A1829] via-[#0E0E14] to-[#12131C]',
      },
      tags: ['music', 'ambient', 'focus', 'peace'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_10',
      type: 'TRIP',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Amalfi Coast & Positano Dream Retreat',
      description: 'Cliffside terraced lemon groves, Mediterranean ceramic workshops, and quiet coastal writing spots.',
      metadata: {
        status: 'Dreaming',
        season: 'Late Spring',
        location: 'Amalfi, Italy',
        wishlist: ['Ravello cliffside villa', 'Handcrafted paper museum', 'Sunset aperitivo overlooking Faraglioni'],
        dreamLevel: 'high',
      },
      tags: ['travel', 'italy', 'dreaming', 'aesthetic'],
      permissions: { isPrivate: true, allowSLOAccess: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_11',
      type: 'FASHION_PROJECT',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Autumn Capsule: Draped Silk & Structured Wool',
      description: 'Architectural lapels, fluid oyster-white silk trousers, and double-faced anthracite cashmere overcoats.',
      metadata: {
        category: 'Atelier Collection',
        stage: 'Fabric Sourcing & Draping',
        palette: ['#E7DFD5', '#24242A', '#8F7E6B', '#141418'],
        fabrics: ['Mulberry Silk (22mm)', 'Merino Wool Twill', 'Raw Linen Weave'],
        silhouette: 'Architectural Minimalist',
      },
      tags: ['atelier', 'fashion', 'design', 'capsule'],
      permissions: { isPrivate: true },
      status: 'IN_PROGRESS',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_12',
      type: 'PHOTO',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Kyoto Zen Stone Garden & Morning Mist',
      description: 'Minimalist raked gravel patterns framing weathered moss stones at dawn.',
      metadata: {
        category: 'Inspiration',
        location: 'Ryoan-ji, Kyoto',
        aspectRatio: '4:3',
        palette: ['#3A3B43', '#8C8C96', '#E2E2E6'],
      },
      tags: ['inspiration', 'architecture', 'zen', 'minimalism'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'QUICK_CAPTURE',
      version: 1,
    },
    {
      id: 'obj_13',
      type: 'SKETCH',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Asymmetric Lapel & Flowing Hem Silhouette',
      description: 'Charcoal and wash sketch exploring fluid drape lines vs sharp geometric collars.',
      metadata: {
        medium: 'Charcoal & Digital Ink',
        collectionRef: 'obj_11',
      },
      tags: ['sketch', 'design', 'atelier'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
    {
      id: 'obj_14',
      type: 'HABIT',
      ownerId: 'usr_safa_01',
      createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Restorative Movement & Spine Alignment',
      description: 'Gentle 30-minute floor Pilates, spine mobility, and mindful stretching.',
      metadata: {
        streak: 18,
        targetDaysPerWeek: 6,
        category: 'Movement',
        durationMinutes: 30,
        timeOfDay: 'evening',
      },
      tags: ['movement', 'wellness', 'pilates', 'restoration'],
      permissions: { isPrivate: true },
      status: 'ACTIVE',
      source: 'MANUAL',
      version: 1,
    },
  ],
  relationships: [
    {
      id: 'rel_01',
      type: 'PART_OF',
      sourceObjectId: 'obj_02',
      targetObjectId: 'obj_01',
      metadata: { notes: 'Task directly progresses the Atelier Spring Collection' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rel_02',
      type: 'INSPIRED_BY',
      sourceObjectId: 'obj_01',
      targetObjectId: 'obj_06',
      metadata: { notes: 'Color palette influenced by Tanizaki’s shadow aesthetics' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rel_03',
      type: 'RELATED_TO',
      sourceObjectId: 'obj_03',
      targetObjectId: 'obj_08',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  assets: [],
};

class DataStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read persistent DB file, using memory store', e);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist data to file:', e);
    }
  }

  // --- Users ---
  getUserByEmail(email: string): UserDoc | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserDoc | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user: UserDoc): UserDoc {
    this.data.users.push(user);
    this.saveData(this.data);
    return user;
  }

  updateUserProfile(userId: string, profileUpdates: Partial<UserDoc['profile']>): UserDoc | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;
    user.profile = { ...user.profile, ...profileUpdates };
    this.saveData(this.data);
    return user;
  }

  // --- Objects ---
  getAllObjects(ownerId: string, filter?: { type?: string; status?: string; tag?: string }): BaseObjectDoc[] {
    return this.data.objects.filter((obj) => {
      if (obj.ownerId !== ownerId) return false;
      if (filter?.type && obj.type !== filter.type) return false;
      if (filter?.status && obj.status !== filter.status) return false;
      if (filter?.tag && !obj.tags.includes(filter.tag)) return false;
      return true;
    });
  }

  getObjectById(id: string, ownerId?: string): BaseObjectDoc | undefined {
    return this.data.objects.find((obj) => obj.id === id && (!ownerId || obj.ownerId === ownerId));
  }

  createObject(objData: Omit<BaseObjectDoc, 'id' | 'createdAt' | 'updatedAt' | 'version'>): BaseObjectDoc {
    const newObj: BaseObjectDoc = {
      ...objData,
      id: `obj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: objData.tags || [],
      metadata: objData.metadata || {},
      permissions: objData.permissions || { isPrivate: true },
    };
    this.data.objects.unshift(newObj);
    this.saveData(this.data);
    return newObj;
  }

  updateObject(id: string, ownerId: string, updates: Partial<BaseObjectDoc>): BaseObjectDoc | undefined {
    const index = this.data.objects.findIndex((o) => o.id === id && o.ownerId === ownerId);
    if (index === -1) return undefined;
    const existing = this.data.objects[index];
    const updated: BaseObjectDoc = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    };
    this.data.objects[index] = updated;
    this.saveData(this.data);
    return updated;
  }

  deleteObject(id: string, ownerId: string): boolean {
    const index = this.data.objects.findIndex((o) => o.id === id && o.ownerId === ownerId);
    if (index === -1) return false;
    this.data.objects.splice(index, 1);
    // Also remove related relationships
    this.data.relationships = this.data.relationships.filter(
      (rel) => rel.sourceObjectId !== id && rel.targetObjectId !== id
    );
    this.saveData(this.data);
    return true;
  }

  // --- Relationships ---
  getRelationshipsForObject(objectId: string): RelationshipDoc[] {
    return this.data.relationships.filter(
      (rel) => rel.sourceObjectId === objectId || rel.targetObjectId === objectId
    );
  }

  getAllRelationships(): RelationshipDoc[] {
    return this.data.relationships;
  }

  createRelationship(relData: Omit<RelationshipDoc, 'id' | 'createdAt' | 'updatedAt'>): RelationshipDoc {
    const newRel: RelationshipDoc = {
      ...relData,
      id: `rel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.relationships.push(newRel);
    this.saveData(this.data);
    return newRel;
  }

  deleteRelationship(id: string): boolean {
    const idx = this.data.relationships.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.data.relationships.splice(idx, 1);
    this.saveData(this.data);
    return true;
  }

  // --- SLO & Permissions ---
  getSLOConfig() {
    return this.data.sloConnection;
  }

  updateSLOConfig(updates: Partial<DatabaseSchema['sloConnection']>) {
    this.data.sloConnection = { ...this.data.sloConnection, ...updates };
    this.saveData(this.data);
    return this.data.sloConnection;
  }

  // --- Full Export / Backup ---
  exportAllData(ownerId: string) {
    const user = this.getUserById(ownerId);
    const objects = this.data.objects.filter((o) => o.ownerId === ownerId);
    const objIds = new Set(objects.map((o) => o.id));
    const relationships = this.data.relationships.filter(
      (r) => objIds.has(r.sourceObjectId) || objIds.has(r.targetObjectId)
    );
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      system: 'SAFA Personal Life OS',
      user: user ? { id: user.id, email: user.email, name: user.name, profile: user.profile } : null,
      objects,
      relationships,
      sloConnection: this.data.sloConnection,
    };
  }
}

export const db = new DataStore();
