import type { TaskData } from "../types/task";

export type DashboardData = {
	id: number;
	title: string;
	description: string;
	priority?: number;
	userId?: number;
	createdAt: string;
	updatedAt: string;
	tasks?: TaskData[];
};

export type DashboardProps = {
	dashboard: DashboardData;
	onAddTask?: () => void;
	onEditDashboard?: () => void;
	onRemoveDashboard?: () => void;
	onMoveDashboardUp?: () => void;
	onMoveDashboardDown?: () => void;
	isEditing?: boolean;
	isDashboardEditing?: boolean;
	canMoveUp?: boolean;
	canMoveDown?: boolean;
};

// para importar
// import type { DashboardProps } from '../types/dashboard'
