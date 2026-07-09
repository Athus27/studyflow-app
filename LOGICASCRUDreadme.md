# Logicas CRUD - Dashboards e Tasks

Este arquivo explica as atualizacoes feitas para implementar CRUD e prioridade em `Dashboard` e `Task`.

CRUD significa:

- Create: criar um registro.
- Read: listar/buscar registros.
- Update: editar um registro.
- Delete: remover um registro.

Neste projeto, o fluxo completo ficou assim:

```txt
React page
  -> service com fetch
  -> rota Express
  -> controller
  -> Prisma
  -> PostgreSQL
```

## 1. Banco de Dados

O Prisma schema agora salva `priority` tanto em `Dashboard` quanto em `Task`.

```prisma
// server/prisma/schema.prisma
model Dashboard {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  priority    Int      @default(1)
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Conceitos usados:

- `Int`: campo numerico inteiro.
- `String`: campo textual obrigatorio.
- `String?`: campo textual opcional.
- `@default(1)`: se o frontend nao mandar prioridade, o banco usa `1`.
- `@relation`: cria relacao entre tabelas.
- `Dashboard[]`: um usuario pode ter varios dashboards.
- `Task[]`: um dashboard pode ter varias tasks.

Tambem foi adicionado `priority` em `Task`:

```prisma
// server/prisma/schema.prisma
model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Int       @default(1)
  dashboardId Int
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

As migrations criadas foram:

```sql
-- server/prisma/migrations/20260709185534_add_task_priority/migration.sql
ALTER TABLE "Task" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 1;
```

```sql
-- server/prisma/migrations/20260709190258_add_dashboard_priority/migration.sql
ALTER TABLE "Dashboard" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 1;
```

Essas migrations alteram o banco real. O schema muda o modelo do Prisma; a migration muda o PostgreSQL.

## 2. Rotas do Backend

As rotas de dashboard agora aceitam criar, listar, editar e remover.

```js
// server/src/routes/dashboard.js
dashboardRouter.post("/api/dashboards", dashboardController.create);
dashboardRouter.get("/api/dashboards", dashboardController.getAll);
dashboardRouter.patch("/api/dashboards/:dashboardId", dashboardController.update);
dashboardRouter.delete("/api/dashboards/:dashboardId", dashboardController.delete);
```

Conceitos:

- `POST`: cria.
- `GET`: lista.
- `PATCH`: edita parcialmente.
- `DELETE`: remove.
- `:dashboardId`: parametro de rota. Exemplo: `/api/dashboards/1`.

As rotas de task ja estavam assim:

```js
// server/src/routes/task.js
taskRouter.get("/api/tasks", taskController.getAll);
taskRouter.get("/api/dashboards/:dashboardId/tasks", taskController.getByDashboard);
taskRouter.post("/api/dashboards/:dashboardId/tasks", taskController.create);
taskRouter.delete("/api/tasks/:taskId", taskController.delete);
taskRouter.patch("/api/tasks/:taskId", taskController.update);
```

## 3. Controller de Dashboard

### Criar Dashboard

```js
// server/src/controller/DashboardController.js
async create(req, res) {
  const { title, description, userId, priority } = req.body;

  if (!title || !userId) {
    return res.status(400).json({
      code: 400,
      message: "Invalid data request."
    });
  }

  const dashboardCount = await prisma.dashboard.count({
    where: { userId }
  });

  const dashboard = await prisma.dashboard.create({
    data: {
      title,
      description,
      priority: priority ?? dashboardCount + 1,
      userId
    }
  });

  return res.status(201).json(dashboard);
}
```

Conceitos:

- `req.body`: dados enviados pelo frontend.
- `const { title, description } = req.body`: destructuring, pega campos de um objeto.
- `if (!title || !userId)`: validacao minima.
- `prisma.dashboard.count`: conta quantos dashboards o usuario tem.
- `priority ?? dashboardCount + 1`: operador nullish coalescing. Usa `priority` se ele nao for `null` ou `undefined`; senao usa a proxima posicao.
- `res.status(201).json(...)`: resposta HTTP de criacao.

