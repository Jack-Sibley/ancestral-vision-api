import { Context } from "hono";
import { Database } from "bun:sqlite";
import { CrTxt } from "../domain/types";
import { parseContents, parseCr } from "../domain/parse";

export async function syncDatabase(c: Context): Promise<Response> {
  try {
    const db = new Database("resources/rules.db");
    const fetch_pending = db.query("SELECT * FROM cr_txt WHERE cr_id NOT IN (SELECT cr_id FROM cr_json)");

    const pending = fetch_pending.all() as CrTxt[];
    let cr_processed = pending.map((x) => {
      // console.log(parseCr(x.rules_text));
      return {
        cr_id: x.cr_id,
        rules: parseCr(x.rules_text),
      };
    });
    let contents_processed = pending.map((x) => {
      return {
        cr_id: x.cr_id,
        contents: parseContents(x.rules_text),
      };
    });

    const insert_cr = db.query("INSERT INTO cr_json (cr_id, json) VALUES (?,?)");
    const insert_contents = db.query("INSERT INTO cr_contents (cr_id, contents_json) VALUES (?,?)");
    cr_processed.forEach((x) => {
      insert_cr.run(x.cr_id, JSON.stringify(x.rules));
    });
    contents_processed.forEach((x) => {
      insert_contents.run(x.cr_id, JSON.stringify(x.contents));
    });

    return c.text("Successfully synced database");
  } catch (e: any) {
    c.status(500);
    return c.text(e);
  }
}
