export const User = () => {
	const handleLogout = () => {
		// TODO: conectar logout quando a autenticação da API estiver pronta.
	};

	return (
		<section className="user-page">
			<h1 className="text-center">Minha Conta</h1>
			<p>Usuário: -</p>
			<p>Email: -</p>

			<button type="button" className="button" onClick={handleLogout}>
				Sair da conta
			</button>
		</section>
	);
};
