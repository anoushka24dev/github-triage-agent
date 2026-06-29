export type WorkflowRunStatus =
  "queued" | "in_progress" | "completed" | "failed" | "cancelled" | "skipped";

export type TriageSeverity = "low" | "medium" | "high" | "critical";

export interface RepositoryRef {
  id: string;
  owner: string;
  name: string;
  defaultBranch: string;
}

export interface WorkflowRunSummary {
  id: string;
  repositoryId: string;
  workflowName: string;
  branch: string;
  commitSha: string;
  status: WorkflowRunStatus;
  conclusion: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface TriageReportSummary {
  id: string;
  workflowRunId: string;
  probableCause: string;
  confidence: number;
  severity: TriageSeverity;
  createdAt: string;
}
