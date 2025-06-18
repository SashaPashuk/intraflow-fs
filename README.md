# ✨ Fullstack File Manager (Senior Test Assignment)

## 🌐 Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, tRPC
- **Backend:** Fastify, tRPC, Zod, Prisma, KafkaJS
- **Storage:** MinIO (S3-compatible)
- **Database:** PostgreSQL
- **Monorepo:** PNPM + Turbo

---

## 📁 Project Structure

```bash
intraflow-fs/
│
├── apps/                       # Main applications
│   ├── api/                    # Fastify backend with tRPC
│   └── web/                    # Next.js frontend
│
├── packages/                  # Shared packages
│   ├── types/                 # Shared Zod schemas and DTO types (e.g., FileDTO, fileInputSchema)
│   ├── utils/                 # S3 and Kafka helper functions
│   └── ui/                    # Reusable UI components (e.g., UploadForm, FileList)
│
├── infrastructure/
│   ├── prisma/                # Prisma client & schema
│   └── jobs/s3-cleaner/       # Node.js cron job to clean orphaned S3 files
│
├── docker-compose.yml        # Infra stack (Postgres, Kafka, MinIO)
├── .env                      # Environment variables
├── README.md
└── package.json              # Root scripts
```

---

## 📦 Requirements

- **Node.js** >= 18
- **PNPM** >= 8 (used for monorepo workspace management)
- **Docker + Docker Compose** (required for infrastructure: PostgreSQL, MinIO, Kafka)

> If you don’t have PNPM installed:

```bash
npm install -g pnpm
```

---

## ⚙️ Getting Started 

### 1. Clone repo

```bash
git clone <repo-url>      # replace with actual repo URL
cd intraflow-fs
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

> Copy the `.env.example` file to `.env` and modify as needed:

```bash
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
```

All necessary environment variables (PostgreSQL, MinIO, Kafka, etc.) are included in `.env.example`.

### 4. Start infrastructure

```bash
pnpm docker:up
```

### 5. Create S3 bucket in MinIO

Open http://localhost:9001 and log in (minioadmin:minioadmin)
Create a bucket named:

```bash
intraflow-bucket
```

### 6. Set up Prisma

```bash
pnpm db:migrate
pnpm db:generate
```

### 7. Launch development servers

```bash
pnpm dev:api      # http://localhost:4000/trpc
pnpm dev:web      # http://localhost:3000
```

---

## 📎 Features

### 📁 Upload Files

- Multi-file upload
- Client-side limits (max 5 files, 50MB each)
- Progress bar with real-time percentage

### 🔍 File Listing

- Linked names to S3 URLs
- Delete files directly

### ❌ File Deletion

- Deletes from both DB and S3
- trpc.file.deleteFile

### 📬 Kafka Publishing

- Event `file_uploaded` sent to Kafka
- Includes file name, URL, and ID

### ♻️ S3 Cleaner Job

- Runs every minute via `node-cron`
- Scans S3, compares against DB
- Deletes unused/orphaned S3 files

```bash
pnpm s3:clean     # one-time run
pnpm s3:cron      # cron mode
```

---

## 🧩 Bonus Points

- ✅ Shared types via `packages/types`
- ✅ Kafka event producer
- ✅ Real progress bar via FileReader
- ✅ UI extracted to `packages/ui`
- ✅ CRON cleaner job
- ✅ Validations (zod, max size, file count)
- ✅ Polished structure & UX

---

## 🚀 Commands Reference

```bash
pnpm dev:web         # Launch frontend
pnpm dev:api         # Launch backend
pnpm docker:up       # Start infra (Postgres + Kafka + MinIO)
pnpm docker:down     # Stop containers
pnpm s3:clean        # Run S3 cleanup once
pnpm s3:cron         # Start CRON cleanup job
pnpm studio          # Open Prisma studio
```

---

## 🙏 Thank you

The test task has been fully completed, including all core and additional requirements.

Ready for review and feedback!

---
