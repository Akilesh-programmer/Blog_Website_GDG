<div align="center">

# Blog Website (GDG Selection Project)

Modern full‑stack blog platform built with a secure Express/MongoDB backend and a performant React (Vite) + Tailwind CSS frontend. Implements core blogging features plus authentication, authorization, ownership‑based editing, likes, comments, and production‑grade security & DX tooling.

![Tech Stack](https://img.shields.io/badge/Backend-Express%205-green) ![DB](https://img.shields.io/badge/Database-MongoDB-brightgreen) ![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue) ![Styling](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC) ![Auth](https://img.shields.io/badge/Auth-JWT-orange)

</div>

## ✨ Key Features

| Area         | Capabilities                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| Blogging     | Create, list (paginated + searchable), view by slug, update (author only), delete (author only)        |
| Engagement   | Likes (toggle), comments (add / delete own comment)                                                    |
| Auth         | Signup, login, logout (httpOnly JWT cookie), protected routes, ownership authorization                 |
| Security     | Helmet, rate limiting, NoSQL injection + XSS sanitization, cookie flags, centralized error handling    |
| UX           | Responsive layout, loading & empty states, toast notifications, dark‑ready design tokens               |
| Architecture | Layered backend (models/controllers/routes), service abstraction on frontend, reusable hooks & context |
| Performance  | Lean list payload (minimal projection), server compression, client code-splitting ready (Vite)         |
| Code Quality | Modular structure, environment‑driven config, reusable factory handlers                                |

> Accessibility & extended SEO meta enhancements are slated (tracked in TODO) — current structure already semantic and easily extendable.

## 🗂️ Repository Structure

```
.
├── server/                # Express + Mongoose backend
│   ├── server.js          # Entry (DB connect + lifecycle handlers)
│   ├── app.js             # App bootstrap & middleware chain
│   ├── models/            # Mongoose schemas (User, Blog)
│   ├── controllers/       # Route handlers (auth, blog CRUD, likes, comments)
│   ├── routes/            # Express routers (users, blogs)
│   ├── utils/             # Helpers (AppError, async wrapper, query features)
│   └── config.env         # Environment variables (never commit secrets in prod)
│
├── client/                # React + Vite frontend
│   ├── index.html         # Base document (static meta + root mounts)
│   ├── src/
│   │   ├── main.jsx       # App bootstrap & router provider
│   │   ├── App.jsx        # Route definitions
│   │   ├── layouts/       # Root layout (navigation, container)
│   │   ├── pages/         # Page components (Home, Detail, Auth, New, 404)
│   │   ├── components/    # Reusable UI (cards, pagination, spinner)
│   │   ├── context/       # AuthContext (session state)
│   │   ├── hooks/         # Custom hooks (API abstraction)
│   │   ├── services/      # API service layer (axios + endpoints)
│   │   └── utils/         # Helpers (toast)
│   └── tailwind.config.js # Tailwind theme extensions
└── README.md              # Project documentation (this file)
```

## 🧱 Technology Stack

**Backend**: Node.js, Express 5, Mongoose 8, JSON Web Tokens, bcrypt

**Frontend**: React 19, Vite, React Router 6, Axios, Tailwind CSS (+ Typography plugin), React Hot Toast

**Security & Hardening**: Helmet, express-rate-limit, express-mongo-sanitize, xss-clean, cookie-parser, compression

**Developer Experience**: Nodemon (dev), modular services, centralized error handling, environment configuration

## 🔐 Authentication & Authorization

- Users authenticate via a login/signup endpoint returning a signed JWT set as an httpOnly cookie.
- Protected routes enforced by `protect` middleware; ownership checks ensure only authors can mutate their blogs.
- Passwords hashed with bcrypt; password change invalidates older tokens via timestamp comparison.

## 📝 Blog Model Highlights

- Slug auto-generated from title with collision resolution (incremental suffix).
- Estimated read time computed server-side.
- Embedded comments (author reference + timestamp) for locality and simpler retrieval on detail view.
- Likes stored as an array of user ObjectIds (toggle semantics).

## 📄 API Overview (v1)

Base URL (dev): `http://localhost:3000/api/v1`

| Method | Endpoint                       | Description      | Auth   | Notes                                                   |
| ------ | ------------------------------ | ---------------- | ------ | ------------------------------------------------------- |
| POST   | /users/signup                  | Create user      | Public | Sets JWT cookie                                         |
| POST   | /users/login                   | Login user       | Public | Sets JWT cookie                                         |
| GET    | /users/logout                  | Logout user      | Auth   | Clears cookie                                           |
| GET    | /blogs                         | List blogs       | Public | Query: `page`, `limit`, `search`, `tag`, `minimal=true` |
| POST   | /blogs                         | Create blog      | Auth   | Body filtered for allowed fields                        |
| GET    | /blogs/:id                     | Get blog by id   | Public | Populates author                                        |
| PATCH  | /blogs/:id                     | Update blog      | Author | Ownership enforced                                      |
| DELETE | /blogs/:id                     | Delete blog      | Author | Soft constraints                                        |
| GET    | /blogs/slug/:slug              | Get blog by slug | Public | Used by frontend detail                                 |
| POST   | /blogs/:id/like                | Toggle like      | Auth   | Returns updated blog                                    |
| POST   | /blogs/:id/comments            | Add comment      | Auth   | Body: `{ text }`                                        |
| DELETE | /blogs/:id/comments/:commentId | Delete comment   | Auth   | User must own comment                                   |

Error responses follow a consistent JSON operational error format via centralized handler.

## 🔍 Query Parameters (Listing)

`GET /blogs?search=react&page=2&limit=10&minimal=true&tag=frontend`

- `search`: Case-insensitive partial match on title & content.
- `page` & `limit`: Pagination controls (defaults applied server-side).
- `minimal=true`: Reduces payload to listing essentials for performance.
- `tag`: Filter by tag inclusion.

## 🧭 Frontend Architecture

| Layer                      | Responsibility                                       |
| -------------------------- | ---------------------------------------------------- |
| Services (`services/*.js`) | Encapsulate HTTP calls; keeps components declarative |
| Hooks (`useApi`)           | Standardize request lifecycle (loading/error/abort)  |
| Context (`AuthContext`)    | Session state + auth actions                         |
| Pages                      | Route-level orchestration (fetch + render)           |
| Components                 | Pure presentational / small interactive pieces       |
| Layouts                    | Shared chrome, navigation, theming containers        |

Axios interceptor unwraps `response.data` so components receive domain objects directly.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ (recommended LTS)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Clone

```bash
git clone https://github.com/Akilesh-programmer/Blog_Website_GDG.git
cd Blog_Website_GDG
```

### 3. Backend Environment

Create `server/config.env` (already present in dev — NEVER commit real secrets in production):

```dotenv
DATABASE=<your-mongodb-connection-string-without-password-placeholder>
DATABASE_PASSWORD=<your-db-password>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30
```

The code replaces `<PASSWORD>` token in `DATABASE` with `DATABASE_PASSWORD` before connecting.

### 4. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 5. Run Backend (Dev)

```bash
cd server
npm run dev
```

Backend starts on port 3000 by default (see `server/server.js` or set `PORT` in `config.env`). Adjust if needed.

### 6. Run Frontend (Dev)

```bash
cd client
npm run dev
```

Vite dev server (default port 5173) will proxy requests directly via absolute API base (configure below).

### 7. Frontend Environment (Optional)

You may create a `.env` in `client/` if deploying to a different backend origin:

```bash
VITE_API_BASE_URL=https://your-deployment.example.com/api/v1
```

If omitted, the frontend attempts `http://localhost:3000/api/v1` (fallback in `apiClient`).

## 🛠 NPM Scripts

### Backend

| Script               | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `npm run dev`        | Start dev server with Nodemon                                      |
| `npm start`          | Production start (plain node)                                      |
| `npm run start:prod` | Start with `NODE_ENV=production` (still nodemon in current config) |

### Frontend

| Script            | Purpose                               |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Vite dev server with HMR              |
| `npm run build`   | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally      |
| `npm run lint`    | Run ESLint over source                |

## 🔐 Security Posture

- Rate limiting mitigates brute-force & enumeration.
- Helmet sets secure HTTP headers.
- Input sanitized against NoSQL operator injection & XSS.
- JWT stored in httpOnly cookie (mitigates XSS token theft) with expiration controls.
- Centralized error handler prevents leaking stack traces in production.

## 📦 Performance Considerations

- Minimal projection on blog list reduces payload for listing view.
- Gzip compression via `compression` middleware.
- Client builds leverage Vite's fast dev pipeline and tree-shaking.

## 🧪 Testing (Future Scope)

You can introduce vitest/jest + supertest for:

- Auth flow (signup/login/protected route)
- Blog CRUD
- Like & comment actions

Not included yet to keep scope aligned with GDG selection timeline.

## ♿ Accessibility & SEO (Roadmap)

Planned incremental improvements:

- Dynamic document titles + meta descriptions per page
- Skip link & landmark roles
- Open Graph & Twitter cards for blog detail pages (title, excerpt)
- Color contrast validation & focus outlines

## ➕ Potential Enhancements

- Markdown support with sanitization (e.g. `marked` + DOMPurify on server)
- Image uploads (Cloudinary / S3) with signed URLs
- Tag management UI & tag cloud analytics
- Comment pagination / lazy loading
- Optimistic UI for likes & comments
- User profiles & avatar support

## 🧩 Design Principles

1. Separation of concerns (data access, business logic, presentation layers).
2. Least privilege & explicit ownership for mutations.
3. Progressive enhancement (features layered without breaking core experience).
4. Lean payloads for list endpoints; hydrate on demand in detail views.
5. Security first: sanitize early, validate inputs, minimize attack surface.

## 📬 API Error Format

Operational errors use:

```json
{
  "status": "fail",
  "message": "Resource not found"
}
```

Programming / unknown errors are generalized in production to avoid leaking internals.

## 🗄 Data Model (Simplified)

```mermaid
erDiagram
	USER ||--o{ BLOG : "authors"
	BLOG ||--o{ COMMENT : "contains"
	USER ||--o{ LIKE : "casts"

	USER {
		string name
		string email
		string password (hashed)
	}
	BLOG {
		string title
		string slug (unique)
		string content
		string[] tags
		number estimatedReadTime
		objectId authorUser
		objectId[] likes
		COMMENT[] comments
	}
	COMMENT {
		objectId user
		string text
		date createdAt
	}
	LIKE {
		objectId user
		objectId blog
	}
```

## 🚀 Deployment Notes

- Serve frontend as static build (e.g., Netlify, Vercel) pointing to hosted API (Render, Railway, Fly.io, or containerized).
- Ensure environment specific `VITE_API_BASE_URL` & production `config.env` secrets.
- Add process manager (PM2) or container orchestration for durability.

## 🤝 Contributing

Fork → Create feature branch → Commit (conventional messages recommended) → PR.

## 📄 License

Educational / portfolio project for GDG selection. No explicit license declared — treat as all-rights-reserved unless a LICENSE file is later added.

## 🙌 Acknowledgements

- Express & Mongoose ecosystems
- Tailwind CSS & Vite for rapid DX
- GDG selection context motivating production‑minded polish

---

Feel free to open an issue or suggestion to extend functionality or improve architecture.

</div>
