type ResourceLink = {
	_id: string;
	title: string;
	url: string;
};

const links: ResourceLink[] = [];
const studyFlowLinks: ResourceLink[] = [
	{
		_id: "tasks",
		title: "Organize suas tarefas de estudo",
		url: "/dashboard"
	},
	{
		_id: "focus",
		title: "Acompanhe sessões de foco",
		url: "/dashboard"
	},
	{
		_id: "progress",
		title: "Visualize seu progresso semanal",
		url: "/dashboard"
	}
];

export const Info = () => {
	const resources = links.length > 0 ? links : studyFlowLinks;

	return (
		<section>
			<h2 className="section-title">StudyFlow</h2>
			<ul className="resources-grid">
				{resources.map((link) => (
					<li className="section" key={link._id}>
						<a href={link.url} className="resource-link" target="_blank" rel="noreferrer">
							<div className="card resource-card">
								<div className="resource-content">
									<span className="resource-title">{link.title}</span>
								</div>
							</div>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
};
