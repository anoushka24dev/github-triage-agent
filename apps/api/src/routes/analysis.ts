import { FastifyInstance } from "fastify";
import { downloadJobLogs } from "../services/github.js";
import { analyzeLogs } from "../services/ollama.js";

type AnalysisBody = {
  owner: string;
  repo: string;
  jobId: number;
};

export default async function analysisRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: AnalysisBody }>("/", async (request, reply) => {
    const { owner, repo, jobId } = request.body;

    try {
      const logs = await downloadJobLogs(owner, repo, jobId);
      const analysis = await analyzeLogs(logs);

      return reply.send(analysis);
    } catch (error) {
      request.log.error(error);

      return reply.status(500).send({
        message: "Failed to analyze workflow logs.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}