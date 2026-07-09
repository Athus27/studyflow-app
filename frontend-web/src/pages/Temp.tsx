import HeaderContainer from "../components/common/HeaderContainer";

const Temp = () => {
	return (
		<>
			<HeaderContainer
				dashboard={{
					id: 1,
					title: "Tasks",
					description: "This is a temporary page",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					tasks: []
				}}
			/>
		</>
	);
};

export default Temp;
