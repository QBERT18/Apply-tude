/**
 * Convert an arbitrary string into a URL-safe kebab-case slug.
 * Strips diacritics, lowercases, replaces non-alphanumerics with hyphens,
 * trims leading/trailing hyphens, and caps length.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Build a unique slug for an application from its job and company names.
 * Appends a short random suffix so duplicates can coexist without DB lookups.
 */
export function generateApplicationSlug(
  jobName: string,
  companyName: string
): string {
  const base = [slugify(jobName), slugify(companyName)]
    .filter(Boolean)
    .join("-");
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : suffix;
}
