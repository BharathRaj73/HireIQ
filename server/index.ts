import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllJobs,
  getJobById,
  applyToJob,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus
} from "./routes/jobs";

// Simple localStorage polyfill for server
if (typeof global !== 'undefined' && !global.localStorage) {
  global.localStorage = {
    getItem: (key: string) => {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), `.storage/${key}.json`);
        return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        const fs = require('fs');
        const path = require('path');
        const dir = path.join(process.cwd(), '.storage');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${key}.json`), value);
      } catch (error) {
        console.error('Storage error:', error);
      }
    },
    removeItem: (key: string) => {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), `.storage/${key}.json`);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch {}
    }
  } as Storage;
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Job routes
  app.get("/api/jobs", getAllJobs);
  app.get("/api/jobs/:id", getJobById);
  app.post("/api/jobs/:id/apply", applyToJob);
  app.get("/api/jobs/:id/applications", getJobApplications);
  app.get("/api/applications", getUserApplications);
  app.patch("/api/applications/:id", updateApplicationStatus);

  return app;
}
