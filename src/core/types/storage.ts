/**
 * SAFA — Storage & Search Types
 */

export interface StorageAsset {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl: string;
  createdAt: string;
  associatedObjectId?: string;
  ownerId: string;
}

export interface SearchQuery {
  query: string;
  types?: string[];
  tags?: string[];
  limit?: number;
}

export interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  snippet?: string;
  tags: string[];
  updatedAt: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  totalMatches: number;
  query: string;
}
