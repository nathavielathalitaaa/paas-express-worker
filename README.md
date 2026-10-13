# paas-express-worker
Express + Cloudflare D1 (CRUD students) di Cloudflare Workers. Praktikum PaaS Minggu 5 dan 6.

URL live: https://paas-express-worker.nathaviela.workers.dev

## Perintah
- npm install
- npm run dev
- npx wrangler d1 migrations apply paas-students-db --local
- npx wrangler d1 migrations apply paas-students-db --remote
- npm run deploy
- npx wrangler tail

## Endpoint
- GET /, /api/status, /api/info, /api/log-test, /api/time, /hello/:name
- GET, POST /api/students
- GET, PUT, DELETE /api/students/:id

Catatan: Minggu 5 dan 6 digabung dalam satu repository; project dibuat ulang karena repository Minggu 5 sebelumnya tidak tersedia.
