// Add or remove dealers here.
// In production, replace with a database lookup + hashed passwords.
export const DEALERS: Record<string, string> = {
  "demo dealer": "demo123",
  "test": "test",
  "bobcat connecticut": "bobcat2026",
};

export function checkCredentials(name: string, password: string): boolean {
  const key = name.trim().toLowerCase();
  return DEALERS[key] === password;
}
