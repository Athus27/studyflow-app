import { Link } from "react-router-dom";
import { routePaths } from "../../routes/routePaths";

type LocationOption = {
	id: string;
	nome?: string;
	sigla?: string;
};

type RegisterPageProps = {
	error?: string;
	success?: string;
	loading?: boolean;
	estadoSelecionado?: string;
	listaEstados?: LocationOption[];
	listaCidades?: LocationOption[];
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	onEstadoChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const RegisterPage = ({
	error,
	success,
	loading = false,
	onSubmit,
	onEstadoChange,
	estadoSelecionado = "",
	listaEstados = [],
	listaCidades = []
}: RegisterPageProps) => {
	return (
		<section className="user-page">
			<h1 className="text-center">Enter Your Data</h1>

			<form className="input-form" onSubmit={onSubmit}>
				<input className="input" type="text" name="name" placeholder="Name" />
				<input className="input" type="text" name="username" placeholder="Username" />

				<div className="estados">
					<label htmlFor="estados">Address:</label>

					<select className="input select-input" name="Estados" id="estados" defaultValue="" onChange={onEstadoChange}>
						<option value="" disabled>
							State
						</option>

						{listaEstados.map((estado) => (
							<option key={estado.id} value={estado.id}>
								{estado.sigla ?? estado.nome}
							</option>
						))}
					</select>

					{estadoSelecionado && (
						<select className="input select-input select-city" name="Cidades" id="cidades" defaultValue="">
							<option value="" disabled>
								City
							</option>

							{listaCidades.map((cidade) => (
								<option key={cidade.id} value={cidade.id}>
									{cidade.nome}
								</option>
							))}
						</select>
					)}
				</div>

				<input className="input" type="email" name="email" placeholder="Email" />
				<input className="input" type="password" name="password" placeholder="Password" />
				<input className="input" type="password" name="confirmPassword" placeholder="Confirm Password" />

				{error && <p className="form-error">{error}</p>}
				{success && <p className="form-success">{success}</p>}

				<button className="button" type="submit" disabled={loading}>
					{loading ? "Creating..." : "Register"}
				</button>

				<p className="auth-link">
					Já tem conta? <Link to={routePaths.login}>Entrar</Link>
				</p>
			</form>
		</section>
	);
};
