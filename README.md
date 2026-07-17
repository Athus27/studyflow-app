# CSI606-2026-01 - Remoto - Proposta de Trabalho Final

**Discente:** Athus Silva Souza - 22.2.8079

## Resumo

O projeto **StudyFlow** é uma aplicação web Full-Stack voltada para organização de estudos, tarefas acadêmicas e sessões de foco. A proposta busca auxiliar estudantes na estruturação da rotina de aprendizado, centralizando em uma única plataforma o planejamento de atividades, o acompanhamento de progresso e a visualização de informações relevantes para a gestão do tempo.

O sistema foi organizado com uma arquitetura separada entre frontend e backend. A interface é construída com **React**, **TypeScript** e **Vite**, enquanto a API é implementada com **Node.js**, **Express** e **Prisma**, utilizando **PostgreSQL** para persistência de dados. O objetivo é aplicar os conteúdos trabalhados na disciplina, incluindo rotas, componentes, API REST, banco de dados e organização modular do projeto.

## 1. Tema

O trabalho final tem como tema o desenvolvimento de uma aplicação web para gerenciamento de estudos. O foco está na organização de tarefas, sessões de foco e acompanhamento de progresso, oferecendo ao usuário uma forma simples de planejar e monitorar sua rotina acadêmica.

## 2. Escopo

O projeto terá as seguintes funcionalidades:

**Módulo de Autenticação**

- Cadastro de usuário.
- Login de usuário.
- Proteção de rotas privadas no frontend.
- Redirecionamento automático entre páginas públicas e privadas.

**Módulo de Tarefas**

- Cadastro de tarefas de estudo.
- Listagem de tarefas.
- Atualização de status da tarefa.
- Remoção de tarefas.
- Organização por estado, como pendente, em andamento ou concluída.

**Módulo de Sessões de Foco**

- Registro de sessões de estudo.
- Associação de sessões a tarefas ou assuntos.
- Histórico simples de sessões realizadas.

**Módulo de Dashboard**

- Tela inicial do usuário autenticado.
- Resumo de tarefas.
- Indicadores simples de progresso.
- Acesso rápido às principais áreas da aplicação.

**Infraestrutura Backend**

- API REST em Node.js e Express.
- Persistência de dados com Prisma e PostgreSQL.
- Separação entre rotas, controllers e camada de acesso ao banco.

## Funcionalidades implementadas

- Cadastro e login de usuários.
- Rotas públicas e privadas no frontend.
- CRUD de dashboards de estudo.
- CRUD de tarefas associadas a dashboards.
- Atualização de status das tarefas.
- Reordenação simples de dashboards e tarefas por prioridade.
- Registro e remoção de sessões de foco.
- Resumo no dashboard com total de tarefas, tarefas concluídas, pendentes e minutos de foco.

## 3. Restrições

Neste trabalho não serão considerados:

- Aplicativo mobile nativo.
- Sincronização offline.
- Notificações push.
- Integração com calendário externo.
- Gamificação avançada.
- Compartilhamento de planos de estudo entre usuários.
- Relatórios estatísticos complexos.

## 4. Protótipos

Protótipos funcionais para as páginas principais estão sendo codificados no diretório `frontend-web` deste repositório.

Estrutura atual do frontend:

![Rotas do frontend](docs-assets/readme/frontend-routes.png)
![Protótipo da interface](docs-assets/readme/frontend-preview.png)
![Estrutura do backend](docs-assets/readme/backend-structure.png)

- **Rotas da aplicação:** `frontend-web/src/routes/`
- **Página de Login:** `frontend-web/src/pages/Login/`
- **Página de Cadastro:** `frontend-web/src/pages/Register/`
- **Dashboard:** `frontend-web/src/pages/Dashboard/`
- **Página de Usuário:** `frontend-web/src/pages/User/`
- **Componentes comuns:** `frontend-web/src/components/common/`
- **Assets visuais:** `frontend-web/src/assets/`

Estrutura atual do backend:

- **Entry point da API:** `server/src/server.js`
- **Configuração do Prisma:** `server/prisma.config.ts`
- **Schema do banco:** `server/prisma/schema.prisma`
- **Controllers:** `server/src/controller/`
- **Rotas:** `server/src/routes/`

A interface utiliza React com Vite, TypeScript e React Router DOM. O backend utiliza Node.js, Express, Prisma e PostgreSQL.

## 5. Referências

EXPRESS. **Express - Node.js web application framework**. Disponível em: <https://expressjs.com/>.

META. **React Documentation**. Disponível em: <https://react.dev/>.

PRISMA. **Prisma Documentation**. Disponível em: <https://www.prisma.io/docs>.

VITE. **Vite Documentation**. Disponível em: <https://vite.dev/>.

POSTGRESQL. **PostgreSQL Documentation**. Disponível em: <https://www.postgresql.org/docs/>.

---

# **CSI606-2026-01 - Remoto - Trabalho Final - Resultados**

## *Discente: Athus Silva Souza - 22.2.8079*

### Resumo

