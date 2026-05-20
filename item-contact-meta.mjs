const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g;

function uniqueMatches(text, pattern, normalize) {
  const seen = new Set();
  const matches = [];
  for (const match of String(text || "").matchAll(pattern)) {
    const raw = match[0];
    const key = normalize(raw);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    matches.push(raw.trim());
  }
  return matches;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits.length === 10 ? digits : "";
}

function describeEmail(email) {
  const [local = "contact", domain = ""] = String(email || "").split("@");
  if (!domain) return local;
  return `${local} at ${domain}`;
}

function describePhone(phone) {
  const digits = normalizePhone(phone);
  if (!digits) return "phone number";
  return `phone ending ${digits.slice(-4)}`;
}

export function getItemContactMeta(text) {
  const emails = uniqueMatches(text, emailPattern, normalizeEmail);
  const phones = uniqueMatches(text, phonePattern, normalizePhone);
  const total = emails.length + phones.length;

  if (!total) {
    return { available: false, label: "", ariaLabel: "" };
  }

  if (emails.length && phones.length) {
    return {
      available: true,
      label: `${total} contacts`,
      ariaLabel: `${total} contact details: ${emails.length} email ${emails.length === 1 ? "address" : "addresses"} and ${phones.length} phone ${phones.length === 1 ? "number" : "numbers"}`,
      tone: "mixed"
    };
  }

  if (emails.length > 1) {
    return {
      available: true,
      label: `${emails.length} emails`,
      ariaLabel: `${emails.length} email addresses, first is ${describeEmail(emails[0])}`,
      tone: "email"
    };
  }

  if (emails.length === 1) {
    return {
      available: true,
      label: "Email",
      ariaLabel: `Contains email address ${describeEmail(emails[0])}`,
      tone: "email"
    };
  }

  if (phones.length > 1) {
    return {
      available: true,
      label: `${phones.length} phones`,
      ariaLabel: `${phones.length} phone numbers, first is ${describePhone(phones[0])}`,
      tone: "phone"
    };
  }

  return {
    available: true,
    label: "Phone",
    ariaLabel: `Contains ${describePhone(phones[0])}`,
    tone: "phone"
  };
}
