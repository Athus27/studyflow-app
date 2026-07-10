import { prisma } from "../database/client.js";

export class FocusSessionController {
	async getAll(req, res) {
		const userId = req.query.userId ? Number(req.query.userId) : undefined;

		try {
			const focusSessions = await prisma.focusSession.findMany({
				where: userId ? { userId } : undefined,
				orderBy: {
					createdAt: "desc"
				},
				include: {
					task: {
						select: {
							id: true,
							title: true
						}
					}
				}
			});

			return res.json(focusSessions);
		} catch (error) {
			console.error(error);

			return res.status(500).json({
				code: 500,
				message: "Could not list focus sessions."
			});
		}
	}

	async create(req, res) {
		const { subject, notes, durationMinutes, userId, taskId } = req.body;

		if (!subject || !durationMinutes || !userId) {
			return res.status(400).json({
				code: 400,
				message: "Invalid data request."
			});
		}

		try {
			const focusSession = await prisma.focusSession.create({
				data: {
					subject,
					notes,
					durationMinutes: Number(durationMinutes),
					userId: Number(userId),
					taskId: taskId ? Number(taskId) : null
				},
				include: {
					task: {
						select: {
							id: true,
							title: true
						}
					}
				}
			});

			return res.status(201).json(focusSession);
		} catch (error) {
			console.error(error);

			return res.status(400).json({
				code: 400,
				message: "Could not create focus session."
			});
		}
	}

	async delete(req, res) {
		const focusSessionId = Number(req.params.focusSessionId);

		try {
			await prisma.focusSession.delete({
				where: {
					id: focusSessionId
				}
			});

			return res.status(204).send();
		} catch (error) {
			console.error(error);

			return res.status(400).json({
				code: 400,
				message: "Could not delete focus session."
			});
		}
	}
}
