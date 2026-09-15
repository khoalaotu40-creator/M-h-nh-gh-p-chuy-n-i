# Project Architecture Guidelines for AI Agents

## Overview

This project is a full-stack application explicitly separated into a TypeScript frontend and a Python backend.

- **Frontend**: Built with React, TypeScript, Vite, and Tailwind CSS. Located in `/front-end`.
- **Backend**: Built with Python and FastAPI. Located in `/backend`.
- **Orchestration**: A Node.js Express server (`/server.ts`) acts as a reverse proxy, serving the frontend on port 3000 and proxying all `/api/*` requests to the Python backend running on port 3001.

## Rules & Constraints for AI Agents

1. **Strict Separation of Concerns**:
   - All client-side UI, components, and state management MUST remain in `/front-end/src`.
   - All server-side logic, database connections, AI model integration, and API routes MUST remain in `/backend`.
   - Do NOT add Node.js API routes in `server.ts`. It exists exclusively to serve Vite in development, serve static files in production, and proxy `/api` traffic to Python.

2. **Backend Development (Python)**:
   - Framework: `FastAPI` (run via `uvicorn`).
   - Use `pydantic` for type validation and response models.
   - Entry point: `backend/main.py`.
   - Update `backend/requirements.txt` if any new Python packages are needed, and explicitly run `pip install -r backend/requirements.txt` when adding them.

3. **Frontend Development (TypeScript)**:
   - Framework: React 18+ with Vite.
   - Styling: Tailwind CSS.
   - Ensure you use relative paths appropriately considering the `front-end` directory structure.
   - API Calls: The frontend MUST communicate with the backend exclusively via `/api/*` endpoints.

4. **Package Management & Scripts**:
   - The root `package.json` uses `concurrently` to run both the Python backend and the Node.js proxy server during development.
   - Do not alter the ports (Node on 3000, Python on 3001) as they are tightly coupled with the deployment environment constraints.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Python 3.10+, FastAPI, Uvicorn
- **Root Server**: Node.js, Express, http-proxy-middleware

## AI Agent Skills Directory

This project maintains a knowledge base of advanced coding patterns and rules, stored in the `agent/skills/` directory. AI Agents MUST refer to these skill files when performing related tasks:

- **`agent/skills/frontend-linting.md`**: Strict ESLint (Flat Config), Prettier, Husky, and CI gate setups.
- **`agent/skills/react-architecture.md`**: Component modularity, `useEffect` best practices, and TypeScript safety.
- **`agent/skills/github-actions-bash.md`**: Handling large payloads (ARG_MAX) in CI, `jq --rawfile`, and `curl` data streaming.
