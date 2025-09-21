// lib/uploadedDoc.ts
const KEY = "uploaded_parsed_text";
export function saveUploadedParsedText(text: string) {
  try { localStorage.setItem(KEY, text || ""); } catch {}
}
export function getUploadedParsedText(): string {
  try { return localStorage.getItem(KEY) || ""; } catch { return ""; }
}
export function clearUploadedParsedText() {
  try { localStorage.removeItem(KEY); } catch {}
}
