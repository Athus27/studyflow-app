const URL_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

export const locationsService = {
	async getEstados() {
		const response = await fetch(URL_BASE);

		return response.json();
	},

	async getCidades(estadoId: string) {
		const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`);

		return response.json();
	}
};
