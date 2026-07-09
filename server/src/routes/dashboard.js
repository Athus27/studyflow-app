import { Router } from "express";
import { DashboardController } from "../controller/DashboardController.js";

const dashboardRouter = Router();
const dashboardController = new DashboardController();

dashboardRouter.post("/api/dashboards", dashboardController.create);
dashboardRouter.get("/api/dashboards", dashboardController.getAll);
dashboardRouter.patch("/api/dashboards/:dashboardId", dashboardController.update);
dashboardRouter.delete("/api/dashboards/:dashboardId", dashboardController.delete);

export { dashboardRouter };
