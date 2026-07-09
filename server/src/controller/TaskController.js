import { prisma } from "../database/client.js";

export class TaskController {
	async getAll(req, res) {
		try {
			const tasks = await prisma.task.findMany({
				orderBy: {
					priority: "asc"
				}
			});
			return res.json(tasks);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}

	async getByDashboard(req, res) {
		const dashboardId = Number(req.params.dashboardId);

		const tasks = await prisma.task.findMany({
			where: { dashboardId },
			orderBy: {
				priority: "asc"
			}
		});

		return res.json(tasks);
	}

	async create(req, res) {
		const dashboardId = Number(req.params.dashboardId);
		const { title, description, priority } = req.body;

		if (!title || !dashboardId) {
			return res.status(400).json({
				code: 400,
				message: "Invalid data request."
			});
		}

		try {
			const taskCount = await prisma.task.count({
				where: { dashboardId }
			});

			const task = await prisma.task.create({
				data: {
					title,
					description,
					priority: priority ?? taskCount + 1,
					dashboardId
				}
			});

			return res.status(201).json(task);
		} catch (error) {
			return res.status(400).json({
				code: 400,
				message: "Could not create task.",
				error
			});
		}
	}
	async delete(req, res) {
		const taskId = Number(req.params.taskId);

		await prisma.task.delete({
			where: {
				id: taskId
			}
		});
		return res.status(204).send();
	}
	async update(req, res) {
		const taskId = Number(req.params.taskId);
		const { title, description, completed, priority } = req.body;

		const task = await prisma.task.update({
			where: {
				id: taskId
			},
			data: {
				title,
				description,
				completed,
				priority
			}
		});

		return res.json(task);
	}
}
