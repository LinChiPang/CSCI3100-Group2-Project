export const allowedCuhkEmailDomains = [
  "cuhk.edu.hk",
  "link.cuhk.edu.hk",
  "ee.cuhk.edu.hk",
  "cse.cuhk.edu.hk",
  "ie.cuhk.edu.hk",
  "math.cuhk.edu.hk",
  "bme.cuhk.edu.hk",
  "phy.cuhk.edu.hk",
  "mae.cuhk.edu.hk",
  "seem.cuhk.edu.hk",
] as const;

const allowedCuhkEmailDomainSet = new Set<string>(allowedCuhkEmailDomains);

export function isAllowedCuhkEmailDomain(email: string): boolean {
  const parts = email.trim().split("@");
  if (parts.length !== 2) return false;

  return allowedCuhkEmailDomainSet.has(parts[1].toLowerCase());
}
