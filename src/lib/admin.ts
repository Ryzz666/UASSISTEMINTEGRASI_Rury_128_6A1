const fallbackAdminEmail = "olryzskies@gmail.com";

export function getAdminEmails(): string[] {
  const rawAdminEmails = process.env.ADMIN_EMAILS ?? fallbackAdminEmail;

  return rawAdminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  return getAdminEmails().includes(normalizedEmail);
}
