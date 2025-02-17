import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertNoticeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
// Admin route for creating notices
app.post("/api/admin/notices", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
    return res.sendStatus(403);
  }

  const parsed = insertNoticeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const notice = await storage.createNotice({
    ...parsed.data,
    authorId: req.user.id,
  });
  res.status(201).json(notice);
});

  // Notice CRUD endpoints
  app.get("/api/notices", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const notices = await storage.getNotices();
    res.json(notices);
  });

  app.post("/api/notices", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role === 'student') return res.sendStatus(403);

    const parsed = insertNoticeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const notice = await storage.createNotice({
      ...parsed.data,
      authorId: req.user.id,
    });
    res.status(201).json(notice);
  });

  app.patch("/api/notices/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role === 'student') return res.sendStatus(403);

    const notice = await storage.getNotice(Number(req.params.id));
    if (!notice) return res.sendStatus(404);
    if (notice.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.sendStatus(403);
    }

    const parsed = insertNoticeSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const updated = await storage.updateNotice(Number(req.params.id), parsed.data);
    res.json(updated);
  });

  app.delete("/api/notices/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role === 'student') return res.sendStatus(403);

    const notice = await storage.getNotice(Number(req.params.id));
    if (!notice) return res.sendStatus(404);
    if (notice.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.sendStatus(403);
    }

    await storage.deleteNotice(Number(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
