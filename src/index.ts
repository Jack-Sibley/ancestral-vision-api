import { Database } from "bun:sqlite";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { extractCr, getCr } from "./application/Cr";
import { extractContents, getContents } from "./application/Contents";
import { newTxt } from "./application/Txt";
import { syncDatabase } from "./application/SyncDatabase";

// Create database if it doesn't exist
const db = new Database("resources/rules.db", { create: true });
const createSql = await Bun.file("resources/rules.sql").text();
for (const sql of createSql.split(";")) {
  if (sql != "") {
    db.run(sql);
  }
}

// Check if environment variables are set
if (!Bun.env.API_USERNAME || !Bun.env.API_PASSWORD) {
  console.log(Bun.env);
  console.error("API_USERNAME, API_PASSWORD or PORT not set in .env file");
  throw new Error("API_USERNAME or API_PASSWORD not set in .env file");
}

// Create Hono app
const app = new Hono();
app.use("*", basicAuth({ username: Bun.env.API_USERNAME, password: Bun.env.API_PASSWORD }));
app.get("/new-txt/:set_code", newTxt);
app.get("/update-cr", extractCr);
app.get("/rules", getCr);
app.get("/update-contents", extractContents);
app.get("/contents", getContents);
app.get("/sync-database", syncDatabase);

export default {
  fetch: app.fetch,
  port: 8080,
  hostname: "0.0.0.0",
  development: false,
};

console.log(`Server started on port ${Bun.env.PORT}`);
