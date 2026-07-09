// src/hooks/useTasks.ts
import { useState, useCallback } from "react";
import type { TaskData } from "../types/task";
import * as tasksService from "../services/tasksService";

export const useTasks = () => {
	// 1. Estados da Interface
	const [tasks, setTasks] = useState<TaskData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 2. Função para buscar tarefas (GET)
	const fetchTasks = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = (await tasksService.getAllTasks()) as unknown as TaskData[];
			setTasks(data);
		} catch (err) {
			setError("Falha ao carregar as tarefas.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 3. Função para criar uma tarefa (POST)
	const addTask = async (dashboardId: number, taskPayload: Omit<TaskData, "id">) => {
		setIsLoading(true);
		setError(null);
		try {
			const newTask = await tasksService.addTask(dashboardId, taskPayload);
			setTasks((prevTasks) => [...prevTasks, newTask]);
		} catch (err) {
			setError("Falha ao criar a tarefa.");
			throw err; // Permite que o componente lide com o erro se necessário
		} finally {
			setIsLoading(false);
		}
	};

	// 4. Retorno do Hook
	return {
		tasks,
		isLoading,
		error,
		fetchTasks,
		addTask
	};
};
