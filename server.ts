/**
 * UI99 — Design System & Component Registry
 * Express + Vite Server Entry Point
 */

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { AIService } from './server/ai.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Helper auth middleware
  const getAuthUser = (req: Request) => {
    // In this foundation build, default to studio user or authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    return db.getUserById('usr_safa_01');
  };

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      product: 'UI99 Design System',
      version: '1.0.0-build01',
      aiConfigured: AIService.isAvailable(),
      timestamp: new Date().toISOString(),
    });
  });

  // Auth: Login / Quick Access
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = db.getUserByEmail(email || 'safa@personal.os') || db.getUserById('usr_safa_01');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    res.json({
      token: `safa_sess_${Date.now()}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  });

  // Auth: Current User
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  });

  // Auth: Update Profile
  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const updated = db.updateUserProfile(user.id, req.body);
    res.json({ user: updated });
  });

  // Universal Objects: List / Filter
  app.get('/api/objects', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { type, status, tag } = req.query;
    const objects = db.getAllObjects(user.id, {
      type: type as string,
      status: status as string,
      tag: tag as string,
    });
    res.json({ objects });
  });

  // Universal Objects: Get Single
  app.get('/api/objects/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const obj = db.getObjectById(req.params.id, user.id);
    if (!obj) return res.status(404).json({ error: 'Object not found' });
    const relationships = db.getRelationshipsForObject(req.params.id);
    res.json({ object: obj, relationships });
  });

  // Universal Objects: Create
  app.post('/api/objects', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { type, title, description, metadata, tags, attachments, status, source, permissions } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and Type are required' });
    }

    const newObj = db.createObject({
      type,
      ownerId: user.id,
      title,
      description: description || '',
      metadata: metadata || {},
      tags: tags || [],
      attachments: attachments || [],
      permissions: permissions || { isPrivate: true },
      status: status || 'ACTIVE',
      source: source || 'MANUAL',
    });

    res.status(201).json({ object: newObj });
  });

  // Universal Objects: Update
  app.put('/api/objects/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const updated = db.updateObject(req.params.id, user.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Object not found or access denied' });
    res.json({ object: updated });
  });

  // Universal Objects: Delete
  app.delete('/api/objects/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const success = db.deleteObject(req.params.id, user.id);
    if (!success) return res.status(404).json({ error: 'Object not found' });
    res.json({ success: true, message: 'Object deleted' });
  });

  // Relationships: Get for Object
  app.get('/api/objects/:id/relationships', (req: Request, res: Response) => {
    const relationships = db.getRelationshipsForObject(req.params.id);
    res.json({ relationships });
  });

  // Relationships: Create Link
  app.post('/api/relationships', (req: Request, res: Response) => {
    const { type, sourceObjectId, targetObjectId, metadata } = req.body;
    if (!type || !sourceObjectId || !targetObjectId) {
      return res.status(400).json({ error: 'type, sourceObjectId, targetObjectId are required' });
    }
    const rel = db.createRelationship({
      type,
      sourceObjectId,
      targetObjectId,
      metadata: metadata || {},
    });
    res.status(201).json({ relationship: rel });
  });

  // Relationships: Delete Link
  app.delete('/api/relationships/:id', (req: Request, res: Response) => {
    const success = db.deleteRelationship(req.params.id);
    res.json({ success });
  });

  // Search Foundation: Exact & Full-text
  app.post('/api/search', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { query, types, tags } = req.body;
    const q = (query || '').toLowerCase().trim();

    const allObjects = db.getAllObjects(user.id);
    const results = allObjects.filter((obj) => {
      if (types && types.length > 0 && !types.includes(obj.type)) return false;
      if (tags && tags.length > 0 && !tags.some((t: string) => obj.tags.includes(t))) return false;
      if (!q) return true;

      const titleMatch = obj.title.toLowerCase().includes(q);
      const descMatch = (obj.description || '').toLowerCase().includes(q);
      const tagMatch = obj.tags.some((t) => t.toLowerCase().includes(q));
      const typeMatch = obj.type.toLowerCase().includes(q);
      return titleMatch || descMatch || tagMatch || typeMatch;
    });

    res.json({
      results: results.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        tags: r.tags,
        status: r.status,
        updatedAt: r.updatedAt,
      })),
      totalMatches: results.length,
      query: q,
    });
  });

  // AI Provider Abstraction: Understand & Extract
  app.post('/api/ai/understand', async (req: Request, res: Response) => {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'rawText is required' });
    }
    try {
      const extracted = await AIService.understandAndExtract(rawText);
      res.json({ success: true, extraction: extracted });
    } catch (err: any) {
      res.status(500).json({ error: 'AI understanding failed', details: err.message });
    }
  });

  // SLO Connection Foundation
  app.get('/api/slo', (req: Request, res: Response) => {
    res.json({ slo: db.getSLOConfig() });
  });

  app.put('/api/slo', (req: Request, res: Response) => {
    const updated = db.updateSLOConfig(req.body);
    res.json({ slo: updated });
  });

  // Data Export / Ownership
  app.get('/api/export', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const bundle = db.exportAllData(user.id);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=safa-export-${Date.now()}.json`);
    res.json(bundle);
  });

  // Storage: Upload Asset Metadata / Data
  app.post('/api/storage/upload', (req: Request, res: Response) => {
    const { name, mimeType, dataUrl, objectId } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'dataUrl is required' });
    }
    const asset = {
      id: `ast_${Date.now()}`,
      name: name || 'Attachment',
      mimeType: mimeType || 'image/jpeg',
      url: dataUrl,
      sizeBytes: Math.round(dataUrl.length * 0.75),
      uploadedAt: new Date().toISOString(),
    };
    res.json({ asset });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UI99] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
