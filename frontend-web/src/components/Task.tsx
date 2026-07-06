type TaskData = {
	id: number;
	text: string;
	priority: number;
	dueDate?: string;
};

type TaskProps = {
	task: TaskData;
};

export const Task = ({ task }: TaskProps) => {
	return (
		<div className="task-table">
			<table>
				<thead>
					<tr>
						<th>PRIORITY</th>
						<th>TASK</th>
						{task.dueDate && <th>DUE DATE</th>}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{task.priority}</td>
						<td>{task.text}</td>
						{task.dueDate && <td>{task.dueDate}</td>}
					</tr>
				</tbody>
			</table>
		</div>
	);
};
