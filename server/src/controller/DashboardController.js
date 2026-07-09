import { prisma } from "../database/client.js";

export class DashboardController {
  async create(req, res) {
    const { title, description, userId, priority } = req.body;

    if (!title || !userId) {
      return res.status(400).json({
        code: 400,
        message: "Invalid data request."
      });
    }

    const dashboardCount = await prisma.dashboard.count({
      where: { userId }
    });

    const dashboard = await prisma.dashboard.create({
      data: {
        title,
        description,
        priority: priority ?? dashboardCount + 1,
        userId
      }
    });

    return res.status(201).json(dashboard);
  }

  async getAll(req, res) {
    try {
	      const dashboards = await prisma.dashboard.findMany({
          orderBy: {
            priority: "asc"
          },
	        include: {
	          tasks: {
	            orderBy: {
	              priority: "asc"
	            }
	          }
	        }
	      });

      return res.json(dashboards);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        code: 500,
        message: "Could not list dashboards."
      });
    }
  }

  async update(req, res) {
    const dashboardId = Number(req.params.dashboardId);
    const { title, description, priority } = req.body;

    try {
      const dashboard = await prisma.dashboard.update({
        where: {
          id: dashboardId
        },
        data: {
          title,
          description,
          priority
        },
        include: {
          tasks: {
            orderBy: {
              priority: "asc"
            }
          }
        }
      });

      return res.json(dashboard);
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        code: 400,
        message: "Could not update dashboard."
      });
    }
  }

  async delete(req, res) {
    const dashboardId = Number(req.params.dashboardId);

    try {
      await prisma.$transaction(async (tx) => {
        await tx.task.deleteMany({
          where: {
            dashboardId
          }
        });

        await tx.dashboard.delete({
          where: {
            id: dashboardId
          }
        });
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        code: 400,
        message: "Could not delete dashboard."
      });
    }
  }
}
