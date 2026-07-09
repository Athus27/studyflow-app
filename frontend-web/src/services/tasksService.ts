import type { TaskData } from "../types/task";

const API_URL = "http://localhost:5000";

export type CreateTaskData = Omit<TaskData, "id">;
export type UpdateTaskData = Partial<Omit<TaskData, "id">>;

export async function addTask(
	dashboardId: number,
	taskData: CreateTaskData
): Promise<TaskData> {
	const response = await fetch(`${API_URL}/api/dashboards/${dashboardId}/tasks`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(taskData)
	});

	const responseData = await response.json();

	if (!response.ok) {
		throw new Error(responseData.message || "Task creation failed");
	}

	return responseData;
}

export async function getAllTasks(): Promise<TaskData[]> {
	const response = await fetch(`${API_URL}/api/tasks`);
	const responseData = await response.json();

	if (!response.ok) {
		throw new Error(responseData.message || "Failed to fetch tasks");
	}

	return responseData;
}

export async function updateTask(taskId: number, taskData: UpdateTaskData): Promise<TaskData> {
	const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(taskData)
	});

	const responseData = await response.json();

	if (!response.ok) {
		throw new Error(responseData.message || "Failed to update task");
	}

	return responseData;
}

export async function deleteTask(taskId: number): Promise<void> {
	const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
		method: "DELETE"
	});

	if (!response.ok) {
		throw new Error("Failed to delete task");
	}
}
