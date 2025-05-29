# F1 Dashboard App (f1-fe)

A modern, accessible, and responsive Formula 1 dashboard built with React, TypeScript, Vite, Tailwind CSS, and React Query. Displays F1 World Champions and race results, with a focus on best practices, testability, and easy deployment.

---

## Features
- List of F1 World Champions (2005–present)
- Click a season to view all grand prix winners for that year
- Champion's victories are visually highlighted
- Accessible, responsive, and high Lighthouse score
- API client auto-generated from OpenAPI (Swagger) spec
- Modern state management with React Context and React Query
- Full Docker support for local and production deployments
- Comprehensive unit tests with Vitest and Testing Library

---

## Tech Stack
- **React** (TypeScript, Vite)
- **Tailwind CSS** (utility-first styling)
- **React Query** (data fetching/caching)
- **Orval** (OpenAPI codegen)
- **Axios** (API requests)
- **Vitest** + **Testing Library** (unit/component testing)
- **nginx** (production web server)
- **Docker** & **Docker Compose** (multi-service orchestration)

---

## Environment Configuration

The application supports multiple environment configurations:

1. **Production Environment**
   - Uses `.env.production` file
   - Deployed to production with `:latest` tag
   - API URL configured via `PROD_API_URL` secret in GitHub

2. **Docker Compose Environment**
   - Uses `.env.compose` file
   - Built with `:compose-latest` tag
   - API URL configured via `COMPOSE_API_URL` secret in GitHub

## Docker Images

The application is built and published to DockerHub with different tags:

- `sarnenduhexa/f1-fe:latest` - Production build
- `sarnenduhexa/f1-fe:compose-latest` - Docker Compose environment build
- `sarnenduhexa/f1-fe:<commit-sha>` - Production build with specific commit SHA

## CI/CD Pipeline

The GitHub Actions workflow includes:

1. Security scanning (CodeQL and Trivy)
2. Installation and testing
3. Docker image builds for both environments
4. Container vulnerability scanning

### Required Secrets

The following secrets need to be configured in GitHub:

- `DOCKERHUB_USERNAME` - DockerHub username
- `DOCKERHUB_TOKEN` - DockerHub access token
- `PROD_API_URL` - Production API URL
- `COMPOSE_API_URL` - Docker Compose environment API URL

## Local Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the dev server:**
   ```sh
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173)
   - The dev server proxies `/api` requests to the backend (see `vite.config.ts`)

3. **Run tests:**
   ```sh
   npm run test
   ```

4. **Generate API client from OpenAPI spec:**
   ```sh
   npm run generate:api
   ```
   - The OpenAPI spec should be available at `http://localhost:3001/api/` (or as configured)

---

## Building for Different Environments

### Production Build
```bash
docker build --build-arg VITE_API_BASE_URL=<production-url> -t sarnenduhexa/f1-fe:latest .
```

### Docker Compose Build
```bash
docker build --build-arg VITE_API_BASE_URL=<compose-url> -t sarnenduhexa/f1-fe:compose-latest .
```

---

## Project Structure
```
f1-fe/
  src/
    api/           # Orval-generated API client
    components/    # Reusable UI components
    context/       # React Context for state
    hooks/         # Custom hooks
    pages/         # App pages (SeasonList, SeasonDetails, etc.)
    utils/         # Utility functions
    index.css      # Tailwind import only
    main.tsx       # App entry point
    App.tsx        # App root
  Dockerfile       # Multi-stage build for production
  nginx.conf       # SPA routing for nginx
  package.json     # Scripts and dependencies
  vite.config.ts   # Vite and Vitest config
  README.md        # This file
```

---

## Accessibility & Testing
- Semantic HTML, ARIA, keyboard navigation
- Responsive with Tailwind
- Unit/component tests: `npm run test`
- Test coverage for all major UI and data-fetching logic

---

## API Integration
- API client is auto-generated from the backend OpenAPI spec using Orval
- To update the client, run `npm run generate:api` after updating the backend spec
- All API requests are routed through a custom Axios instance, using the correct base URL for each environment

---

## License
MIT
