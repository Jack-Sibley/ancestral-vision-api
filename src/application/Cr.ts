import { Context } from "hono";
import { Database } from "bun:sqlite";
import { parseCr } from "../domain/parse";
import { CrTxt } from "../domain/types";

export function extractCr(c: Context): Response {
  const db = new Database("resources/rules.db");
  const get_query = db.query("SELECT cr_id, rules_text FROM cr_txt ORDER BY time_added DESC LIMIT 1;");
  const { cr_id, rules_text } = get_query.get() as CrTxt;

  const rules = parseCr(rules_text);

  const insert_query = db.query("INSERT INTO cr_json (cr_id, json) VALUES (?,?)");
  insert_query.run(cr_id, JSON.stringify(rules));

  return c.text(`Successfully extracted cr with id ${cr_id} and added it to the database`);
}

export function getCr(c: Context): Response {
  const db = new Database("resources/rules.db");
  // The cr_json table has two columns: cr_id and json.
  // cr_id is a foreign key to the cr_txt table, which has four columns: cr_id, rules_text, time_added, and set_code.
  // We want the cr_json.json of the most recently added cr_txt.cr_id.
  const get_query = db.query("SELECT cr_json.json FROM cr_json JOIN (SELECT cr_id FROM cr_txt ORDER BY time_added DESC LIMIT 1) AS latest_cr_txt ON cr_json.cr_id = latest_cr_txt.cr_id;");
  const { json } = get_query.get() as { json: string };
  return c.json(JSON.parse(json));
}
