import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const laborers = pgTable("laborers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }).notNull(),
  photo: text("photo"),
  address: text("address"),
});

export const insertLaborerSchema = createInsertSchema(laborers).omit({
  id: true,
}).extend({
  dailyRate: z.union([z.string(), z.number()]).transform(val => String(val)),
});

export type InsertLaborer = z.infer<typeof insertLaborerSchema>;
export type Laborer = typeof laborers.$inferSelect;

export const dutyEntries = pgTable("duty_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  laborerId: varchar("laborer_id").notNull().references(() => laborers.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  daily: numeric("daily", { precision: 10, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});

export const insertDutyEntrySchema = createInsertSchema(dutyEntries).omit({
  id: true,
}).extend({
  daily: z.union([z.string(), z.number()]).transform(val => String(val)),
  amount: z.union([z.string(), z.number()]).transform(val => String(val)),
});

export type InsertDutyEntry = z.infer<typeof insertDutyEntrySchema>;
export type DutyEntry = typeof dutyEntries.$inferSelect;

export const advanceEntries = pgTable("advance_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  laborerId: varchar("laborer_id").notNull().references(() => laborers.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});

export const insertAdvanceEntrySchema = createInsertSchema(advanceEntries).omit({
  id: true,
}).extend({
  amount: z.union([z.string(), z.number()]).transform(val => String(val)),
});

export type InsertAdvanceEntry = z.infer<typeof insertAdvanceEntrySchema>;
export type AdvanceEntry = typeof advanceEntries.$inferSelect;
