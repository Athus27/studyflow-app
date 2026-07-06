import { Link } from "react-router-dom";

export const Login = () => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<section className="user-page">
			<h1 className="text-center">Enter Your Credentials</h1>

			<form className="input-form" onSubmit={handleSubmit}>
				<input className="input" type="text" name="username" placeholder="Username" />
				<input className="input" type="password" name="password" placeholder="Password" />

				<button className="button" type="submit">
					Login
				</button>

				<Link to="/register" className="link-style">
					Não cadastrado? Clique aqui para registrar-se
				</Link>
			</form>
		</section>
	);
};
