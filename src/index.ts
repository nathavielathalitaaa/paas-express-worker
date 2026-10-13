import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express from "express";

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  console.log(req.method + " " + req.url);
  next();
});

function validId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function fields(body: any) {
  return {
    name: typeof body?.name === "string" ? body.name.trim() : "",
    class_name: typeof body?.class_name === "string" ? body.class_name.trim() : "",
  };
}

app.get("/", (_req, res) => {
  res.json({ message: "Hello Express on Cloudflare Workers!", week: 6 });
});
app.get("/api/status", (_req, res) => {
  res.json({ status: "ok", subject: "PaaS", week: 5, platform: "Cloudflare Workers" });
});
app.get("/api/info", (_req, res) => {
  res.json({ framework: "Express", runtime: "Cloudflare Workers", course: "Platform as a Service" });
});
app.get("/api/log-test", (_req, res) => {
  console.log("Endpoint /api/log-test dipanggil");
  res.json({ logged: true });
});
app.get("/api/time", (_req, res) => {
  res.json({ time: new Date().toISOString() });
});
app.get("/hello/:name", (req, res) => {
  res.json({ message: "Halo, " + req.params.name });
});

app.get("/api/students", async (_req, res) => {
  try {
    const { results } = await env.DB.prepare(
      "SELECT id, name, class_name FROM students ORDER BY id DESC"
    ).all();
    res.json({ data: results });
  } catch (error) {
    console.error("READ ALL failed", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/students/:id", async (req, res) => {
  const id = validId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const student = await env.DB.prepare(
      "SELECT id, name, class_name FROM students WHERE id = ?"
    ).bind(id).first();
    if (!student) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ data: student });
  } catch (error) {
    console.error("READ ONE failed", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/students", async (req, res) => {
  const { name, class_name } = fields(req.body);
  if (!name || !class_name) {
    res.status(400).json({ error: "name and class_name are required" });
    return;
  }
  if (name.length > 100 || class_name.length > 100) {
    res.status(400).json({ error: "max 100 characters" });
    return;
  }
  try {
    const result = await env.DB.prepare(
      "INSERT INTO students (name, class_name) VALUES (?, ?)"
    ).bind(name, class_name).run();
    res.status(201).json({ id: result.meta.last_row_id, name, class_name });
  } catch (error) {
    console.error("CREATE failed", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  const id = validId(req.params.id);
  const { name, class_name } = fields(req.body);
  if (!id || !name || !class_name) {
    res.status(400).json({ error: "Valid ID, name and class_name required" });
    return;
  }
  if (name.length > 100 || class_name.length > 100) {
    res.status(400).json({ error: "max 100 characters" });
    return;
  }
  try {
    const result = await env.DB.prepare(
      "UPDATE students SET name = ?, class_name = ? WHERE id = ?"
    ).bind(name, class_name, id).run();
    if (result.meta.changes === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ id, name, class_name, updated: true });
  } catch (error) {
    console.error("UPDATE failed", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  const id = validId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const result = await env.DB.prepare(
      "DELETE FROM students WHERE id = ?"
    ).bind(id).run();
    if (result.meta.changes === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ deleted: true, id });
  } catch (error) {
    console.error("DELETE failed", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000);
export default httpServerHandler({ port: 3000 });
