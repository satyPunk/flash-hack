import { User, InsertUser, Notice, InsertNotice } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createNotice(notice: InsertNotice & { authorId: number }): Promise<Notice>;
  getNotice(id: number): Promise<Notice | undefined>;
  getNotices(): Promise<Notice[]>;
  updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice | undefined>;
  deleteNotice(id: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notices: Map<number, Notice>;
  private currentUserId: number;
  private currentNoticeId: number;
  readonly sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.notices = new Map();
    this.currentUserId = 1;
    this.currentNoticeId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createNotice(notice: InsertNotice & { authorId: number }): Promise<Notice> {
    const id = this.currentNoticeId++;
    const newNotice: Notice = {
      ...notice,
      id,
      createdAt: new Date(),
    };
    this.notices.set(id, newNotice);
    return newNotice;
  }

  async getNotice(id: number): Promise<Notice | undefined> {
    return this.notices.get(id);
  }

  async getNotices(): Promise<Notice[]> {
    return Array.from(this.notices.values());
  }

  async updateNotice(id: number, notice: Partial<InsertNotice>): Promise<Notice | undefined> {
    const existing = await this.getNotice(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...notice };
    this.notices.set(id, updated);
    return updated;
  }

  async deleteNotice(id: number): Promise<void> {
    this.notices.delete(id);
  }
}

export const storage = new MemStorage();
