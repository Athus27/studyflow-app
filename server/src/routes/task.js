import { Router } from "express";
import { TaskController } from "../controller/TaskController.js";

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.get("/api/tasks", taskController.getAll);
taskRouter.get("/api/dashboards/:dashboardId/tasks", taskController.getByDashboard);
taskRouter.post("/api/dashboards/:dashboardId/tasks", taskController.create);
taskRouter.delete("/api/tasks/:taskId", taskController.delete);
taskRouter.patch("/api/tasks/:taskId", taskController.update);
export { taskRouter };
