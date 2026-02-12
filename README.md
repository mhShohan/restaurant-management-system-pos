# Monorepo Starter Kit with Turborepo

This monorepo starter kit is designed to help you kickstart your full-stack TypeScript projects
using Turborepo. It includes multiple applications and shared packages, along with essential tools
for code quality and consistency.

## Getting Started

1. Clone the repository:

   ```bash
   git clone
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the projects:

   ```bash
   pnpm build
   ```

4. Run all applications in development mode:

   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev`: Runs all applications in development mode.
- `pnpm build`: Builds all applications and packages.
- `pnpm lint`: Lints all packages and applications using ESLint.
- `pnpm dev:server`: Runs the server application in development mode.
- `pnpm dev:client`: Runs the client application in development mode.
- `pnpm dev:admin`: Runs the admin dashboard application in development mode.

### Application Ports

- Server: http://localhost:5000
- Client: http://localhost:3000
- Admin: http://localhost:3001

## Packages and Applications

### Tools

- **tools/typescript**: Shared TypeScript configuration.
- **tools/eslint**: Shared ESLint configuration.
- **tools/prettier**: Shared Prettier configuration.

### Application and Packages

- **apps/server**: An Express.js server application.
- **apps/client**: A React nextjs application.
- **apps/admin**: An admin dashboard application.

### Shared Packages

- **packages/ui**: A shared UI component library.
