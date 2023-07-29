import * as htmlparser2 from "htmlparser2";

const ruleRegex = /^https:\/\/media.wizards.com\/\d{4}\/downloads\/[^\n]*\.txt$/;

export async function scrapeCr(): Promise<string> {
    let ruleUrls: string[] = [];

    const parser = new htmlparser2.Parser({
        onopentag(name, attribs) {
            if (name === "a" && ruleRegex.exec(attribs.href)) {
                ruleUrls.push(attribs.href);
            }
        },
    });

    const html = await fetch("https://magic.wizards.com/en/rules").then((res) => res.text());
    parser.write(html);

    if (ruleUrls.length != 1) {
        throw new Error("Unexpected number of rule URLs found");
    }

    const ruleUrl = encodeURI(ruleUrls[0]);
    return await fetch(ruleUrl).then((res) => res.text());
}