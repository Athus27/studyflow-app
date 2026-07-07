import express from "express";
import cors from "cors";

import { userRouter } from "./routes/users.js";

const PORT = 5000;

const server = express();

server.use(cors());
server.use(express.json());
server.use(userRouter);

server.get("/", (req, res) => {
	return res.json({
		message: "StudyFlow API is running"
	});
});
server.get("/teste", (req, res) => {
	return res.json({
		message: "teste"
	});
});

server.listen(PORT, () => {
	console.log(`[SERVER] Server is running on port ${PORT}`);
});