### Listar Dashboards

```js
// server/src/controller/DashboardController.js
const dashboards = await prisma.dashboard.findMany({
  orderBy: {
    priority: "asc"
  },
  include: {
    tasks: {
      orderBy: {
        priority: "asc"
      }
    }
  }
});
```

Conceitos:

- `findMany`: busca varios registros.
- `orderBy`: ordena os resultados.
- `"asc"`: ordem crescente.
- `include`: traz dados relacionados. Aqui cada dashboard ja vem com suas tasks.
- A tela nao precisa buscar tasks separadamente para cada dashboard.

### Editar Dashboard

```js
// server/src/controller/DashboardController.js
const dashboard = await prisma.dashboard.update({
  where: {
    id: dashboardId
  },
  data: {
    title,
    description,
    priority
  },
  include: {
    tasks: {
      orderBy: {
        priority: "asc"
      }
    }
  }
});
```

Conceitos:

- `update`: altera um registro.
- `where: { id: dashboardId }`: escolhe qual dashboard editar.
- `data`: campos que serao atualizados.
- O retorno inclui as tasks para manter o formato esperado pelo frontend.

### Remover Dashboard

```js
// server/src/controller/DashboardController.js
await prisma.$transaction(async (tx) => {
  await tx.task.deleteMany({
    where: {
      dashboardId
    }
  });

  await tx.dashboard.delete({
    where: {
      id: dashboardId
    }
  });
});
```

Conceitos:

- Um dashboard tem tasks.
- Antes de remover o dashboard, removemos as tasks dele.
- `$transaction`: garante que as operacoes rodem como um bloco. Se uma falhar, a outra nao fica pela metade.
- `deleteMany`: remove varias tasks.
- `delete`: remove um dashboard especifico.

## 4. Controller de Task

Task tambem ganhou prioridade.

```js
// server/src/controller/TaskController.js
const task = await prisma.task.create({
  data: {
    title,
    description,
    priority: priority ?? taskCount + 1,
    dashboardId
  }
});
```

A edicao tambem aceita `priority`:

```js
// server/src/controller/TaskController.js
const { title, description, completed, priority } = req.body;

const task = await prisma.task.update({
  where: {
    id: taskId
  },
  data: {
    title,
    description,
    completed,
    priority
  }
});
```

## 5. Services no Frontend

Os services escondem o `fetch` da pagina React. Assim a pagina chama funcoes como `addDashboard`, `updateDashboard`, `deleteDashboard`, sem repetir URL e configuracao de request.

### Dashboard Service

```ts
// frontend-web/src/services/dashboardsService.ts
export async function getDashboards(): Promise<DashboardData[]> {
  const response = await fetch(`${API_URL}/api/dashboards`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboards");
  }

  return data;
}
```

Conceitos:

- `async function`: funcao assincrona.
- `await`: espera uma Promise terminar.
- `fetch`: faz requisicao HTTP.
- `response.ok`: `true` quando o status HTTP esta na faixa 200.
- `Promise<DashboardData[]>`: em TypeScript, indica que a funcao retorna uma promessa de array de dashboards.

Criar dashboard:

```ts
// frontend-web/src/services/dashboardsService.ts
export async function addDashboard(dashboardData: CreateDashboardData): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/api/dashboards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dashboardData)
  });
```

Conceitos:

- `method: "POST"`: cria recurso.
- `headers`: avisa que o corpo esta em JSON.
- `JSON.stringify`: transforma objeto JavaScript em texto JSON.

Editar dashboard:

```ts
// frontend-web/src/services/dashboardsService.ts
export async function updateDashboard(dashboardId: number, dashboardData: UpdateDashboardData): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dashboardData)
  });
```

Remover dashboard:

