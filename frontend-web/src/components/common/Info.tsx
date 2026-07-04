type ResourceLink = {
	_id: string;
	title: string;
	url: string;
};

const links: ResourceLink[] = [];

export const Info = () => {
	return (
		<section>
			<h2 className="section-title">Learn Meteor!</h2>
			<ul className="resources-grid">
				{links.map((link) => (
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
