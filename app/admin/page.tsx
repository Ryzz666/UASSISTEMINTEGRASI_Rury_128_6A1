import { auth, signOut } from "@/auth";
import { isAdminEmail } from "@/src/lib/admin";
import { getAdminSummary } from "@/src/lib/summary";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdminEmail(session.user.email)) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Akses Ditolak</h1>
          <p className="mt-4 text-slate-700">
            Akun Anda tidak memiliki akses sebagai admin.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Login sebagai: {session.user.email}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </form>
        </div>
      </main>
    );
  }

  let data;
  let dataLoadError = false;

  try {
    data = await getAdminSummary();
  } catch (error) {
    console.error("Failed to render admin dashboard:", error);
    dataLoadError = true;

    data = {
      totalRespondents: 0,
      recentSubmissions: [],
    };
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
              <p className="mt-2 text-slate-600">
                Total pengirim masukan: <strong>{data.totalRespondents}</strong>
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                  Nama:{" "}
                  <strong className="text-slate-900">
                    {session.user.name ?? "-"}
                  </strong>
                </p>
                <p>
                  Email:{" "}
                  <strong className="text-slate-900">
                    {session.user.email ?? "-"}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row md:items-center">
              <a
                href="/api/admin/export"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Download Hasil Kuesioner
              </a>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        {dataLoadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Dashboard berhasil dibuka, tetapi data kuesioner belum bisa dimuat.
            Periksa koneksi database atau konfigurasi DATABASE_URL.
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Masukan Terbaru
          </h2>

          <div className="space-y-4">
            {data.recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <p className="font-semibold text-slate-900">{submission.name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(submission.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                  {submission.feedback}
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Gambar
                    </p>
                    {submission.imageUrl ? (
                      <a href={submission.imageUrl} target="_blank" rel="noreferrer">
                        <img
                          src={submission.imageUrl}
                          alt="Lampiran gambar"
                          className="max-h-64 w-full rounded-lg border border-slate-200 object-contain"
                        />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">Tidak ada gambar.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Screenshot
                    </p>
                    {submission.screenshotUrl ? (
                      <a
                        href={submission.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={submission.screenshotUrl}
                          alt="Lampiran screenshot"
                          className="max-h-64 w-full rounded-lg border border-slate-200 object-contain"
                        />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">Tidak ada screenshot.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {data.recentSubmissions.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Belum ada masukan yang masuk.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
