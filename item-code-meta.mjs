const emptyCodeMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const codeFilePattern = /\b[\w][\w./_-]{0,80}\.(?:[cm]?jsx?|tsx?|mjs|cjs|py|rb|go|rs|php|java|kt|swift|sql|ya?ml|toml|json|css|scss|html|md|sh|zsh|fish|env)\b/i;
const codeFencePattern = /```|`[^`\n]{3,80}`/;
const commandPattern = /(?:^|[\s(>])(?:\$\s*)?(?:npm|npx|pnpm|yarn|node|python3?|pip3?|git|gh|curl|brew|docker|kubectl|netlify|vercel|ssh|scp|rsync|make|bun|uv)\s+[\w:@./-]/im;
const codeKeywordPattern = /\b(?:function|const|let|var|import|export|return|class|async|await|SELECT|INSERT|UPDATE|DELETE|CREATE TABLE)\b/;

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function getItemCodeMeta(text) {
  const value = normalizeText(text);
  if (!value) {
    return { ...emptyCodeMeta };
  }

  const hasCode = codeFencePattern.test(value) || codeFilePattern.test(value) || codeKeywordPattern.test(value);
  const hasCommand = commandPattern.test(value);

  if (hasCode && hasCommand) {
    return {
      available: true,
      label: "2 code cues",
      ariaLabel: "Contains code and command references",
      tone: "mixed"
    };
  }

  if (hasCommand) {
    return {
      available: true,
      label: "Cmd",
      ariaLabel: "Contains a command-line reference",
      tone: "command"
    };
  }

  if (hasCode) {
    return {
      available: true,
      label: "Code",
      ariaLabel: "Contains a code reference",
      tone: "code"
    };
  }

  return { ...emptyCodeMeta };
}
