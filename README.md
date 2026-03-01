# 🍊 BuahKita — Platform Supplier Buah Segar

Platform e-commerce B2B/B2C untuk supplier buah segar yang melayani **konsumen langsung** dan **reseller** dengan sistem harga bertingkat, manajemen pesanan, dan fitur edukasi buah.

---

## 📁 Struktur Proyek

```
buahkita/
├── backend/          # REST API (Express.js + Prisma + PostgreSQL)
├── frontend/         # Web App (Next.js 14 + TypeScript + Tailwind CSS)
├── package.json      # Root scripts (concurrently)
└── README.md
```

---

## ⚙️ Tech Stack

| Layer    | Teknologi                                         |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State    | Zustand, TanStack React Query                     |
| Backend  | Express.js 5, TypeScript, Zod validation          |
| Database | PostgreSQL (Supabase), Prisma ORM                 |
| Auth     | JWT + HttpOnly Cookies (Access + Refresh Token)   |
| Upload   | Multer + Sharp (image processing)                 |
| Maps     | Leaflet + React-Leaflet                           |

---

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** database (atau Supabase)

### 1. Clone & Install

```bash
git clone <repo-url> buahkita
cd buahkita
npm run setup
```

> `npm run setup` akan menginstall semua dependencies di root, backend, dan frontend sekaligus, serta menjalankan `prisma generate`.

### 2. Konfigurasi Environment

**Backend** — buat file `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:6543/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# JWT
JWT_SECRET="your-jwt-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5010
NODE_ENV=development

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Frontend URL (CORS)
CLIENT_URL=http://localhost:3000
```

**Frontend** — buat file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5010/api/v1
```

### 3. Database Migration & Seed

```bash
npm run prisma:migrate
npm run prisma:seed
```

**Akun seed:**

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@buahkita.id | admin123 |
| Buyer | buyer@buahkita.id | buyer123 |

### 4. Jalankan Development Server

```bash
npm run dev
```

Ini akan menjalankan **backend** (port 5010) dan **frontend** (port 3000) secara bersamaan.

Atau jalankan terpisah:

```bash
npm run dev:backend    # http://localhost:5010
npm run dev:frontend   # http://localhost:3000
```

### 5. Build Production

```bash
npm run build
```

---

## 📋 Fitur Utama

### 🛒 Pembeli (Buyer)

- Katalog produk dengan filter (kategori, harga, musim, tags)
- Detail produk dengan galeri gambar
- Keranjang belanja dengan harga konsumen/reseller
- Checkout 5 langkah (Tipe Pembeli → Review → Pengiriman & Voucher → Konfirmasi → Sukses)
- Upload bukti pembayaran (transfer bank)
- Tracking status pesanan dengan timeline
- Review & rating produk
- Kuis edukasi buah
- Unduh invoice PDF

### 🔧 Admin

- Dashboard statistik (pendapatan, pesanan, produk, pengguna)
- CRUD Produk (gambar multiple, harga konsumen & reseller)
- Manajemen Pesanan (ubah status, lihat bukti bayar)
- Manajemen Banner (hero slider)
- Manajemen Voucher (kode diskon)
- Manajemen Kuis Edukasi
- Manajemen Peta Reseller
- Manajemen Pengguna

### 🗺️ Halaman Publik

- Homepage (banner slider, produk unggulan, testimonial)
- Tentang Kami (peta supplier & reseller via Leaflet)
- Halaman Produk dengan filter lengkap

---

## 🔌 API Endpoints

Base URL: `http://localhost:5010/api/v1`

| Method | Endpoint              | Deskripsi                 |
| ------ | --------------------- | ------------------------- |
| POST   | `/auth/register`      | Registrasi akun baru      |
| POST   | `/auth/login`         | Login                     |
| POST   | `/auth/refresh`       | Refresh token             |
| POST   | `/auth/logout`        | Logout                    |
| GET    | `/auth/me`            | Profil user yang login    |
| GET    | `/products`           | Daftar produk (+ filter)  |
| GET    | `/products/:slug`     | Detail produk             |
| GET    | `/categories`         | Daftar kategori           |
| GET    | `/cart`               | Keranjang user            |
| POST   | `/cart`               | Tambah item ke keranjang  |
| PATCH  | `/cart/:id`           | Update jumlah item        |
| DELETE | `/cart/:id`           | Hapus item dari keranjang |
| POST   | `/orders`             | Buat pesanan baru         |
| GET    | `/orders`             | Daftar pesanan user       |
| GET    | `/orders/:id`         | Detail pesanan            |
| POST   | `/orders/:id/pay`     | Upload bukti bayar        |
| POST   | `/orders/:id/review`  | Kirim review              |
| GET    | `/orders/:id/invoice` | Download invoice PDF      |
| POST   | `/vouchers/validate`  | Validasi kode voucher     |
| GET    | `/banners`            | Daftar banner aktif       |
| GET    | `/reviews/latest`     | Testimonial terbaru       |
| GET    | `/quiz/questions`     | Soal kuis edukasi         |
| POST   | `/quiz/submit`        | Submit jawaban kuis       |
| GET    | `/reseller-maps`      | Data peta reseller        |
| GET    | `/admin/stats`        | Statistik dashboard       |

---

## 📜 Script yang Tersedia

| Script                   | Deskripsi                                    |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Jalankan backend + frontend (concurrently)   |
| `npm run build`          | Build backend + frontend                     |
| `npm run setup`          | Install semua dependencies + prisma generate |
| `npm run prisma:migrate` | Jalankan database migration                  |
| `npm run prisma:seed`    | Seed data awal (admin + buyer + produk)      |
| `npm run prisma:studio`  | Buka Prisma Studio (GUI database)            |

---

## 📄 Lisensi

Private — Hanya untuk keperluan lomba.
