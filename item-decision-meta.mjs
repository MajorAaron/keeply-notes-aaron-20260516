const emptyDecisionMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const decisionSignals = [
  {
    tone: "approved",
    label: "Approved",
    ariaLabel: "Contains an approval or sign-off decision",
    pattern: /\b(?:approved|approval granted|signed off|sign[ -]?off|greenlit|go-ahead|go ahead|accepted)\b/i
  },
  {
    tone: "rejected",
    label: "Rejected",
    ariaLabel: "Contains a rejected or declined decision",
    pattern: /\b(?:rejected|declined|denied|not approved|no-go|no go|won't proceed|will not proceed)\b/i
  },
  {
    tone: "decision",
    label: "Decision",
    ariaLabel: "Contains decision language",
    pattern: /\b(?:decision|decided|decide on|final call|call is|we chose|chosen|selected|pick(?:ed)?|agreed to|settled on)\b/i
  }
];

export function getItemDecisionMeta(text) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) {
    return { ...emptyDecisionMeta };
  }

  const match = decisionSignals.find((signal) => signal.pattern.test(value));
  if (!match) {
    return { ...emptyDecisionMeta };
  }

  return {
    available: true,
    label: match.label,
    ariaLabel: match.ariaLabel,
    tone: match.tone
  };
}
