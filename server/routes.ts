import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertLaborerSchema,
  insertDutyEntrySchema,
  insertAdvanceEntrySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/laborers", async (req, res) => {
    try {
      const laborers = await storage.getAllLaborers();
      res.json(laborers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch laborers" });
    }
  });

  app.get("/api/laborers/:id", async (req, res) => {
    try {
      const laborer = await storage.getLaborer(req.params.id);
      if (!laborer) {
        return res.status(404).json({ error: "Laborer not found" });
      }
      res.json(laborer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch laborer" });
    }
  });

  app.post("/api/laborers", async (req, res) => {
    try {
      const validatedData = insertLaborerSchema.parse(req.body);
      const laborer = await storage.createLaborer(validatedData);
      res.status(201).json(laborer);
    } catch (error) {
      res.status(400).json({ error: "Invalid laborer data" });
    }
  });

  app.patch("/api/laborers/:id", async (req, res) => {
    try {
      const laborer = await storage.updateLaborer(req.params.id, req.body);
      if (!laborer) {
        return res.status(404).json({ error: "Laborer not found" });
      }
      res.json(laborer);
    } catch (error) {
      res.status(400).json({ error: "Failed to update laborer" });
    }
  });

  app.delete("/api/laborers/:id", async (req, res) => {
    try {
      const success = await storage.deleteLaborer(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Laborer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete laborer" });
    }
  });

  app.get("/api/laborers/:id/duty-entries", async (req, res) => {
    try {
      const entries = await storage.getDutyEntriesByLaborer(req.params.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch duty entries" });
    }
  });

  app.post("/api/duty-entries", async (req, res) => {
    try {
      const validatedData = insertDutyEntrySchema.parse(req.body);
      const entry = await storage.createDutyEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid duty entry data" });
    }
  });

  app.patch("/api/duty-entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateDutyEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Duty entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Failed to update duty entry" });
    }
  });

  app.delete("/api/duty-entries/:id", async (req, res) => {
    try {
      const success = await storage.deleteDutyEntry(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Duty entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete duty entry" });
    }
  });

  app.get("/api/laborers/:id/advance-entries", async (req, res) => {
    try {
      const entries = await storage.getAdvanceEntriesByLaborer(req.params.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch advance entries" });
    }
  });

  app.post("/api/advance-entries", async (req, res) => {
    try {
      const validatedData = insertAdvanceEntrySchema.parse(req.body);
      const entry = await storage.createAdvanceEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid advance entry data" });
    }
  });

  app.patch("/api/advance-entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateAdvanceEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Advance entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Failed to update advance entry" });
    }
  });

  app.delete("/api/advance-entries/:id", async (req, res) => {
    try {
      const success = await storage.deleteAdvanceEntry(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Advance entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete advance entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
