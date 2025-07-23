// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  questions;
  sessions;
  currentUserId;
  currentQuestionId;
  currentSessionId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.questions = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentSessionId = 1;
    this.initializeQuestions();
  }
  initializeQuestions() {
    const questionData = [
      { "text": "Ban\xEDk Ostrava z\xEDskal sv\u016Fj prvn\xED titul mistra \u010Ceskoslovenska v roce 1976", "answer": "True" },
      { "text": "Ban\xEDk Ostrava byl zalo\u017Een v roce 1922 jako SK Slezsk\xE1 Ostrava", "answer": "True" },
      { "text": "V sez\xF3n\u011B 2003/2004 Ban\xEDk Ostrava vyhr\xE1l \u010Deskou nejvy\u0161\u0161\xED ligu", "answer": "True" },
      { "text": "Stadion Bazaly byl domovsk\xFDm stadionem Ban\xEDku a\u017E do roku 2014", "answer": "False" },
      { "text": "Ban\xEDk Ostrava odehr\xE1l sv\xE9 dom\xE1c\xED z\xE1pasy v sez\xF3n\u011B 2020/2021 na M\u011Bstsk\xE9m stadionu v Ostrav\u011B-V\xEDtkovic\xEDch", "answer": "True" },
      { "text": "Ban\xEDk Ostrava nikdy nehr\xE1l semifin\xE1le evropsk\xE9ho poh\xE1ru", "answer": "False" },
      { "text": "Ban\xEDk Ostrava vyhr\xE1l \u010Deskoslovenskou ligu celkem p\u011Btkr\xE1t", "answer": "False" },
      { "text": "Nejv\xEDce ligov\xFDch g\xF3l\u016F za Ban\xEDk Ostrava vst\u0159elil Milan Baro\u0161", "answer": "False" },
      { "text": "V roce 1980 Ban\xEDk vyhr\xE1l \u010Ceskoslovensk\xFD poh\xE1r", "answer": "True" },
      { "text": "Fanou\u0161ci ban\xEDku jsou p\u0159ezd\xEDv\xE1ni Chacha\u0159i", "answer": "True" },
      { "text": "Historicky nej\xFAsp\u011B\u0161n\u011Bj\u0161\xEDm tren\xE9rem Ban\xEDku je Ev\u017Een Hadamczik", "answer": "True" },
      { "text": "Ban\xEDk Ostrava nikdy nesestoupil do druh\xE9 ligy", "answer": "False" },
      { "text": "Milan Baro\u0161 ukon\u010Dil kari\xE9ru pr\xE1v\u011B v dresu Ban\xEDku Ostrava", "answer": "True" },
      { "text": "V 70. letech hr\xE1l za Ban\xEDk zn\xE1m\xFD \xFAto\u010Dn\xEDk V\xE1clav Dan\u011Bk", "answer": "False" },
      { "text": "Je nejlep\u0161\xEDm st\u0159elcem Ban\xEDku hr\xE1\u010D, kter\xFD dal p\u0159es 100 g\xF3l\u016F?", "answer": "True" },
      { "text": "Nejv\u011Bt\u0161\xEDmi rivaly Ban\xEDku jsou Sparta Praha a Sigma Olomouc", "answer": "True" },
      { "text": "Ban\xEDk Ostrava m\xE1 partnersk\xFD klub v Polsku", "answer": "True" },
      { "text": "V roce 2005 Ban\xEDk Ostrava sestoupil do druh\xE9 ligy", "answer": "False" },
      { "text": "Ban\xEDk Ostrava se \xFA\u010Dastnil z\xE1kladn\xED skupiny Ligy mistr\u016F UEFA", "answer": "False" },
      { "text": "P\u0159ed p\u0159est\u011Bhov\xE1n\xEDm na M\u011Bstsk\xFD stadion prob\u011Bhla rozs\xE1hl\xE1 rekonstrukce Bazal\u016F", "answer": "False" },
      { "text": "Ban\xEDk Ostrava hraje tradi\u010Dn\u011B v modro-b\xEDl\xFDch dresech", "answer": "True" },
      { "text": "Slavn\xFD obr\xE1nce Tom\xE1\u0161 Ujfalu\u0161i za\u010D\xEDnal kari\xE9ru v Ban\xEDku Ostrava", "answer": "True" },
      { "text": "Ban\xEDk Ostrava byl zalo\u017Een b\u011Bhem prvn\xED sv\u011Btov\xE9 v\xE1lky", "answer": "False" },
      { "text": "V historii Ban\xEDku nikdy nep\u016Fsobil \u017E\xE1dn\xFD zahrani\u010Dn\xED tren\xE9r", "answer": "False" },
      { "text": "Legend\xE1rn\xED brank\xE1\u0159 Jan La\u0161t\u016Fvka chytal za Ban\xEDk Ostrava", "answer": "True" },
      { "text": "Ban\xEDk Ostrava m\u011Bl v minulosti sekci h\xE1zen\xE9", "answer": "True" },
      { "text": "Z\xEDskal Ban\xEDk Ostrava n\u011Bkdy dom\xE1c\xED double (liga + poh\xE1r) b\u011Bhem jedn\xE9 sez\xF3ny?", "answer": "False" },
      { "text": "Ban\xEDk Ostrava nikdy nehr\xE1l fin\xE1le dom\xE1c\xEDho poh\xE1ru", "answer": "False" },
      { "text": "Z Ban\xEDku Ostrava vze\u0161lo n\u011Bkolik \u010Desk\xFDch reprezentant\u016F", "answer": "True" },
      { "text": "Kapit\xE1nem Ban\xEDku Ostrava v roce 2022 byl Daniel Holzer", "answer": "False" }
    ];
    questionData.forEach((q, index) => {
      const question = {
        id: index + 1,
        text: q.text,
        answer: q.answer
      };
      this.questions.set(question.id, question);
    });
    this.currentQuestionId = questionData.length + 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getAllQuizQuestions() {
    return Array.from(this.questions.values());
  }
  async createQuizSession(insertSession) {
    const id = this.currentSessionId++;
    const session = {
      id,
      score: insertSession.score || 0,
      totalQuestions: insertSession.totalQuestions || 0,
      completedAt: insertSession.completedAt || null
    };
    this.sessions.set(id, session);
    return session;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  answer: text("answer").notNull()
  // "True" or "False"
});
var quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  score: integer("score").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  completedAt: text("completed_at")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  text: true,
  answer: true
});
var insertQuizSessionSchema = createInsertSchema(quizSessions).pick({
  score: true,
  totalQuestions: true,
  completedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/quiz/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuizQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });
  app2.post("/api/quiz/sessions", async (req, res) => {
    try {
      const validatedData = insertQuizSessionSchema.parse(req.body);
      const session = await storage.createQuizSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
