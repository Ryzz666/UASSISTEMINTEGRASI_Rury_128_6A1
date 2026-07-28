import { getAdminSummary } from "@/src/lib/summary";
import { requireAdmin } from "@/src/lib/requireAdmin";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const data = await getAdminSummary();
    return Response.json(data);
  } catch (error) {
    console.error("Failed to fetch admin summary:", error);
    return Response.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
