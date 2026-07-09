const API_URL = "http://localhost:5000";

import type { DashboardData } from "../types/dashboard";

export type CreateDashboardData = Pick<DashboardData, "title" | "description"> & {
	userId: number;
	priority?: number;
};

export type UpdateDashboardData = Partial<Pick<DashboardData, "title" | "description" | "priority">>;

export async function getDashboards(): Promise<DashboardData[]> {
	const response = await fetch(`${API_URL}/api/dashboards`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch dashboards");
	}

	return data;
}

export async function addDashboard(dashboardData: CreateDashboardData): Promise<DashboardData> {
	const response = await fetch(`${API_URL}/api/dashboards`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dashboardData)
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to create dashboard");
	}

	return data;
}

export async function updateDashboard(dashboardId: number, dashboardData: UpdateDashboardData): Promise<DashboardData> {
	const response = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dashboardData)
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to update dashboard");
	}

	return data;
}

export async function deleteDashboard(dashboardId: number): Promise<void> {
	const response = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
		method: "DELETE"
	});

	if (!response.ok) {
		throw new Error("Failed to delete dashboard");
	}
}