```ts
// frontend-web/src/services/dashboardsService.ts
export async function deleteDashboard(dashboardId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/dashboards/${dashboardId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete dashboard");
  }
}
```

`Promise<void>` significa: a funcao e assincrona, mas nao retorna dados uteis; apenas conclui ou da erro.

### Task Service

```ts
// frontend-web/src/services/tasksService.ts
export async function updateTask(taskId: number, taskData: UpdateTaskData): Promise<TaskData> {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData)
  });
```

```ts
// frontend-web/src/services/tasksService.ts
export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE"
  });
```

## 6. Types TypeScript

Os tipos dizem para o TypeScript qual e o formato dos dados.

```ts
// frontend-web/src/types/dashboard.ts
export type DashboardData = {
  id: number;
  title: string;
  description: string;
  priority?: number;
  userId?: number;
  createdAt: string;
  updatedAt: string;
  tasks?: TaskData[];
};
```

Conceitos:

- `type`: cria um tipo.
- `id: number`: campo obrigatorio numerico.
- `priority?: number`: campo opcional. O `?` significa que pode existir ou nao.
- `tasks?: TaskData[]`: array opcional de tasks.

Props do componente:

```ts
// frontend-web/src/types/dashboard.ts
export type DashboardProps = {
  dashboard: DashboardData;
  onAddTask?: () => void;
  onEditDashboard?: () => void;
  onRemoveDashboard?: () => void;
  onMoveDashboardUp?: () => void;
  onMoveDashboardDown?: () => void;
  isEditing?: boolean;
  isDashboardEditing?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};
```

Conceitos:

- Props sao dados/funcoes que o componente recebe.
- `() => void`: funcao que nao recebe parametro e nao retorna nada.
- `onAddTask?`: callback opcional.
- `isEditing`: booleano para controlar texto e estado visual.

Task:

```ts
// frontend-web/src/types/task.ts
export type TaskProps = {
  task: TaskData;
  onUpdate?: (task: TaskData) => void;
  onRemove?: (taskId: number) => void;
  onMoveUp?: (task: TaskData) => void;
  onMoveDown?: (task: TaskData) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};
```

## 7. Estado React na Pagina Dashboard

O arquivo principal da tela e:

```txt
frontend-web/src/pages/Dashboard/Dashboard.tsx
```

Ele guarda os dashboards e os inputs dos formularios.

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const [dashboards, setDashboards] = useState<DashboardData[]>([]);
const [showDashboardOptions, setShowDashboardOptions] = useState(false);
const [editingDashboardId, setEditingDashboardId] = useState<number | null>(null);
const [editingDashboardDataId, setEditingDashboardDataId] = useState<number | null>(null);
```

Conceitos:

- `useState`: cria estado em componente React.
- `dashboards`: valor atual.
- `setDashboards`: funcao para atualizar o valor.
- `<DashboardData[]>`: tipo do estado, array de dashboards.
- `number | null`: pode ser numero ou `null`.

Estados separados:

- `editingDashboardId`: controla qual dashboard esta com formulario de nova task aberto.
- `editingDashboardDataId`: controla qual dashboard esta com formulario de edicao do dashboard aberto.
- Isso evita misturar “editar dashboard” com “adicionar task”.

Carregar dados quando a tela abre:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
useEffect(() => {
  getDashboards().then(setDashboards);
}, []);
```

Conceitos:

- `useEffect`: executa efeito colateral.
- Efeito colateral aqui e buscar dados na API.
- `[]`: roda uma vez quando o componente monta.
- `.then(setDashboards)`: quando os dados chegam, salva no estado.

