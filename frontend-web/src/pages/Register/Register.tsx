import { useState } from "react";
import { RegisterPage } from "./RegisterPage";
import {useLocations} from "../../hooks/useLocations";

export const Register = () => {
	const { estadoSelecionado, setEstadoSelecionado, listaEstados, listaCidades } = useLocations();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
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
		/>
	);
};
