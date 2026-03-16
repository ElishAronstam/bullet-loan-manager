import { Router } from "express";
import { AppDataSource } from "../db/datasource";
import { getCurrentPrimeRate } from "../services/primeRateScraper";

const healthRouter = Router();

healthRouter.get("/health/live", (_req, res) => {
  res.json({ status: "alive" });
});

healthRouter.get("/health/ready", async (_req, res) => {
  const checks: Record<string, { status: string; message?: string }> = {};

  try {
    await AppDataSource.query("SELECT 1");
    checks.database = { status: "ok" };
  } catch (err) {
    checks.database = {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }

  try {
    await getCurrentPrimeRate();
    checks.fred = { status: "ok" };
  } catch (err) {
    checks.fred = {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }

  const allOk = Object.values(checks).every((c) => c.status === "ok");
  res.status(allOk ? 200 : 503).json({
    status: allOk ? "ready" : "not ready",
    checks,
  });
});

export default healthRouter;
