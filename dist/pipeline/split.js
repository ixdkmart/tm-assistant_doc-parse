// Splits by header-ish lines, then caps ~2k chars (~550-650 tokens) per chunk
export function splitSectionsForChunking(text) {
    const rawBlocks = text
        // break when a likely header line appears (Title Case, short)
        .split(/\n\s*(?=([A-Z][A-Za-z0-9 ()/\-]{3,80})\n)/g)
        .map(s => s.trim())
        .filter(Boolean);
    // Merge tiny blocks and cap to ~2k chars
    const chunks = [];
    let cur = "";
    const pushCur = () => { if (cur.trim())
        chunks.push(cur.trim()); cur = ""; };
    for (const b of rawBlocks) {
        const next = cur ? cur + "\n\n" + b : b;
        if (next.length > 2000) {
            if (cur)
                pushCur();
            if (b.length > 2000) {
                // Hard wrap super-long blocks
                for (let i = 0; i < b.length; i += 2000) {
                    chunks.push(b.slice(i, i + 2000).trim());
                }
            }
            else {
                cur = b;
            }
        }
        else {
            cur = next;
        }
    }
    pushCur();
    return chunks.length ? chunks : [text];
}
//# sourceMappingURL=split.js.map