O **StudyFlow** foi desenvolvido como uma aplicação web Full-Stack para auxiliar estudantes na organização da rotina de estudos. O sistema permite cadastrar usuário, fazer login, acessar uma área protegida, criar dashboards de estudo e gerenciar tarefas associadas a esses dashboards.

A versão final centraliza as principais ações em uma interface web simples, com integração entre frontend, API REST e banco de dados. O objetivo principal foi aplicar os conceitos da disciplina em um projeto completo, passando por rotas, componentes, controllers, banco relacional, Prisma e consumo de API pelo React.

### 1. Tecnologias utilizadas - Backend e Frontend

**Backend**

- **Node.js** como ambiente de execução JavaScript.
- **Express** para criação da API REST.
- **Prisma ORM** para modelagem e acesso ao banco de dados.
- **PostgreSQL** como banco de dados relacional.
- **bcrypt** para tratamento de senha no fluxo de autenticação.
- **CORS** para permitir a comunicação entre frontend e backend.

**Frontend**

- **React** para construção da interface.
- **TypeScript** para tipagem do código.
- **Vite** como ferramenta de build e desenvolvimento.
- **React Router DOM** para controle de rotas públicas e privadas.
- **CSS** para estilização das telas e componentes.

### 2. Funcionalidades implementadas

- Cadastro de usuário.
- Login de usuário.
- Proteção de rotas privadas no frontend.
- Redirecionamento entre páginas públicas e privadas.
- Tela de dashboard para o usuário autenticado.
- Cadastro, listagem, edição e remoção de dashboards.
- Cadastro, listagem, edição e remoção de tarefas.
- Associação de tarefas a dashboards.
- Atualização do status das tarefas como concluída ou pendente.
- Organização de dashboards e tarefas por prioridade.
- Resumo de tarefas no dashboard, incluindo total, concluídas e pendentes.
- Separação do backend em rotas, controllers e acesso ao banco com Prisma.

### 3. Funcionalidades previstas e não implementadas

- **Sessões de foco completas:** a proposta previa registro detalhado de sessões de estudo, associação com tarefas e histórico. A versão final priorizou o CRUD de dashboards e tarefas, deixando esse módulo para evolução futura.
- **Relatórios estatísticos mais completos:** foram implementados indicadores simples no dashboard, mas não relatórios avançados, porque o escopo final ficou concentrado nas operações principais do sistema.
- **Integração com calendário externo e notificações:** essas funcionalidades já estavam fora das restrições da proposta e não foram incluídas.
- **Compartilhamento entre usuários:** não foi implementado porque exigiria regras adicionais de permissão e colaboração, aumentando a complexidade do trabalho.

### 4. Outras funcionalidades implementadas

- Ordenação simples por prioridade para dashboards e tarefas.
- Exclusão de dashboards removendo também as tarefas relacionadas.
- Estrutura modular de serviços no frontend para isolar as chamadas HTTP.
- Documentação auxiliar das lógicas de CRUD no arquivo `LOGICASCRUDreadme.md`.
- Uso de rotas protegidas para impedir acesso direto às telas internas sem autenticação local.

### 5. Principais desafios e dificuldades

O principal desafio foi integrar corretamente as camadas do projeto: interface React, serviços HTTP, rotas Express, controllers e Prisma. Para resolver isso, o sistema foi dividido em responsabilidades menores, deixando o frontend responsável pela experiência do usuário e o backend responsável pelas regras de persistência.

Outra dificuldade foi manter o relacionamento entre dashboards e tarefas funcionando de forma consistente. Isso foi resolvido usando relações no Prisma e criando rotas específicas para tarefas dentro de um dashboard.

Também houve atenção à organização do código, pois o projeto envolve várias partes diferentes. A separação em pastas de `routes`, `controller`, `services`, `hooks`, `pages` e `components` ajudou a manter o desenvolvimento mais claro e fácil de explicar.

### 6. Instruções para instalação e execução

**Pré-requisitos**

- Node.js instalado.
- PostgreSQL instalado ou uma instância PostgreSQL disponível.
- Arquivo `.env` configurado no backend com a variável `DATABASE_URL`.

Exemplo de `DATABASE_URL`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/studyflow"
```

**Backend**

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

Por padrão, a API executa em:

```txt
http://localhost:5000
```

**Frontend**

```bash
cd frontend-web
npm install
npm run dev
```

Por padrão, o Vite informa no terminal o endereço local da aplicação, geralmente:

```txt
http://localhost:5173
```

### 7. Referências

EXPRESS. **Express - Node.js web application framework**. Disponível em: <https://expressjs.com/>. Acesso em: 17 jul. 2026.

META. **React Documentation**. Disponível em: <https://react.dev/>. Acesso em: 17 jul. 2026.

PRISMA. **Prisma Documentation**. Disponível em: <https://www.prisma.io/docs>. Acesso em: 17 jul. 2026.

VITE. **Vite Documentation**. Disponível em: <https://vite.dev/>. Acesso em: 17 jul. 2026.

POSTGRESQL. **PostgreSQL Documentation**. Disponível em: <https://www.postgresql.org/docs/>. Acesso em: 17 jul. 2026.
