// Only allow same-site relative paths as a post-login destination (?next=...),
// which guards against open redirects to other domains.
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return "/";
  }
  return next;
}
