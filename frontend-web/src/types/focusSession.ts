export type FocusSessionData = {
	id: number;
	subject: string;
	notes?: string;
	durationMinutes: number;
	userId: number;
	taskId?: number;
	task?: {
		id: number;
		title: string;
	};
	createdAt: string;
	updatedAt: string;
};

export type CreateFocusSessionData = {
	subject: string;
	notes?: string;
	durationMinutes: number;
	userId: number;
	taskId?: number;
};
