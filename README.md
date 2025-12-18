# blog_api

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Run with Docker (API + MongoDB)

1. Build and start the stack:
   ```bash
   docker-compose up --build
   ```
2. The API listens on `http://localhost:3000` and MongoDB on `mongodb://localhost:27017`.
3. Environment variables come from `.env`, but `DB_URL` is overridden to use the dockerized Mongo instance (`mongodb://mongodb:27017/blog_api`).
4. The container uses the `dev` script (`bun run dev`) so it mirrors local dev behavior with watch mode.
