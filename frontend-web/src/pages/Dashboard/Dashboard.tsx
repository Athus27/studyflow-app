import { Task } from "../../components/Task";

export const Dashboard = () => {
	const tasks = [
		{ id: 1, text: "Revisar conteúdo de Web", priority: 1, dueDate: "06/07/2026" },
		{ id: 2, text: "Implementar API Express", priority: 2, dueDate: "07/07/2026" },
		{ id: 3, text: "Modelar banco com Prisma", priority: 3, dueDate: "08/07/2026" }
	];

	const orderedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

	return (
		<section>
			<div className="dashboard-header">
				<div className="dashboard-header-informations">
					<h4>06/07/2026</h4>
					<h4>{tasks.length} tarefas</h4>
					<h3>Dashboard</h3>
				</div>
			</div>

			<div className="dashboard">
				{orderedTasks.map((task) => (
					<Task key={task.id} task={task} />
				))}
			</div>
		</section>
	);
};
