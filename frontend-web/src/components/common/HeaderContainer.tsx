// frontend-web/src/types/dashboard.ts
import type { DashboardProps } from "../../types/dashboard";

const HeaderContainer = ({
	dashboard,
	onAddTask,
	onEditDashboard,
	onRemoveDashboard,
	onMoveDashboardUp,
	onMoveDashboardDown,
	isEditing = false,
	isDashboardEditing = false,
	canMoveUp = false,
	canMoveDown = false
}: DashboardProps) => {
	return (
		<div className="header-task">
			<h2>{dashboard.title}</h2>
			<div className="header-task-actions">
				<button type="button" onClick={onAddTask}>
					{isEditing ? "come back" : "Add task"}
				</button>
				<button type="button" onClick={onEditDashboard}>
					{isDashboardEditing ? "come back" : "edit"}
				</button>
				<button type="button" onClick={onRemoveDashboard}>
					remove
				</button>
				<button type="button" onClick={onMoveDashboardUp} disabled={!canMoveUp}>
					up
				</button>
				<button type="button" onClick={onMoveDashboardDown} disabled={!canMoveDown}>
					down
				</button>
			</div>
		</div>
	);
};

export default HeaderContainer;
