const emptyBillingMeta = Object.freeze({ available: false, label: "", ariaLabel: "", tone: "" });

const billingCues = [
  {
    type: "invoice",
    label: "Invoice",
    tone: "invoice",
    pattern: /\b(?:invoice|invoices|invoicing|billable|billing statement|statement #?\d*)\b/i
  },
  {
    type: "payment",
    label: "Payment",
    tone: "payment",
    pattern: /\b(?:payment due|pay(?:ment)? by|paid by|autopay|auto-pay|card charge|charge card|credit card|debit card|bank transfer|wire transfer)\b/i
  },
  {
    type: "subscription",
    label: "Subscription",
    tone: "subscription",
    pattern: /\b(?:subscription|subscribe|renewal|renews? (?:on|at|next)|monthly plan|annual plan|membership fee|trial ends?|free trial)\b/i
  },
  {
    type: "refund",
    label: "Refund",
    tone: "refund",
    pattern: /\b(?:refund|reimbursement|expense report|receipt|receipts|return credit|chargeback)\b/i
  }
];

const blockedCuePattern = /\b(?:technical debt|sleep debt|debit card design|charge ahead|free trial branch|subscription pattern|reactive subscription|event subscription|invoice component|payment pipeline|refund policy draft|receipt parser)\b/i;

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function getItemBillingMeta(text) {
  const value = normalizeText(text);
  if (!value || blockedCuePattern.test(value)) {
    return { ...emptyBillingMeta };
  }

  const matches = billingCues.filter((cue) => cue.pattern.test(value));
  if (!matches.length) {
    return { ...emptyBillingMeta };
  }

  if (matches.length > 1) {
    return {
      available: true,
      label: `${matches.length} billing`,
      ariaLabel: `Contains ${matches.length} billing cues`,
      tone: "multiple"
    };
  }

  const [match] = matches;
  return {
    available: true,
    label: match.label,
    ariaLabel: `Contains a ${match.label.toLowerCase()} billing cue`,
    tone: match.tone
  };
}
