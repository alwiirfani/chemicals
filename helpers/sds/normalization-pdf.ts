export function normalizeFileName(baseName: string) {
  let safeName = baseName.replace(/[\\/#?%&:*<>|{}\[\]]/g, "_");

  safeName = safeName.replace(/\s+/g, "-");

  safeName = safeName.toLowerCase();

  if (!safeName.toLowerCase().endsWith(".pdf")) {
    safeName += ".pdf";
  }

  return safeName;
}
