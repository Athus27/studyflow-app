import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { routePaths } from "../routes/routePaths";
import { usersService } from "./../services/usersService";

export const useLogin = () => {
	//navigate serve para redirecionar o usuário para outra página após o login bem-sucedido
	const navigate = useNavigate();
	//error é uma variável de estado que armazena mensagens de erro relacionadas ao processo de login. Inicialmente, ela é definida como null, indicando que não há erros. e setError é uma função que permite atualizar o valor da variável de estado error. Quando ocorre um erro durante o login, setError é chamado para definir a mensagem de erro apropriada, que pode ser exibida ao usuário.
	const [error, setError] = useState<string | null>(null);
	//use state(False) serve para indicar que o processo de login está em andamento. Inicialmente, loading é definido como false, indicando que não há carregamento em andamento. Quando o login é iniciado, setLoading é chamado para definir loading como true, e quando o processo de login é concluído (seja com sucesso ou falha), setLoading é chamado novamente para definir loading como false.
	const [loading, setLoading] = useState(false);

	const login = async (username: string, password: string) => {
		try {
			setLoading(true);
			setError("");
			console.log("user logado");
			const user = await usersService.login({ username, password });
			localStorage.setItem("user", JSON.stringify(user));
			navigate(routePaths.dashboard);
		} catch (error) {
			console.error("Erro durante o login:", error);
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("Ocorreu um erro durante o login.");
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		login,
		error,
		loading
	};
};
