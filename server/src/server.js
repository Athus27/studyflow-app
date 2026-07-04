import express from "express";

const PORT = 5000;

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
	return res.json({
		message: "StudyFlow API is running"
	});
});

server.listen(PORT, () => {
	console.log(`[SERVER] Server is running on port ${PORT}`);
});
