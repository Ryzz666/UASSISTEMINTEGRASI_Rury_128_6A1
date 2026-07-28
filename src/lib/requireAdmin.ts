import { auth } from "@/auth";
import { isAdminEmail } from "@/src/lib/admin";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false as const,
      response: Response.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdminEmail(session.user.email)) {
    return {
      ok: false as const,
      response: Response.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, session };
}
