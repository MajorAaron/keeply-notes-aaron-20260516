const emptyAttachmentMeta = Object.freeze({ available: false, label: "", ariaLabel: "" });

const attachmentSignals = [
  {
    tone: "pdf",
    label: "PDF",
    ariaLabel: "Contains a PDF attachment reference",
    pattern: /(?:\bpdf\b|\.[Pp][Dd][Ff]\b)/
  },
  {
    tone: "doc",
    label: "Doc",
    ariaLabel: "Contains a document attachment reference",
    pattern: /(?:\b(?:doc|document|brief|memo)\b|\.(?:docx?|rtf)\b)/i
  },
  {
    tone: "sheet",
    label: "Sheet",
    ariaLabel: "Contains a spreadsheet attachment reference",
    pattern: /(?:\b(?:sheet|spreadsheet|csv|xlsx?)\b|\.(?:xlsx?|csv|tsv)\b)/i
  },
  {
    tone: "deck",
    label: "Deck",
    ariaLabel: "Contains a presentation attachment reference",
    pattern: /(?:\b(?:deck|slides?|presentation|pptx?)\b|\.(?:pptx?|key)\b)/i
  },
  {
    tone: "image",
    label: "Image",
    ariaLabel: "Contains an image attachment reference",
    pattern: /(?:\b(?:image|screenshot|photo)\b|\.(?:png|jpe?g|gif|webp|heic|svg)\b)/i
  }
];

const fileReferencePattern = /\b[\w][\w ._-]{1,64}\.(?:pdf|docx?|rtf|xlsx?|csv|tsv|pptx?|key|png|jpe?g|gif|webp|heic|svg|zip)\b/i;
const genericAttachmentPattern = /\b(?:attached|attachment|file attached|see file|shared file|upload(?:ed)?|dropbox|drive file)\b/i;

export function getItemAttachmentMeta(text) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) {
    return { ...emptyAttachmentMeta };
  }

  const matches = attachmentSignals.filter((signal) => signal.pattern.test(value));
  if (matches.length > 1) {
    return {
      available: true,
      label: `${matches.length} files`,
      ariaLabel: `Contains ${matches.length} attachment types`,
      tone: "multiple"
    };
  }

  if (matches.length === 1) {
    const match = matches[0];
    return {
      available: true,
      label: match.label,
      ariaLabel: match.ariaLabel,
      tone: match.tone
    };
  }

  if (fileReferencePattern.test(value) || genericAttachmentPattern.test(value)) {
    return {
      available: true,
      label: "File",
      ariaLabel: "Contains an attachment or file reference",
      tone: "file"
    };
  }

  return { ...emptyAttachmentMeta };
}
