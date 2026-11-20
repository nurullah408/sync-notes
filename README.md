<div align="center">

# SyncNotes

### A modern note-taking application built for connected ideas.

Organize your notes, create rich-text content, and connect
your knowledge through internal links.

[Live Demo](https://syncnotes-app.noorullah.xyz) ·
[Report a Bug](https://github.com/nurullah408/sync-notes/issues) ·
[Request a Feature](https://github.com/nurullah408/sync-notes/issues)

![React](https://img.shields.io/badge/React-19-149ECA?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

</div>

---

## Features

### Rich-Text Editing

- Rich-text editor powered by Lexical
- Text formatting and structured content
- Automatic saving of note changes

### Connected Notes

- Create internal links between notes
- Navigate between related notes
- Build a connected knowledge base

### Note Organization

- Organize notes using folders
- Create, update, and delete notes
- Responsive sidebar navigation

### Application Experience

- Optimistic UI updates
- Server-backed note persistence
- Authentication and protected routes

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Frontend     | React, TypeScript, Vite |
| Styling      | Tailwind CSS, shadcn/ui |
| Editor       | Lexical                 |
| Routing      | TanStack Router         |
| Server State | TanStack Query          |
| Client State | Zustand                 |
| Backend      | NestJS                  |
| ORM          | Prisma                  |
| Database     | PostgreSQL              |
| Monorepo     | pnpm Workspaces         |
| Deployment   | Vercel, Render          |

## Architecture

SyncNotes follows a client-server architecture.

```text
React Application
    |
    |-- TanStack Router
    |-- TanStack Query
    |-- Zustand
    |-- Lexical Editor
    |
    v
NestJS REST API
    |
    |-- Authentication
    |-- Notes & Folders
    |-- Internal Links
    |
    v
Prisma ORM
    |
    v
PostgreSQL
```

## Project Structure

```text
syncnotes/
├── apps/
│   ├── web/         # React frontend
│   └── api/         # NestJS backend
├── packages/
│   └── lexical/     # Shared editor components
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL

### Installation

Clone the repository:

```bash
git clone https://github.com/nurullah408/sync-notes.git
cd sync-notes
```

Install dependencies:

```bash
pnpm install
```

Configure the required environment variables for
the frontend and backend.

Run database migrations:

```bash
pnpm --filter api exec prisma migrate deploy
```

Start the development environment using the
scripts defined in package.json.

## Roadmap

- [x] Rich-text note editor
- [x] Folder organization
- [x] Internal note linking
- [x] Optimistic updates
- [ ] Additional features under development

## Contributing

Contributions, suggestions, and bug reports are welcome.
Please open an issue to discuss proposed changes.