## 8. Criar Dashboard

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const handleCreateDashboard = async () => {
  if (!dashboardTitle.trim()) {
    setDashboardError("Informe o titulo do dashboard.");
    return;
  }

  if (!loggedUser?.id) {
    setDashboardError("Usuario logado nao encontrado.");
    return;
  }
```

Conceitos:

- `trim()`: remove espacos do inicio/fim.
- `return`: para a funcao se a validacao falhar.
- `loggedUser?.id`: optional chaining. Se `loggedUser` for `null`, nao quebra.

Criacao via service:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const newDashboard = await addDashboard({
  title: dashboardTitle,
  description: dashboardDescription,
  userId: loggedUser.id,
  priority: Number(dashboardPriority) || defaultPriority
});

setDashboards((currentDashboards) => [...currentDashboards, { ...newDashboard, tasks: [] }]);
```

Conceitos:

- `Number(dashboardPriority)`: converte string do input para numero.
- `|| defaultPriority`: se nao digitou prioridade, usa uma padrao.
- `setDashboards((currentDashboards) => ...)`: forma segura de atualizar estado baseado no estado anterior.
- `[...currentDashboards, novo]`: spread operator, cria novo array sem mutar o antigo.
- `{ ...newDashboard, tasks: [] }`: spread em objeto, copia os campos e garante `tasks`.

## 9. Editar Dashboard

Abrir/fechar formulario de edicao:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const handleToggleDashboardDataEdit = (dashboard: DashboardData) => {
  if (editingDashboardDataId === dashboard.id) {
    setEditingDashboardDataId(null);
    resetDashboardForm();
    return;
  }

  setEditingDashboardDataId(dashboard.id);
  setDashboardTitle(dashboard.title);
  setDashboardDescription(dashboard.description ?? "");
  setDashboardPriority(String(dashboard.priority ?? ""));
  setDashboardError(null);
};
```

Conceitos:

- Se clicar no mesmo dashboard aberto, fecha.
- Se clicar em outro, carrega os dados dele no formulario.
- `?? ""`: se a descricao vier `null` ou `undefined`, usa string vazia.
- `String(...)`: converte prioridade para texto porque input HTML trabalha com string.

Salvar edicao:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const updatedDashboard = await updateDashboard(dashboardId, {
  title: dashboardTitle,
  description: dashboardDescription,
  priority: Number(dashboardPriority) || 1
});

setDashboards((currentDashboards) =>
  currentDashboards.map((dashboard) => (dashboard.id === dashboardId ? updatedDashboard : dashboard))
);
```

Conceitos:

- `map`: percorre o array e retorna um novo array.
- Se encontrou o dashboard editado, troca pelo retorno da API.
- Se nao encontrou, mantem o dashboard original.
- React precisa de novo array para perceber mudanca de estado.

## 10. Remover Dashboard

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const handleRemoveDashboard = async (dashboardId: number) => {
  try {
    await deleteDashboard(dashboardId);
    setDashboards((currentDashboards) => currentDashboards.filter((dashboard) => dashboard.id !== dashboardId));
```

Conceitos:

- `filter`: cria um novo array mantendo apenas os itens que passam na condicao.
- `dashboard.id !== dashboardId`: remove o dashboard com aquele id.
- Primeiro remove no backend, depois remove da tela.

Tambem limpa formularios abertos relacionados ao dashboard removido:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
if (editingDashboardId === dashboardId) {
  setEditingDashboardId(null);
}

if (editingDashboardDataId === dashboardId) {
  setEditingDashboardDataId(null);
  resetDashboardForm();
}
```

## 11. Mover Dashboard

Mover nao arrasta visualmente. A logica implementada troca as prioridades entre dois dashboards.

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const orderedDashboards = [...dashboards].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
const currentIndex = orderedDashboards.findIndex((dashboard) => dashboard.id === dashboardId);
const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
```

Conceitos:

- `[...dashboards]`: copia o array antes de ordenar.
- `sort`: ordena por prioridade.
- `findIndex`: descobre a posicao do dashboard atual.
- Se direcao for `"up"`, alvo e o item anterior.
- Se direcao for `"down"`, alvo e o proximo item.

Validacao de limite:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedDashboards.length) {
  return;
}
```

Isso impede mover o primeiro dashboard para cima ou o ultimo para baixo.

Troca de prioridade:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const [updatedCurrentDashboard, updatedTargetDashboard] = await Promise.all([
  updateDashboard(currentDashboard.id, { priority: targetPriority }),
  updateDashboard(targetDashboard.id, { priority: currentPriority })
]);
```

Conceitos:

- `Promise.all`: executa as duas requisicoes em paralelo.
- O dashboard atual recebe a prioridade do alvo.
- O dashboard alvo recebe a prioridade do atual.
- Assim a ordem fica persistida no banco.

## 12. Criar Task

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const newTask = await addTask(dashboardId, {
  title: taskTitle,
  description: taskDescription,
  priority: Number(taskPriority) || defaultPriority
});
```

Depois adiciona a task no dashboard certo:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
setDashboards((currentDashboards) =>
  currentDashboards.map((dashboard) => {
    if (dashboard.id !== dashboardId) {
      return dashboard;
    }

    return {
      ...dashboard,
      tasks: [...(dashboard.tasks ?? []), newTask]
    };
  })
);
```

Conceitos:

- O estado principal e `dashboards`.
- Tasks ficam dentro de cada dashboard.
- Para adicionar task, percorremos dashboards, achamos o dashboard certo e adicionamos a task dentro dele.
- `dashboard.tasks ?? []`: se ainda nao tiver tasks, usa array vazio.

## 13. Editar, Remover e Mover Task

O componente `Task` chama services e avisa a pagina pai usando callbacks.

```tsx
// frontend-web/src/components/Task.tsx
const updatedTask = await updateTask(task.id, {
  title: titleInput,
  description: descriptionInput,
  priority: priorityInput || 1
});

onUpdate?.(updatedTask);
```

Conceitos:

- `onUpdate` veio por props.
- `onUpdate?.(...)`: optional chaining para funcao. So chama se existir.
- O componente filho nao altera sozinho a lista geral. Ele avisa o pai.

Remover task:

```tsx
// frontend-web/src/components/Task.tsx
await deleteTask(task.id);
onRemove?.(task.id);
```

Mover task:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const [updatedCurrentTask, updatedTargetTask] = await Promise.all([
  updateTask(currentTask.id, { priority: targetPriority }),
  updateTask(targetTask.id, { priority: currentPriority })
]);
```

A ideia e igual a dashboard: trocar prioridade entre item atual e item alvo.

## 14. Renderizacao Condicional

Exemplo:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
{editingDashboardDataId === dashboard.id && (
  <div className="dashboard-actions">
    ...
  </div>
)}
```

Conceitos:

- JSX aceita expressoes JavaScript dentro de `{}`.
- `condicao && (...)`: renderiza o bloco somente se a condicao for verdadeira.
- Aqui o formulario de edicao aparece apenas para o dashboard selecionado.

Outro exemplo:

```tsx
// frontend-web/src/components/common/HeaderContainer.tsx
<button type="button" onClick={onAddTask}>
  {isEditing ? "come back" : "Add task"}
</button>
```

Conceitos:

- Operador ternario: `condicao ? valorSeTrue : valorSeFalse`.
- Se o formulario esta aberto, mostra `come back`.
- Se esta fechado, mostra `Add task`.

## 15. Props e Comunicacao Pai-Filho

`Dashboard.tsx` e o componente pai. Ele tem o estado principal.

`HeaderContainer.tsx` e `Task.tsx` sao filhos. Eles recebem funcoes por props.

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
<HeaderContainer
  dashboard={dashboard}
  isEditing={editingDashboardId === dashboard.id}
  isDashboardEditing={editingDashboardDataId === dashboard.id}
  canMoveUp={dashboardIndex > 0}
  canMoveDown={dashboardIndex < orderedDashboards.length - 1}
  onAddTask={() => handleToggleDashboardEdit(dashboard.id)}
  onEditDashboard={() => handleToggleDashboardDataEdit(dashboard)}
  onRemoveDashboard={() => handleRemoveDashboard(dashboard.id)}
  onMoveDashboardUp={() => handleMoveDashboard(dashboard.id, "up")}
  onMoveDashboardDown={() => handleMoveDashboard(dashboard.id, "down")}
/>
```

Conceitos:

- `dashboard={dashboard}` passa dados.
- `isEditing={...}` passa booleano.
- `onAddTask={() => ...}` passa funcao.
- O filho nao precisa saber como o estado funciona; ele so chama a funcao.

## 16. Ordenacao na Tela

Dashboards:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
{[...dashboards].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999)).map((dashboard, dashboardIndex, orderedDashboards) => {
```

Tasks:

```tsx
// frontend-web/src/pages/Dashboard/Dashboard.tsx
const orderedTasks = [...tasks].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
```

Conceitos:

- Nunca ordene diretamente o estado original com `dashboards.sort(...)`, porque isso muta o array.
- Use `[...dashboards].sort(...)` para copiar antes.
- `(a.priority ?? 999)` evita quebrar caso alguma prioridade venha vazia.

## 17. Botoes de Movimento

```tsx
// frontend-web/src/components/common/HeaderContainer.tsx
<button type="button" onClick={onMoveDashboardUp} disabled={!canMoveUp}>
  up
</button>
<button type="button" onClick={onMoveDashboardDown} disabled={!canMoveDown}>
  down
</button>
```

Conceitos:

- `disabled`: desativa botao.
- Primeiro dashboard nao pode subir.
- Ultimo dashboard nao pode descer.

Tasks usam a mesma ideia:

```tsx
// frontend-web/src/components/Task.tsx
<button type="button" onClick={() => onMoveUp?.(task)} disabled={isLoading || !canMoveUp}>
  move up
</button>
<button type="button" onClick={() => onMoveDown?.(task)} disabled={isLoading || !canMoveDown}>
  move down
</button>
```

## 18. CSS Adicionado

```css
/* frontend-web/src/index.css */
.header-task-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: flex-end;
}
```

Conceitos:

- `display: flex`: coloca botoes em linha.
- `gap`: espaco entre botoes.
- `flex-wrap: wrap`: se nao couber, quebra linha.
- `justify-content: flex-end`: alinha no fim do header.

## 19. Comandos Executados

Para validar a implementacao:

```bash
# terminal
cd server
npx prisma migrate dev
npx prisma generate
```

```bash
# terminal
cd frontend-web
npm run build
npm run lint
```

Resultado:

- `npm run build`: passou.
- `npm run lint`: passou com dois warnings antigos em hooks nao relacionados.
- `npx prisma migrate dev`: aplicou migrations de prioridade.
- `npx prisma generate`: regenerou Prisma Client.

## 20. Resumo Final da Logica

Dashboard:

- Cria dashboard com `title`, `description`, `userId`, `priority`.
- Lista dashboards ordenados por `priority`.
- Edita dashboard com `PATCH /api/dashboards/:dashboardId`.
- Remove dashboard com `DELETE /api/dashboards/:dashboardId`.
- Remove tambem as tasks do dashboard antes de apagar o dashboard.
- Move dashboard trocando prioridade entre dois dashboards.

Task:

- Cria task dentro de um dashboard.
- Lista tasks ordenadas por `priority`.
- Edita task com `PATCH /api/tasks/:taskId`.
- Remove task com `DELETE /api/tasks/:taskId`.
- Move task trocando prioridade entre duas tasks do mesmo dashboard.

React/TypeScript:

- `useState` guarda dashboards, inputs e erros.
- `useEffect` carrega dashboards quando a tela abre.
- Services centralizam `fetch`.
- Types definem o formato dos dados.
- Componentes filhos recebem callbacks por props.
- Estado principal fica no componente pai `Dashboard.tsx`.
