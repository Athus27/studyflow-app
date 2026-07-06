const URL_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

export const locationsService = {
	async getEstados() {
		const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        console.log(response)

		return response.json();
	},

	async getCidades(estadoId: string) {
		const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`);

		return response.json();
	}
};

//fazendo main para testar a função getEstados
(async () => {
    const estados = await locationsService.getEstados();
    // console.log(estados);
})();