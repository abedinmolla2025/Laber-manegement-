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

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { 
  users, 
  laborers, 
  dutyEntries, 
  advanceEntries 
} from "@shared/schema";

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient);

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllLaborers(): Promise<Laborer[]> {
    return await db.select().from(laborers);
  }

  async getLaborer(id: string): Promise<Laborer | undefined> {
    const result = await db.select().from(laborers).where(eq(laborers.id, id));
    return result[0];
  }

  async createLaborer(laborer: InsertLaborer): Promise<Laborer> {
    const result = await db.insert(laborers).values(laborer).returning();
    return result[0];
  }

  async updateLaborer(id: string, laborer: Partial<InsertLaborer>): Promise<Laborer | undefined> {
    const result = await db.update(laborers).set(laborer).where(eq(laborers.id, id)).returning();
    return result[0];
  }

  async deleteLaborer(id: string): Promise<boolean> {
    const result = await db.delete(laborers).where(eq(laborers.id, id)).returning();
    return result.length > 0;
  }

  async getDutyEntriesByLaborer(laborerId: string): Promise<DutyEntry[]> {
    return await db.select().from(dutyEntries).where(eq(dutyEntries.laborerId, laborerId));
  }

  async createDutyEntry(entry: InsertDutyEntry): Promise<DutyEntry> {
    const result = await db.insert(dutyEntries).values(entry).returning();
    return result[0];
  }

  async updateDutyEntry(id: string, entry: Partial<InsertDutyEntry>): Promise<DutyEntry | undefined> {
    const result = await db.update(dutyEntries).set(entry).where(eq(dutyEntries.id, id)).returning();
    return result[0];
  }

  async deleteDutyEntry(id: string): Promise<boolean> {
    const result = await db.delete(dutyEntries).where(eq(dutyEntries.id, id)).returning();
    return result.length > 0;
  }

  async getAdvanceEntriesByLaborer(laborerId: string): Promise<AdvanceEntry[]> {
    return await db.select().from(advanceEntries).where(eq(advanceEntries.laborerId, laborerId));
  }

  async createAdvanceEntry(entry: InsertAdvanceEntry): Promise<AdvanceEntry> {
    const result = await db.insert(advanceEntries).values(entry).returning();
    return result[0];
  }

  async updateAdvanceEntry(id: string, entry: Partial<InsertAdvanceEntry>): Promise<AdvanceEntry | undefined> {
    const result = await db.update(advanceEntries).set(entry).where(eq(advanceEntries.id, id)).returning();
    return result[0];
  }

  async deleteAdvanceEntry(id: string): Promise<boolean> {
    const result = await db.delete(advanceEntries).where(eq(advanceEntries.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
