import { Context } from "hono";
import { Database } from "bun:sqlite";
import { scrapeCr } from "../domain/scrape";

interface newTxtParams {
  set_code: string;
}

export async function newTxt(c: Context): Promise<Response> {
  try {
    const { set_code } = c.req.param() as unknown as newTxtParams;
    const db = new Database("resources/rules.db");
    const insert_query = db.query("INSERT INTO cr_txt (rules_text, set_code) VALUES (?,?)");
    const rules_text = await scrapeCr();
    insert_query.run(rules_text, set_code);

    return c.text(`Succsessfully added new txt with ${set_code} to the database`);
  } catch (e: any) {
    c.status(500);
    return c.text(e);
  }
}
