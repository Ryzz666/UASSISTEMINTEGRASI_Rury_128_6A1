import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  Configuration:
    "Login Google belum bisa dipakai. Periksa kecocokan Google Client ID dan Client Secret.",
  AccessDenied: "Akses login ditolak oleh penyedia akun.",
  Verification: "Link verifikasi tidak valid atau sudah kedaluwarsa.",
  OAuthSignin: "Gagal memulai login Google. Silakan coba lagi.",
  OAuthCallback: "Google tidak dapat memverifikasi login. Silakan coba lagi.",
  OAuthAccountNotLinked:
    "Email ini sudah terhubung dengan metode login lain.",
  CallbackRouteError: "Terjadi masalah saat memproses login Google.",
  Default: "Login gagal. Silakan coba lagi.",
};

function getLoginErrorMessage(error: string | string[] | undefined): string | null {
  if (!error) {
    return null;
  }

  const errorKey = Array.isArray(error) ? error[0] : error;
  return errorMessages[errorKey] ?? errorMessages.Default;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const params = await searchParams;
  const errorMessage = getLoginErrorMessage(params.error);
  const showLocalAdminLogin = process.env.NODE_ENV !== "production";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Admin
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Login Admin</h1>
          <p className="text-sm text-slate-600">
            Masuk dengan akun Google yang terdaftar sebagai admin.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Login dengan Google
          </button>
        </form>

        {showLocalAdminLogin && (
          <form
            action={async () => {
              "use server";
              await signIn("admin-local", { redirectTo: "/admin" });
            }}
            className="mt-3"
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Masuk Admin Lokal
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
