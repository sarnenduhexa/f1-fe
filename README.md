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

## Docker & Production

### **Build and Run the Frontend Independently with Docker**

You can also build and run the frontend app as a standalone Docker container:

1. **Build the Docker image:**
   ```sh
   docker build -t f1-fe .
   ```
2. **Run the container:**
   ```sh
   docker run -d -p 5173:80 \
     --name f1-fe f1-fe
   ```
   - Replace `http://localhost:3001` in the `.env` file with your backend API URL as needed.
   - The app will be available at [http://localhost:5173](http://localhost:5173)

---

## Continuous Integration & Deployment (CI/CD)

Our project uses GitHub Actions for automated testing, security scanning, and deployment. The CI/CD pipeline runs on every push to `main` and on pull requests targeting `main`.

### Pipeline Stages

1. **Security Scanning**
   - CodeQL analysis for JavaScript security vulnerabilities
   - Trivy dependency scan for known vulnerabilities in project dependencies
   - All security scans are configured to fail on critical and high severity issues

2. **Install and Test**
   - Node.js 22 setup with npm caching
   - Dependency installation
   - Linting checks
   - Unit tests execution
   - Application build

3. **Docker Build and Push** (main branch only)
   - Builds Docker image using Docker Buildx
   - Pushes to Docker Hub with two tags:
     - Latest commit SHA
     - `latest` tag

4. **Container Security Scan** (main branch only)
   - Trivy container scan of the built Docker image
   - Checks for OS and library vulnerabilities
   - Fails on critical and high severity issues

### Required Secrets
The following secrets need to be configured in your GitHub repository:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

### Pipeline Triggers
- **Pull Requests to main**: Runs security scans, tests, and linting
- **Push to main**: Runs full pipeline including Docker build, push, and container scan

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
