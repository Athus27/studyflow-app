import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

export const Login = () => {
	const { login, error, loading } = useLogin();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		//esse trecho serve para capturar os dados do formulário de login quando o usuário envia o formulário. Ele impede o comportamento padrão do formulário (que recarregaria a página) e extrai os valores dos campos de entrada (username e password) para passá-los à função de login.
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		login(username, password);
	};

	return (
		<section className="user-page">
			<h1 className="text-center">Enter Your Credentials</h1>

			<form className="input-form" onSubmit={handleSubmit}>
				<input className="input" type="text" name="username" placeholder="Username" />
				<input className="input" type="password" name="password" placeholder="Password" />

				{error && <p className="form-error">{error}</p>}

				<button className="button" type="submit" disabled={loading}>
					{loading ? "Entrando..." : "Login"}
				</button>

				<Link to="/register" className="link-style">
					Não cadastrado? Clique aqui para registrar-se
				</Link>
			</form>
		</section>
	);
};
