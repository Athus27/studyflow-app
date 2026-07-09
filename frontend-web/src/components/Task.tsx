import { useEffect, useState } from "react";
import type { TaskProps } from "../types/task";
import { deleteTask, updateTask } from "../services/tasksService";

export const Task = ({ task, onUpdate, onRemove, onMoveUp, onMoveDown, canMoveUp = false, canMoveDown = false }: TaskProps) => {
	const [showOptions, setShowOptions] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [titleInput, setTitleInput] = useState(task.title ?? task.text ?? "");
	const [descriptionInput, setDescriptionInput] = useState(task.description ?? "");
	const [priorityInput, setPriorityInput] = useState(task.priority ?? 1);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const title = task.title ?? task.text ?? "Tarefa sem titulo";
	const priorityLabel = task.priority ? `Prioridade ${task.priority}` : "Sem prioridade";

	useEffect(() => {
		setTitleInput(task.title ?? task.text ?? "");
		setDescriptionInput(task.description ?? "");
		setPriorityInput(task.priority ?? 1);
	}, [task]);

	const handleEdit = async () => {
		if (!titleInput.trim()) {
			setError("Informe o titulo da tarefa.");
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const updatedTask = await updateTask(task.id, {
				title: titleInput,
				description: descriptionInput,
				priority: priorityInput || 1
			});

			onUpdate?.(updatedTask);
			setIsEditing(false);
		} catch {
			setError("Nao foi possivel editar a tarefa.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemove = async () => {
		try {
			setIsLoading(true);
			setError(null);

			await deleteTask(task.id);
			onRemove?.(task.id);
		} catch {
			setError("Nao foi possivel remover a tarefa.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="task-card">
			<span className={task.completed ? "task-check task-check-done" : "task-check"} />

			<div className="task-content">
				{isEditing ? (
					<div className="task-edit-form">
						<input value={titleInput} onChange={(event) => setTitleInput(event.target.value)} placeholder="Titulo" />
						<input
							value={descriptionInput}
							onChange={(event) => setDescriptionInput(event.target.value)}
							placeholder="Descricao"
						/>
						<input
							type="number"
							min="1"
							value={priorityInput}
							onChange={(event) => setPriorityInput(Number(event.target.value))}
							placeholder="Prioridade"
						/>
						<div className="task-edit-actions">
							<button type="button" onClick={handleEdit} disabled={isLoading}>
								salvar
							</button>
							<button type="button" onClick={() => setIsEditing(false)} disabled={isLoading}>
								cancelar
							</button>
						</div>
					</div>
				) : (
					<>
						<strong>{title}</strong>
						<span>{priorityLabel}</span>
					</>
				)}

				{showOptions && (
					<div> 
						<div>
							<p>{task.description}</p>
							{error && <p className="task-error">{error}</p>}
						</div>
						<div className="task-options">
							<button type="button" onClick={() => setIsEditing((current) => !current)} disabled={isLoading}>
								{isEditing ? "come back" : "edit"}
							</button>
							<button type="button" onClick={handleRemove} disabled={isLoading}>
								remove
							</button>
							<button type="button" onClick={() => onMoveUp?.(task)} disabled={isLoading || !canMoveUp}>
								move up
							</button>
							<button type="button" onClick={() => onMoveDown?.(task)} disabled={isLoading || !canMoveDown}>
								move down
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="task-meta">
				{task.dueDate && <span>{task.dueDate}</span>}
				<span className="task-arrow">
					<button type="button" onClick={() => setShowOptions(!showOptions)}>
						⌄
					</button>
				</span>
			</div>
		</div>
	);
};
