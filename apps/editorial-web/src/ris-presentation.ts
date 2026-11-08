/** Portal navigation is not a document-level event proof. No data is removed. */
export function isRisCollection(url: string | null | undefined): boolean {
  try {
    const u = new URL(url ?? "");
    return u.hostname === "buergerinfo-feldkirchen.digitalfabrix.de" &&
      (/^\/do\d+\.asp$/i.test(u.pathname) || /^\/si\d+\.asp$/i.test(u.pathname) && !u.searchParams.has("__ksinr"));
  } catch { return false; }
}
