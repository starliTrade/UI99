/**
 * UI99 — Typed API Client
 * Clean abstraction over the server endpoints with error handling.
 */

import { BaseObject, CreateObjectInput, UpdateObjectInput } from '../types/objects';
import { Relationship, CreateRelationshipInput } from '../types/relationships';
import { User, UserProfile } from '../types/auth';
import { AIExtractResult } from '../types/ai';
import { SearchResponse } from '../types/storage';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../safeStorage';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Module-scope storage access MUST be exception-safe: embedded preview
    // iframes / private browsing throw SecurityError here, killing app boot.
    this.token = safeGetItem('ui99_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      safeSetItem('ui99_auth_token', token);
    } else {
      safeRemoveItem('ui99_auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errMessage = `HTTP error ${response.status}`;
      try {
        const errJson = await response.json();
        errMessage = errJson.error || errJson.message || errMessage;
      } catch (_) {}
      throw new Error(errMessage);
    }

    return response.json();
  }

  // --- Auth ---
  async login(email?: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email || 'alex@ui99.dev' }),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // --- Objects ---
  async getObjects(filter?: { type?: string; status?: string; tag?: string }): Promise<{ objects: BaseObject[] }> {
    const params = new URLSearchParams();
    if (filter?.type) params.append('type', filter.type);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.tag) params.append('tag', filter.tag);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ objects: BaseObject[] }>(`/api/objects${query}`);
  }

  async getObject(id: string): Promise<{ object: BaseObject; relationships: Relationship[] }> {
    return this.request<{ object: BaseObject; relationships: Relationship[] }>(`/api/objects/${id}`);
  }

  async createObject(input: CreateObjectInput): Promise<{ object: BaseObject }> {
    return this.request<{ object: BaseObject }>('/api/objects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateObject(id: string, updates: UpdateObjectInput): Promise<{ object: BaseObject }> {
    return this.request<{ object: BaseObject }>(`/api/objects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteObject(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/objects/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Relationships ---
  async getObjectRelationships(objectId: string): Promise<{ relationships: Relationship[] }> {
    return this.request<{ relationships: Relationship[] }>(`/api/objects/${objectId}/relationships`);
  }

  async createRelationship(input: CreateRelationshipInput): Promise<{ relationship: Relationship }> {
    return this.request<{ relationship: Relationship }>('/api/relationships', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async deleteRelationship(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/relationships/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Search ---
  async search(query: string, types?: string[], tags?: string[]): Promise<SearchResponse> {
    return this.request<SearchResponse>('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, types, tags }),
    });
  }

  // --- AI ---
  async understandText(rawText: string): Promise<{ success: boolean; extraction: AIExtractResult }> {
    return this.request<{ success: boolean; extraction: AIExtractResult }>('/api/ai/understand', {
      method: 'POST',
      body: JSON.stringify({ rawText }),
    });
  }

  // --- SLO ---
  async getSLO(): Promise<{ slo: any }> {
    return this.request<{ slo: any }>('/api/slo');
  }

  async updateSLO(data: any): Promise<{ slo: any }> {
    return this.request<{ slo: any }>('/api/slo', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Storage ---
  async uploadAsset(dataUrl: string, name: string, mimeType: string, objectId?: string) {
    return this.request<{ asset: any }>('/api/storage/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, name, mimeType, objectId }),
    });
  }
}

export const api = new ApiClient();
