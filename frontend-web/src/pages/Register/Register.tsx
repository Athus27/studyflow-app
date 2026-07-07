import { RegisterPage } from "./RegisterPage";
import { useLocations } from "../../hooks/useLocations";
import { useRegister } from "../../hooks/useRegister";

export const Register = () => {
	const { estadoSelecionado, setEstadoSelecionado, listaEstados, listaCidades } = useLocations();
	const { register, loading, error, success } = useRegister();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		await register({
			name: String(formData.get("name")),
			username: String(formData.get("username")),
			email: String(formData.get("email")),
			password: String(formData.get("password")),
			state: String(formData.get("Estados")),
			city: String(formData.get("Cidades"))
		});
	};

	const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setEstadoSelecionado(event.currentTarget.value);
	};

	return (
		<RegisterPage
			onSubmit={handleSubmit}
			onEstadoChange={handleEstadoChange}
			estadoSelecionado={estadoSelecionado}
			listaEstados={listaEstados}
			listaCidades={listaCidades}
			loading={loading}
			error={error}
			success={success}
		/>
	);
};
