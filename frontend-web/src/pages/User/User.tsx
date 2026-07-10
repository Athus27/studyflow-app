import { useNavigate } from "react-router-dom";
import { routePaths } from "../../routes/routePaths";

export const User = () => {
	const navigate = useNavigate();
	const user = localStorage.getItem("user");

	const handleLogout = () => {
		localStorage.removeItem("user");
		navigate(routePaths.login, { replace: true });
	};

	return (
		<section className="user-page">
			<h1 className="text-center">Minha Conta</h1>
			<p>Usuário: {user ? JSON.parse(user).name : "-"}</p>
			<p>Email: {user ? JSON.parse(user).email : "-"}</p>

			<button type="button" className="button" onClick={handleLogout}>
				Sair da conta
			</button>
		</section>
	);
};
