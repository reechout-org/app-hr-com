/**
 * Client-side checks aligned with FastAPI `validate_first_message_template`
 * and legacy Django validation (same allowed variables, brace rules).
 */

const ALLOWED = new Set(["candidate_name", "company_name", "interview_title"]);

const VAR_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;
const BRACE_BLOCK = /\{\{.*?\}\}/g;

/**
 * @returns `null` if valid, otherwise an error message for the user.
 */
export function validateFirstMessageTemplateClient(value: string | null | undefined): string | null {
  if (value == null) return "Intro message cannot be empty";
  const trimmed = value.trim();
  if (!trimmed) return "Intro message cannot be empty";

  const hasBraces = trimmed.includes("{{") || trimmed.includes("}}");
  if (!hasBraces) return null;

  const open = (trimmed.match(/\{\{/g) || []).length;
  const close = (trimmed.match(/\}\}/g) || []).length;
  if (open !== close) {
    return "Malformed template: unmatched {{ }}. Use {{ variable_name }} with matching pairs, or remove braces.";
  }

  const varNames: string[] = [];
  for (const m of trimmed.matchAll(new RegExp(VAR_PATTERN))) {
    if (m[1]) varNames.push(m[1]);
  }

  if (varNames.length === 0) {
    const blocks = trimmed.match(new RegExp(BRACE_BLOCK, "g")) || [];
    for (const block of blocks) {
      if (!new RegExp(VAR_PATTERN).test(block)) {
        return `Invalid template: "${block}". Use {{ variable_name }} with one of: ${[...ALLOWED].sort().join(", ")}.`;
      }
    }
    return "Template variables must use {{ variable_name }}.";
  }

  const invalid = varNames.filter((v) => !ALLOWED.has(v));
  if (invalid.length) {
    return `Invalid variable(s): ${[...new Set(invalid)].join(", ")}. Only these are allowed: ${[...ALLOWED].sort().join(", ")}.`;
  }

  for (const block of trimmed.match(new RegExp(BRACE_BLOCK, "g")) || []) {
    if (!new RegExp(VAR_PATTERN).test(block)) {
      return `Invalid template: "${block}". Use {{ variable_name }} format.`;
    }
  }

  return null;
}
