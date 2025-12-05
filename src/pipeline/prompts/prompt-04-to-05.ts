const PROMPT_04_TO_05 = `
You are populating additional data for a specific field ("{{FIELD_NAME}}") in an atomic knowledge object from a new additional source.

AKO (existing):
{{AKO_JSON}}

ADDITIONAL_SOURCE (the full markdown for this AKO's source or a related doc):
---
{{ADDITIONAL_SOURCE}}
---

TASK
Extract only information that is DIRECTLY and STRICTLY relevant to the AKO's core identity and the specific property being populated ("{{FIELD_NAME}}"). Return ONLY a JSON array of strings. Return [] (empty array) if nothing directly relevant is found.

RELEVANCE CHECK (CRITICAL)
Before extracting any information, verify it is DIRECTLY about the AKO's core subject:
- For Concepts: Information MUST directly relate to the term and definition. If the document section is about something else (even if mentioned in passing), REJECT it.
- For Procedures: Information MUST directly relate to the title and steps. If the document section describes a different process or procedure, REJECT it.
- For Entities: Information MUST directly relate to the name and description. If the document section is about a different entity or topic, REJECT it.

REJECT information that:
- Is from unrelated sections of the document (even if in the same file)
- Only mentions the AKO's subject in passing or tangentially
- Is about similar but different concepts/procedures/entities
- Would require significant interpretation to connect to the AKO's core identity
- Describes a process/procedure/concept where the AKO is only an actor or participant, not the core subject
  • Example: If the AKO is "canvas framing" but the document describes "art gallery setup" where canvas framing is just one step, REJECT the gallery setup information
  • Example: If the AKO is "buddy program" but the document describes "employee onboarding" where buddy program is just one component, REJECT the onboarding process information
  • Only include information if the AKO's subject IS the main topic being described, not just mentioned as part of something else

ONLY INCLUDE information that:
- Directly expands, clarifies, or provides context for the AKO's core identity
- Is explicitly about the same specific subject as the AKO
- Would be immediately recognizable as relevant to someone reading the AKO's term/definition, title/steps, or name/description
- Has the AKO's subject as the PRIMARY focus of the information, not just as a supporting element or actor in a different process

CORE SUBJECT TEST
Ask yourself: "Is this information primarily ABOUT the AKO's subject, or is the AKO's subject just mentioned/used within information about something else?"
- If the information is primarily about the AKO's subject → INCLUDE it
- If the information is primarily about something else, and the AKO's subject is just mentioned or used → REJECT it

RULES
- Use ONLY content present in ADDITIONAL_SOURCE. No outside knowledge. No invention.
- Preserve explicit legal/procedural wording verbatim when present.
- Include context if needed to understand the extracted text.
- Keep AU/NZ spelling found in the document (e.g., behaviour, organisation).
- Each array element should be a complete, meaningful snippet of information.
- Filter out empty strings and trim whitespace.
- When in doubt about relevance, REJECT the information (return []).

FIELD-SPECIFIC GUIDANCE FOR "{{FIELD_NAME}}"
{{FIELD_GUIDANCE}}

OUTPUT
Return ONLY a JSON array of strings. Examples:
- If found: ["snippet 1", "snippet 2", "snippet 3"]
- If nothing found: []

Do NOT include code fences, commentary, or any text outside the JSON array.
`;

// Field-specific guidance based on original prompt rules
export const FIELD_GUIDANCE: Record<string, string> = {
    pseudonyms: `PSEUDONYMS
- Add only naturally interchangeable phrases already used in workplace/legal contexts:
  • word-form variants, plain-language equivalents, recognised abbreviations (e.g., "Sex Discrimination Act 1984" → "SDA 1984")
- Do NOT add slang, nicknames, hierarchy implications, or invented acronyms.
- If none apply, return [].`,

    keywords: `KEYWORDS
- 8–15 concise search terms drawn from the document (actors, objects, actions, locations, laws, thresholds).
- Respect locale spelling. No slang or invented terms.`,

    additionalInfo: `ADDITIONAL INFO
- Use this field for core or contextual information that doesn't belong in examples, caveats, bestPractice, constraints, troubleshooting, or metrics.
- Information MUST be DIRECTLY about the AKO's core identity (term/definition for concepts, title/steps for procedures, name/description for entities).
- REJECT any information that is not explicitly and directly about the same specific subject as the AKO.
- If the document section is about a different topic, even if in the same file, REJECT it.`,

    examples: `EXAMPLES
- Short, realistic examples mentioned or clearly shown in the document.
- Include concrete instances or use cases.
- Examples MUST be DIRECTLY about the AKO's core identity (term/definition for concepts, title/steps for procedures, name/description for entities).
- REJECT examples that are about different subjects, even if mentioned in the same document.
- Only include examples that would clearly illustrate the AKO's specific subject.`,

    bestPractice: `BEST PRACTICE
- Explicit recommendations found in the document.
- Include guidance on how things should be done.`,

    caveats: `CAVEATS
- Explicit warnings or exceptions found in the document.
- Include important limitations or things to be aware of.`,

    constraints: `CONSTRAINTS
- Explicit requirements, eligibility criteria, or limits found in the document.
- Include conditions that must be met or boundaries that apply.`,

    troubleshooting: `TROUBLESHOOTING
- Explicit issues and their remedies found in the document.
- Include problem-solution pairs or diagnostic information.`,

    metrics: `METRICS
- Explicit numeric thresholds or limits with units (e.g., "BAC > 0.00%").
- Include measurable criteria or quantitative standards.`,
};

export default PROMPT_04_TO_05;
