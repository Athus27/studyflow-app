import { useEffect, useState } from "react";
import { Task } from "../../components/Task";
import type { DashboardData } from "../../types/dashboard";
import { addDashboard, deleteDashboard, getDashboards, updateDashboard } from "../../services/dashboardsService";
import HeaderContainer from "../../components/common/HeaderContainer";
import { addTask, updateTask } from "../../services/tasksService";
import type { TaskData } from "../../types/task";

export const Dashboard = () => {
	const user = localStorage.getItem("user");
	const [dashboards, setDashboards] = useState<DashboardData[]>([]);
	const [showDashboardOptions, setShowDashboardOptions] = useState(false);
	const [editingDashboardId, setEditingDashboardId] = useState<number | null>(null);
	const [editingDashboardDataId, setEditingDashboardDataId] = useState<number | null>(null);
	const [dashboardTitle, setDashboardTitle] = useState("");
	const [dashboardDescription, setDashboardDescription] = useState("");
	const [dashboardPriority, setDashboardPriority] = useState("");
	const [dashboardError, setDashboardError] = useState<string | null>(null);
	const [taskTitle, setTaskTitle] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [taskPriority, setTaskPriority] = useState("");
	const [taskError, setTaskError] = useState<string | null>(null);

	const loggedUser = user ? JSON.parse(user) : null;

	useEffect(() => {
		getDashboards().then(setDashboards);
	}, []);

	const resetDashboardForm = () => {
		setDashboardTitle("");
		setDashboardDescription("");
		setDashboardPriority("");
		setDashboardError(null);
	};

	const handleCreateDashboard = async () => {
		if (!dashboardTitle.trim()) {
			setDashboardError("Informe o titulo do dashboard.");
			return;
		}

		if (!loggedUser?.id) {
			setDashboardError("Usuario logado nao encontrado.");
			return;
		}

		try {
			setDashboardError(null);
			const defaultPriority = dashboards.length + 1;

			const newDashboard = await addDashboard({
				title: dashboardTitle,
				description: dashboardDescription,
				userId: loggedUser.id,
				priority: Number(dashboardPriority) || defaultPriority
			});

			setDashboards((currentDashboards) => [...currentDashboards, { ...newDashboard, tasks: [] }]);
			resetDashboardForm();
			setShowDashboardOptions(false);
		} catch {
			setDashboardError("Nao foi possivel cadastrar o dashboard.");
		}
	};

	const handleCreateTask = async (dashboardId: number) => {
		if (!taskTitle.trim()) {
			setTaskError("Informe o titulo da tarefa.");
			return;
		}

		try {
			setTaskError(null);
			const defaultPriority = (dashboards.find((dashboard) => dashboard.id === dashboardId)?.tasks?.length ?? 0) + 1;

			const newTask = await addTask(dashboardId, {
				title: taskTitle,
				description: taskDescription,
				priority: Number(taskPriority) || defaultPriority
			});

			setDashboards((currentDashboards) =>
				currentDashboards.map((dashboard) => {
					if (dashboard.id !== dashboardId) {
						return dashboard;
					}

					return {
						...dashboard,
						tasks: [...(dashboard.tasks ?? []), newTask]
					};
				})
			);

			setTaskTitle("");
			setTaskDescription("");
			setTaskPriority("");
			setEditingDashboardId(null);
		} catch {
			setTaskError("Nao foi possivel cadastrar a tarefa.");
		}
	};

	const handleToggleDashboardEdit = (dashboardId: number) => {
		setEditingDashboardId((currentId) => {
			const nextId = currentId === dashboardId ? null : dashboardId;

			if (nextId === null) {
				setTaskTitle("");
				setTaskDescription("");
				setTaskPriority("");
				setTaskError(null);
			}

			return nextId;
		});
	};

	const handleToggleDashboardDataEdit = (dashboard: DashboardData) => {
		if (editingDashboardDataId === dashboard.id) {
			setEditingDashboardDataId(null);
			resetDashboardForm();
			return;
		}

		setEditingDashboardDataId(dashboard.id);
		setDashboardTitle(dashboard.title);
		setDashboardDescription(dashboard.description ?? "");
		setDashboardPriority(String(dashboard.priority ?? ""));
		setDashboardError(null);
	};

	const handleUpdateDashboard = async (dashboardId: number) => {
		if (!dashboardTitle.trim()) {
			setDashboardError("Informe o titulo do dashboard.");
			return;
		}

		try {
			setDashboardError(null);
			const updatedDashboard = await updateDashboard(dashboardId, {
				title: dashboardTitle,
				description: dashboardDescription,
				priority: Number(dashboardPriority) || 1
			});

			setDashboards((currentDashboards) =>
				currentDashboards.map((dashboard) => (dashboard.id === dashboardId ? updatedDashboard : dashboard))
			);
			setEditingDashboardDataId(null);
			resetDashboardForm();
		} catch {
			setDashboardError("Nao foi possivel editar o dashboard.");
		}
	};

	const handleRemoveDashboard = async (dashboardId: number) => {
		try {
			await deleteDashboard(dashboardId);
			setDashboards((currentDashboards) => currentDashboards.filter((dashboard) => dashboard.id !== dashboardId));

			if (editingDashboardId === dashboardId) {
				setEditingDashboardId(null);
			}

			if (editingDashboardDataId === dashboardId) {
				setEditingDashboardDataId(null);
				resetDashboardForm();
			}
		} catch {
			setDashboardError("Nao foi possivel remover o dashboard.");
		}
	};

	const handleMoveDashboard = async (dashboardId: number, direction: "up" | "down") => {
		const orderedDashboards = [...dashboards].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
		const currentIndex = orderedDashboards.findIndex((dashboard) => dashboard.id === dashboardId);
		const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedDashboards.length) {
			return;
		}

		const currentDashboard = orderedDashboards[currentIndex];
		const targetDashboard = orderedDashboards[targetIndex];
		const currentPriority = currentDashboard.priority ?? currentIndex + 1;
		const targetPriority = targetDashboard.priority ?? targetIndex + 1;

		const [updatedCurrentDashboard, updatedTargetDashboard] = await Promise.all([
			updateDashboard(currentDashboard.id, { priority: targetPriority }),
			updateDashboard(targetDashboard.id, { priority: currentPriority })
		]);

		setDashboards((currentDashboards) =>
			currentDashboards.map((dashboard) => {
				if (dashboard.id === updatedCurrentDashboard.id) {
					return updatedCurrentDashboard;
				}

				if (dashboard.id === updatedTargetDashboard.id) {
					return updatedTargetDashboard;
				}

				return dashboard;
			})
		);
	};

	const handleUpdateTask = (updatedTask: TaskData) => {
		setDashboards((currentDashboards) =>
			currentDashboards.map((dashboard) => ({
				...dashboard,
				tasks: dashboard.tasks?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
			}))
		);
	};

	const handleRemoveTask = (taskId: number) => {
		setDashboards((currentDashboards) =>
			currentDashboards.map((dashboard) => ({
				...dashboard,
				tasks: dashboard.tasks?.filter((task) => task.id !== taskId)
			}))
		);
	};

	const handleMoveTask = async (dashboardId: number, taskId: number, direction: "up" | "down") => {
		const dashboard = dashboards.find((currentDashboard) => currentDashboard.id === dashboardId);
		const orderedTasks = [...(dashboard?.tasks ?? [])].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
		const currentIndex = orderedTasks.findIndex((task) => task.id === taskId);
		const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedTasks.length) {
			return;
		}

		const currentTask = orderedTasks[currentIndex];
		const targetTask = orderedTasks[targetIndex];
		const currentPriority = currentTask.priority ?? currentIndex + 1;
		const targetPriority = targetTask.priority ?? targetIndex + 1;

		const [updatedCurrentTask, updatedTargetTask] = await Promise.all([
			updateTask(currentTask.id, { priority: targetPriority }),
			updateTask(targetTask.id, { priority: currentPriority })
		]);

		setDashboards((currentDashboards) =>
			currentDashboards.map((currentDashboard) => {
				if (currentDashboard.id !== dashboardId) {
					return currentDashboard;
				}

				return {
					...currentDashboard,
					tasks: currentDashboard.tasks?.map((task) => {
						if (task.id === updatedCurrentTask.id) {
							return updatedCurrentTask;
						}

						if (task.id === updatedTargetTask.id) {
							return updatedTargetTask;
						}

						return task;
					})
				};
			})
		);
	};

	return (
		<section className="home-content">
			<div className="dashboard-header">
					<div className="dashboard-header-informations">
						<h4>{dashboards.length} dashboards</h4>
							<div>
								<button type="button" onClick={() => setShowDashboardOptions((current) => !current)}>
									{showDashboardOptions ? "come back" : "Edit This"}
								</button>
							</div>
					</div>
					{showDashboardOptions && (
						<div>
							<div className="new-dashboard-options">
								<div>
									<h3>new dashboard options</h3>
									<div className="input-form">
										<input
											className="input h-10"
											type="text"
											name="name"
											placeholder="Name:"
											value={dashboardTitle}
											onChange={(event) => setDashboardTitle(event.target.value)}
										/>
										<input
											className="input h-10"
											type="text"
											name="desc"
											placeholder="Description:"
											value={dashboardDescription}
											onChange={(event) => setDashboardDescription(event.target.value)}
										/>
										<input
											className="input h-10"
											type="number"
											min="1"
											name="priority"
											placeholder="Priority:"
											value={dashboardPriority}
											onChange={(event) => setDashboardPriority(event.target.value)}
										/>
										{dashboardError && <p className="form-error">{dashboardError}</p>}
										<button className="button" type="button" onClick={handleCreateDashboard}>
											Criar dashboard
										</button>
									</div>
								</div>
							{/* <div>
								<h1 className="text-center">category</h1>
							</div> */}
						</div>
					</div>
				)}
			</div>

				{[...dashboards].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999)).map((dashboard, dashboardIndex, orderedDashboards) => {
					const tasks = dashboard.tasks ?? [];
					const orderedTasks = [...tasks].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

				return (
					<div key={dashboard.id} className="dashboard">
						<HeaderContainer
								dashboard={dashboard}
								isEditing={editingDashboardId === dashboard.id}
								isDashboardEditing={editingDashboardDataId === dashboard.id}
								canMoveUp={dashboardIndex > 0}
								canMoveDown={dashboardIndex < orderedDashboards.length - 1}
								onAddTask={() => handleToggleDashboardEdit(dashboard.id)}
								onEditDashboard={() => handleToggleDashboardDataEdit(dashboard)}
								onRemoveDashboard={() => handleRemoveDashboard(dashboard.id)}
								onMoveDashboardUp={() => handleMoveDashboard(dashboard.id, "up")}
								onMoveDashboardDown={() => handleMoveDashboard(dashboard.id, "down")}
							/>

							{editingDashboardDataId === dashboard.id && (
								<div className="dashboard-actions">
									<div className="task-form">
										<input
											type="text"
											placeholder="Titulo do dashboard"
											value={dashboardTitle}
											onChange={(event) => setDashboardTitle(event.target.value)}
										/>
										<input
											type="text"
											placeholder="Descricao"
											value={dashboardDescription}
											onChange={(event) => setDashboardDescription(event.target.value)}
										/>
										<input
											type="number"
											min="1"
											placeholder="Prioridade"
											value={dashboardPriority}
											onChange={(event) => setDashboardPriority(event.target.value)}
										/>
										{dashboardError && <p>{dashboardError}</p>}
										<button className="button" type="button" onClick={() => handleUpdateDashboard(dashboard.id)}>
											Salvar dashboard
										</button>
									</div>
								</div>
							)}

						{editingDashboardId === dashboard.id && (
							<div className="dashboard-actions">
								<div className="task-form">
									<input
										type="text"
										placeholder="Titulo da tarefa"
										value={taskTitle}
										onChange={(event) => setTaskTitle(event.target.value)}
									/>

										<input
											type="text"
											placeholder="Descricao"
											value={taskDescription}
											onChange={(event) => setTaskDescription(event.target.value)}
										/>

										<input
											type="number"
											min="1"
											placeholder="Prioridade"
											value={taskPriority}
											onChange={(event) => setTaskPriority(event.target.value)}
										/>

										{taskError && <p>{taskError}</p>}

									<button className="button" type="button" onClick={() => handleCreateTask(dashboard.id)}>
										Cadastrar tarefa
									</button>
									</div>
								</div>
							)}

						{orderedTasks.length > 0 ? (
							<div className="task-list">
								{orderedTasks.map((task, index) => (
									<Task
										key={task.id}
										task={task}
										canMoveUp={index > 0}
										canMoveDown={index < orderedTasks.length - 1}
										onUpdate={handleUpdateTask}
										onRemove={handleRemoveTask}
										onMoveUp={() => handleMoveTask(dashboard.id, task.id, "up")}
										onMoveDown={() => handleMoveTask(dashboard.id, task.id, "down")}
									/>
								))}
							</div>
						) : (
							<p className="text-center">Nenhuma tarefa cadastrada.</p>
						)}
					</div>
				);
			})}
		</section>
	);
};
