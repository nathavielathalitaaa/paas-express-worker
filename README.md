# paas-express-worker

**Deskripsi singkat**

Aplikasi Express yang dijalankan pada Cloudflare Workers dengan penyimpanan data menggunakan Cloudflare D1. Projek ini menggabungkan materi Minggu 5 (setup dasar Express & endpoint statis) dan Minggu 6 (CRUD lengkap untuk tabel `students`).

**Perintah utama**

```bash
# instalasi dependensi
npm install

# jalankan server development (wrangler dev)
npm run dev

# migrasi database secara lokal
npx wrangler d1 migrations apply paas-students-db --local

# migrasi database ke remote (akan meminta konfirmasi)
npx wrangler d1 migrations apply paas-students-db --remote

# deploy ke Cloudflare Workers
npm run deploy
```

**Daftar endpoint**

*__Minggu 5 (static & util)__*
- `GET /` – `{"message":"Hello Express on Cloudflare Workers!","week":6}`
- `GET /api/status` – `{"status":"ok","subject":"PaaS","week":5,"platform":"Cloudflare Workers"}`
- `GET /api/info` – `{"framework":"Express","runtime":"Cloudflare Workers","course":"Platform as a Service"}`
- `GET /api/log-test` – logs ke console dan mengembalikan `{ "logged": true }`
- `GET /api/time` – `{ "time": "<ISO‑timestamp>" }`
- `GET /hello/:name` – `{ "message": "Halo, <name>" }`

*__Minggu 6 (CRUD students)__*
- `GET /api/students` – daftar semua mahasiswa (`id`,`name`,`class_name`).
- `GET /api/students/:id` – detail satu mahasiswa, 400 bila ID tidak valid, 404 bila tidak ada.
- `POST /api/students` – buat mahasiswa baru, body `{ "name":"...","class_name":"..." }`, 201 dengan `id` baru.
- `PUT /api/students/:id` – update mahasiswa, body sama, 400 bila tidak valid, 404 bila tidak ada.
- `DELETE /api/students/:id` – hapus mahasiswa, 400 bila tidak valid, 404 bila tidak ada.

**URL live**

https://paas-express-worker.nathaviela.workers.dev

**Catatan**

> Minggu 5 dan 6 digabung dalam satu repository; project dibuat ulang karena repository Minggu 5 sebelumnya tidak tersedia.
