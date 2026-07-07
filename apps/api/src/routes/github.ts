import { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import {
  fetchRepositories,
  fetchWorkflowJobs,
  fetchWorkflowRuns,
} from "../services/github.js";

export async function githubRoutes(server: FastifyInstance) {
  server.get("/github/:owner/:repo/workflows", async (request) => {
    const { owner, repo } = request.params as {
      owner: string;
      repo: string;
    };

    return await fetchWorkflowRuns(owner, repo);
  });

  server.post("/github/:owner/:repo/sync", async (request) => {
    const { owner, repo } = request.params as {
      owner: string;
      repo: string;
    };

    const workflowRuns = await fetchWorkflowRuns(owner, repo);

    let repository = await prisma.repository.findFirst({
      where: {
        owner,
        name: repo,
      },
    });

    if (!repository) {
      repository = await prisma.repository.create({
        data: {
          owner,
          name: repo,
        },
      });

      console.log("Repository created:", repository);
    } else {
      console.log("Repository already exists:", repository);
    }

    for (const run of workflowRuns) {
      await prisma.workflowRun.upsert({
        where: {
          githubRunId: BigInt(run.githubRunId),
        },
        update: {
          workflowName: run.workflowName,
          branch: run.branch,
          commitSha: run.commitSha,
          status: run.status,
          conclusion: run.conclusion,
          startedAt: new Date(run.createdAt),
          completedAt: new Date(run.updatedAt),
        },
        create: {
          githubRunId: BigInt(run.githubRunId),
          workflowName: run.workflowName,
          branch: run.branch,
          commitSha: run.commitSha,
          status: run.status,
          conclusion: run.conclusion,
          startedAt: new Date(run.createdAt),
          completedAt: new Date(run.updatedAt),

          repository: {
            connect: {
              id: repository.id,
            },
          },
        },
      });
    }

    return workflowRuns;
  });

  server.get(
    "/github/:owner/:repo/runs/:runId/jobs",
    async (request) => {
      const { owner, repo, runId } = request.params as {
        owner: string;
        repo: string;
        runId: string;
      };

      return await fetchWorkflowJobs(owner, repo, Number(runId));
    }
  );

  server.get("/github/repositories", async () => {
    return await fetchRepositories();
  });
}