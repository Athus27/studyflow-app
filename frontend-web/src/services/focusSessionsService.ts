import type { CreateFocusSessionData, FocusSessionData } from "../types/focusSession";

const API_URL = "http://localhost:5000";

export async function getFocusSessions(userId?: number): Promise<FocusSessionData[]> {
	const searchParams = userId ? `?userId=${userId}` : "";
	const response = await fetch(`${API_URL}/api/focus-sessions${searchParams}`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch focus sessions");
	}

	return data;
}

export async function addFocusSession(focusSessionData: CreateFocusSessionData): Promise<FocusSessionData> {
	const response = await fetch(`${API_URL}/api/focus-sessions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(focusSessionData)
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to create focus session");
	}

	return data;
}

export async function deleteFocusSession(focusSessionId: number): Promise<void> {
	const response = await fetch(`${API_URL}/api/focus-sessions/${focusSessionId}`, {
		method: "DELETE"
	});

	if (!response.ok) {
		throw new Error("Failed to delete focus session");
	}
}
