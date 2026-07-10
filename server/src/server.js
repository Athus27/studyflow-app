import express from "express";
import cors from "cors";

import { userRouter } from "./routes/users.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { taskRouter } from "./routes/task.js";
import { focusSessionRouter } from "./routes/focusSession.js";


const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(dashboardRouter);
app.use(taskRouter);
app.use(focusSessionRouter);

app.get("/", (req, res) => {
	return res.json({
		message: "StudyFlow API is running"
	});
});
app.get("/teste", (req, res) => {
	return res.json({
		message: "teste"
	});
});

app.listen(PORT, () => {
	console.log(`[SERVER] Server is running on port ${PORT}`);
});
