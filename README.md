This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google OAuth Admin Login

Project ini menambahkan Auth.js/NextAuth v5 beta dengan Google Provider untuk melindungi halaman dan API admin. Session memakai strategi JWT, tanpa tabel user/session tambahan di Prisma. Halaman kuesioner publik, submit kuesioner, dan endpoint daftar pertanyaan tetap bisa diakses tanpa login.

Perubahan utama:

- Login Google tersedia di `/login`.
- Tombol `Masuk Admin Lokal` tersedia di `/login` saat development untuk masuk sebagai admin tanpa Google OAuth.
- `/admin` mengarahkan user yang belum login ke `/login`.
- User yang login tetapi emailnya tidak ada di daftar admin akan melihat pesan `Akun Anda tidak memiliki akses sebagai admin.`
- Admin valid bisa melihat dashboard, nama, email, tombol logout, export CSV, summary, dan file lampiran.
- API `/api/admin/export`, `/api/admin/summary`, dan `/api/admin/submissions/[id]/file` mengembalikan `401` untuk belum login dan `403` untuk user non-admin.

### Setup Google OAuth

1. Buka Google Cloud Console.
2. Buat atau pilih project.
3. Aktifkan OAuth consent screen dan isi data aplikasi yang diminta.
4. Buat OAuth Client ID dengan tipe Web application.
5. Tambahkan Authorized redirect URI berikut untuk local development:

```bash
http://localhost:3000/api/auth/callback/google
```

6. Salin Client ID dan Client Secret ke environment variable.

### Environment Variables

Buat `.env` atau `.env.local` berdasarkan `.env.example`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
GOOGLE_CLIENT_ID="isi_client_id_google"
GOOGLE_CLIENT_SECRET="isi_client_secret_google"
# Alternatif nama env Auth.js v5 yang juga didukung:
# AUTH_GOOGLE_ID="isi_client_id_google"
# AUTH_GOOGLE_SECRET="isi_client_secret_google"
AUTH_SECRET="isi_secret_aplikasi"
AUTH_URL="http://localhost:3000"
ADMIN_EMAILS="admin@gmail.com,dosen@gmail.com"
```

Keterangan:

- `DATABASE_URL`: koneksi PostgreSQL untuk Prisma.
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID. Ini dipakai eksplisit oleh provider Google Auth.js.
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret. Ini dipakai eksplisit oleh provider Google Auth.js.
- `AUTH_GOOGLE_ID`: alternatif nama Auth.js v5 untuk Google OAuth Client ID. Jika `GOOGLE_CLIENT_ID` tidak ada, aplikasi memakai nilai ini.
- `AUTH_GOOGLE_SECRET`: alternatif nama Auth.js v5 untuk Google OAuth Client Secret. Jika `GOOGLE_CLIENT_SECRET` tidak ada, aplikasi memakai nilai ini.
- `AUTH_SECRET`: secret Auth.js untuk mengenkripsi JWT/cookie session.
- `AUTH_URL`: URL aplikasi, untuk local development gunakan `http://localhost:3000`.
- `ADMIN_EMAILS`: daftar email admin dipisahkan koma. Contoh: `admin@gmail.com,dosen@gmail.com`.

Untuk menambah atau mengubah admin, edit `ADMIN_EMAILS`, pisahkan setiap email dengan koma, lalu restart server development.

Saat `NODE_ENV` bukan `production`, halaman login juga menampilkan tombol `Masuk Admin Lokal`. Tombol ini memakai email admin pertama dari `ADMIN_EMAILS`, sehingga bisa dipakai untuk mengetes dashboard admin meskipun konfigurasi Google OAuth belum valid.

### Menjalankan Project

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

Setelah server berjalan, buka `http://localhost:3000`. Login admin tersedia di `http://localhost:3000/login`.
