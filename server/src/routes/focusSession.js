import { Router } from "express";
import { FocusSessionController } from "../controller/FocusSessionController.js";

const focusSessionRouter = Router();
const focusSessionController = new FocusSessionController();

focusSessionRouter.get("/api/focus-sessions", focusSessionController.getAll);
focusSessionRouter.post("/api/focus-sessions", focusSessionController.create);
focusSessionRouter.delete("/api/focus-sessions/:focusSessionId", focusSessionController.delete);

export { focusSessionRouter };
