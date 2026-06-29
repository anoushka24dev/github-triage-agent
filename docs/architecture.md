# GitHub Incident Triage Agent Architecture

## Purpose

GitHub Incident Triage Agent is an AI-assisted DevOps/SRE workflow tool for detecting failed GitHub Actions workflow runs, gathering related engineering context, clustering similar failures, and producing root-cause triage reports.

## High-Level Flow

```text
GitHub API
  -> API Backend
  -> PostgreSQL
  -> MCP Server
  -> AI Agent
  -> Dashboard
```
