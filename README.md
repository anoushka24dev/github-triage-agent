# GitHub Incident Triage Agent

An AI-powered DevOps assistant that analyzes failed GitHub Actions workflows and generates root cause analysis with actionable recommendations.

## Features

- Connects to GitHub repositories
- Retrieves workflow runs and jobs
- Downloads workflow logs (when available)
- Uses Ollama (Mistral) for AI-powered failure analysis
- Generates:
  - Root Cause
  - Failure Category
  - Recommended Resolution
  - Confidence Score

## Tech Stack

- Next.js
- Fastify
- TypeScript
- PostgreSQL
- Prisma
- Ollama (Mistral)
- GitHub REST API
- pnpm Workspaces

## Project Structure

```
apps/
  api/      # Fastify backend
  web/      # Next.js frontend
packages/
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Configure the required environment variables before running the project.

## Future Improvements

- Real-time GitHub webhook integration
- Support for multiple LLM providers
- Automated fix suggestions
- Historical failure analytics
