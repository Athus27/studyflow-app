export type TaskData = {
	    id: number;
	    text?: string;
	    title?: string;
	    description?: string;
	    completed?: boolean;
	    priority?: number;
	    dueDate?: string;
	    dashboardId?: number;
	};
	
	export type TaskProps = {
	    task: TaskData;
	    onUpdate?: (task: TaskData) => void;
	    onRemove?: (taskId: number) => void;
	    onMoveUp?: (task: TaskData) => void;
	    onMoveDown?: (task: TaskData) => void;
	    canMoveUp?: boolean;
	    canMoveDown?: boolean;
	};  
