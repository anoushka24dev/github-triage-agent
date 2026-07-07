import "../config/env.js";

type GitHubWorkflowRun = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  head_branch: string;
  head_sha: string;
  created_at: string;
  updated_at: string;
};

type GitHubWorkflowJob = {
  id: number;
  run_id: number;
  name: string;
  status: string;
  conclusion: string | null;
  started_at: string | null;
  completed_at: string | null;
};

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
}

async function throwGitHubError(response: Response) {
  const details = await response.text();
  const suffix = details ? `: ${details}` : "";

  throw new GitHubApiError(
    `GitHub returned ${response.status}${suffix}`,
    response.status
  );
}

export async function fetchRepositories() {
  const response = await fetch(
    "https://api.github.com/user/repos",
    { headers: githubHeaders() }
  );

  if (!response.ok) {
    await throwGitHubError(response);
  }

  const repositories = await response.json();

  return repositories.map(
    (repo: {
      id: number;
      name: string;
      owner: { login: string };
      default_branch: string;
      private: boolean;
    }) => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login,
      defaultBranch: repo.default_branch,
      private: repo.private,
    })
  );
}

export async function fetchWorkflowRuns(
  owner: string,
  repo: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
    {
      headers: githubHeaders(),
    }
  );

  if (!response.ok) {
    await throwGitHubError(response);
  }

  const data = await response.json();

  return data.workflow_runs.map((run: GitHubWorkflowRun) => ({
    githubRunId: run.id,
    workflowName: run.name,
    status: run.status,
    conclusion: run.conclusion,
    branch: run.head_branch,
    commitSha: run.head_sha,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
  }));
}

export async function fetchWorkflowJobs(
  owner: string,
  repo: string,
  runId: number
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`,
    {
      headers: githubHeaders(),
    }
  );

  if (!response.ok) {
    await throwGitHubError(response);
  }

  const data = await response.json();

  return data.jobs.map((job: GitHubWorkflowJob) => ({
    githubJobId: job.id,
    githubRunId: job.run_id,
    name: job.name,
    status: job.status,
    conclusion: job.conclusion,
    startedAt: job.started_at,
    completedAt: job.completed_at,
  }));
}

export async function downloadJobLogs(
  owner: string,
  repo: string,
  jobId: number
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`,
    {
      headers: githubHeaders(),
      redirect: "follow",
    }
  );

  if (!response.ok) {
    await throwGitHubError(response);
  }

  return await response.text();
}
