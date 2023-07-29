import {CrContentsSection, CrRule} from "./types";

export function parseCr(rules_text: string): CrRule[] {
    let document = rules_text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    // We only care about the lines inbetween the first one that says "Credits" and the last one that says "Glossary". These lines are the rules.
    const creditsIndex = document.indexOf("Credits");
    const glossaryIndex = document.lastIndexOf("Glossary");
    document = document.slice(creditsIndex + 1, glossaryIndex);

    // Loop through the lines and parse them into rules
    const rules: CrRule[] = [];
    let currentRule: CrRule | null = null;
    for (const line of document) {
        // If a line matches /(^\d{3}\.\d{1,3}[a-z\.]) (.*)/ then it's a rule
        // If a line begins with "Example:" then it's an example
        const ruleMatch = line.match(/(^\d{3}\.\d{1,3}[a-z\.]) (.*)/);
        const exampleMatch = line.match(/Example: (.*)/);

        if (ruleMatch) {
            const ruleNumber = ruleMatch[1];
            const ruleText = ruleMatch[2];
            currentRule = {
                rule_number: ruleNumber,
                rule_text: ruleText,
                examples: [],
            };
            rules.push(currentRule);
        } else if (exampleMatch && currentRule) {
            currentRule.examples.push(exampleMatch[1]);
        }
    }

    return rules;
}

export function parseContents(rules_text: string): CrContentsSection[] {
    let document = rules_text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    const creditsIndex = document.indexOf("Contents");
    const glossaryIndex = document.indexOf("Glossary");
    document = document.slice(creditsIndex + 1, glossaryIndex);

    const sections: CrContentsSection[] = [];
    let currentSection: CrContentsSection | null = null;
    for (const line of document) {
        // If a line matches /^(\d{1,2})\. (.*)$/ then it's a section
        // If a line matches /^(\d{3})\. (.*)$/ then it's a subsection of the current section
        const sectionMatch = line.match(/^(\d{1,2})\. (.*)$/);
        const subsectionMatch = line.match(/^(\d{3})\. (.*)$/);

        if (sectionMatch) {
            const sectionNumber = sectionMatch[1];
            const heading = sectionMatch[2];
            currentSection = {
                section_number: sectionNumber,
                heading,
                subsections: [],
            };
            sections.push(currentSection);
        } else if (subsectionMatch && currentSection) {
            const subsectionNumber = subsectionMatch[1];
            const heading = subsectionMatch[2];
            currentSection.subsections.push({
                subsection_number: subsectionNumber,
                heading,
            });
        }
    }

    return sections;
}
