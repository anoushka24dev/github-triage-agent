/*
  Warnings:

  - A unique constraint covering the columns `[githubRunId]` on the table `WorkflowRun` will be added. If there are existing duplicate values, this will fail.
  - Made the column `githubRunId` on table `WorkflowRun` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkflowRun" ALTER COLUMN "githubRunId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowRun_githubRunId_key" ON "WorkflowRun"("githubRunId");
