import Fastify from "fastify";
import { repositoryRoutes } from "./routes/repositories.js";
import { githubRoutes } from "./routes/github.js";
import analysisRoutes from "./routes/analysis.js";

const server = Fastify({
  logger: true,
});

server.get("/health", async () => {
  return {
    status: "ok",
    service: "github-triage-api",
  };
});

const start = async (): Promise<void> => {
  try {
    await server.register(repositoryRoutes);
    await server.register(githubRoutes);

    // AI analysis endpoint
    await server.register(analysisRoutes, {
      prefix: "/analysis",
    });

    await server.listen({
      port: 3001,
      host: "0.0.0.0",
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();