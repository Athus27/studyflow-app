export const User = () => {
	const user = localStorage.getItem("user");
	const handleLogout = () => {
		// TODO: conectar logout quando a autenticação da API estiver pronta.
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
