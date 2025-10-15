import { 
  type User, 
  type InsertUser,
  type Laborer,
  type InsertLaborer,
  type DutyEntry,
  type InsertDutyEntry,
  type AdvanceEntry,
  type InsertAdvanceEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllLaborers(): Promise<Laborer[]>;
  getLaborer(id: string): Promise<Laborer | undefined>;
  createLaborer(laborer: InsertLaborer): Promise<Laborer>;
  updateLaborer(id: string, laborer: Partial<InsertLaborer>): Promise<Laborer | undefined>;
  deleteLaborer(id: string): Promise<boolean>;
  
  getDutyEntriesByLaborer(laborerId: string): Promise<DutyEntry[]>;
  createDutyEntry(entry: InsertDutyEntry): Promise<DutyEntry>;
  updateDutyEntry(id: string, entry: Partial<InsertDutyEntry>): Promise<DutyEntry | undefined>;
  deleteDutyEntry(id: string): Promise<boolean>;
  
  getAdvanceEntriesByLaborer(laborerId: string): Promise<AdvanceEntry[]>;
  createAdvanceEntry(entry: InsertAdvanceEntry): Promise<AdvanceEntry>;
  updateAdvanceEntry(id: string, entry: Partial<InsertAdvanceEntry>): Promise<AdvanceEntry | undefined>;
  deleteAdvanceEntry(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
