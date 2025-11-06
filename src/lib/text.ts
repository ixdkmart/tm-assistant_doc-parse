export function cleanText(s: string) {
    return s.replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[•\t]+/g, "- ").trim();
  }
  
  /** Simple splitter. Later you can upgrade to header-aware multi-chunking. */
  export function splitLogicalSections(text: string): string[] {
    const parts = text.split(/\n(?=[A-Z][^\n]{0,80}\n)|\n\n/).map((t) => t.trim());
    return parts.filter(Boolean);
  }
  