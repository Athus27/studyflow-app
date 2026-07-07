const API_URL = "http://localhost:5000";

type LoginData = {
	username: string;
	password: string;
};

type RegisterData = {
	name: string;
	username: string;
	email: string;
	password: string;
	state?: string;
	city?: string;
};


export const usersService = {
	register: async (registerData: RegisterData) => {
		const response = await fetch(`${API_URL}/api/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(registerData)
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || "Register failed");
		}

		return responseData;
	},

	login: async (loginData: LoginData) => {
		const response = await fetch(`${API_URL}/api/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(loginData)
		});

		const responseData = await response.json();
		//para tratar as mensagens de erro retornadas pelo servidor durante o processo de login. Se a resposta da requisição não for bem-sucedida (response.ok for false), ele lança um erro com a mensagem retornada pelo servidor (responseData.message) ou uma mensagem padrão "Login failed". Isso permite que o código que chama a função login possa capturar e lidar com esses erros de forma adequada.
		if (!response.ok) {
			throw new Error(responseData.message || "Login failed");
		}

			return responseData;
		}
	};
