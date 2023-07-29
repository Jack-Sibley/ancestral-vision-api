import { Context } from "hono";
import { Database } from "bun:sqlite";
import { parseContents } from "../domain/parse";
import { CrTxt } from "../domain/types";

export function extractContents(c: Context): Response {
  const db = new Database("resources/rules.db");
  const get_query = db.query("SELECT cr_id, rules_text FROM cr_txt ORDER BY time_added DESC LIMIT 1;");
  const { cr_id, rules_text } = get_query.get() as CrTxt;
  const rules = parseContents(rules_text);
  const insert_query = db.query("INSERT INTO cr_contents (cr_id, contents_json) VALUES (?,?)");
  insert_query.run(cr_id, JSON.stringify(rules));
  return c.text(`Successfully extracted contents with id ${cr_id} and added it to the database`);
}

export function getContents(c: Context): Response {
  const db = new Database("resources/rules.db");
  const get_query = db.query("SELECT contents_json FROM cr_contents JOIN (SELECT cr_id FROM cr_txt ORDER BY time_added DESC LIMIT 1) AS latest_cr_txt ON cr_contents.cr_id = latest_cr_txt.cr_id;");
  const { contents_json } = get_query.get();
  return c.json(JSON.parse(contents_json));
}
