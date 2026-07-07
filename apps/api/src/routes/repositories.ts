import { FastifyInstance } from "fastify";
import { prisma } from "../db.js";

export async function repositoryRoutes(server: FastifyInstance) {
  // GET all repositories
  server.get("/repositories", async () => {
    const repositories = await prisma.repository.findMany();

    return repositories;
  });

  // Create a repository
  server.post("/repositories", async (request) => {
    const body = request.body as {
      owner: string;
      name: string;
    };

    const repository = await prisma.repository.create({
      data: {
        owner: body.owner,
        name: body.name,
      },
    });

    return repository;
  });
}