export type CrTxt = {
  cr_id: number;
  rules_text: string;
  set_code: string;
  time_added: string;
};

export type CrContents = {
    cr_id: number;
    contents_json: string;
}

export type CrRule = {
  rule_number: string;
  rule_text: string;
  examples: string[];
};

export type CrContentsSection = {
  section_number: string;
    heading: string;
    subsections: CrContentsSubsection[];
}

export type CrContentsSubsection = {
  subsection_number: string;
  heading: string;
}