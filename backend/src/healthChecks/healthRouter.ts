import { Router } from "express";
import { AppDataSource } from "../db/datasource";
import { getCurrentPrimeRate } from "../services/rates/primeRateScraper";

const healthRouter = Router();

healthRouter.get("/health/live", (_req, res) => {
  res.json({ status: "alive" });
});

healthRouter.get("/health/ready", async (_req, res) => {
  const dependencies: Record<string, { status: string; message?: string }> = {};

  try {
    await AppDataSource.query("SELECT 1");
    dependencies.database = { status: "ok" };
  } catch (err) {
    dependencies.database = {
      status: "error",
      message: err instanceof Error ? err.message : "DB failed to start",
    };
  }

  try {
    await getCurrentPrimeRate();
    dependencies.fred = { status: "ok" };
  } catch (err) {
    dependencies.fred = {
      status: "error",
      message: err instanceof Error ? err.message : "FRED API unavailable",
    };
  }

  const ready = Object.values(dependencies).every(
    (dependency) => dependency.status === "ok",
  );
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not ready",
    checks: dependencies,
  });
});

export default healthRouter;
