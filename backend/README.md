# API de Gerenciamento de Treinos

API para gerenciar planos de treino, sessões, metas de usuários e registros livres de atividades físicas. Construída com foco em arquitetura limpa e escalabilidade, utilizando tecnologias modernas para fornecer uma base sólida para aplicações de fitness.

## ✨ Principais Características

- **Gerenciamento de Planos de Treino**: Crie, liste e gerencie planos de treino personalizados, com suporte a múltiplos tipos de exercícios — musculação, calistenia, corrida, crossfit e treinos híbridos.
- **Exercícios Flexíveis**: Campos como séries, repetições, descanso e ordem são opcionais, suportando modalidades como corrida e cardio que não seguem o formato tradicional.
- **Rastreamento de Sessão**: Inicie e finalize sessões de treino para acompanhar o progresso em tempo real.
- **Registro Livre de Treinos (Training Log)**: Registre atividades sem necessidade de um plano estruturado, com nome e descrição opcionais.
- **Metas de Usuário**: Defina metas em texto livre (ex: "Chegar em 70kg", "Agachar 100kg"), acompanhe o progresso e marque como concluídas.
- **Dados Físicos e Métricas**: Armazene peso, altura, idade, percentual de gordura e gênero. IMC e TMB são calculados automaticamente no frontend.
- **Streak e Consistência**: Calculados considerando tanto sessões do plano de treino quanto registros livres — refletindo toda a atividade física do usuário.
- **Integração com IA**: Geração de planos de treino e atualização de dados do usuário via chat com AI Personal Trainer.
- **Autenticação Segura**: Login com Google OAuth e email/senha via Better Auth, com suporte a múltiplas origens confiáveis.
- **Documentação de API**: Geração automática com Swagger e Scalar (desabilitada em produção).

## 🏗️ Arquitetura

O projeto adota uma arquitetura limpa em camadas, inspirada em princípios do **Domain-Driven Design (DDD)**, **Clean Architecture** e **SOLID**. Isso garante separação de responsabilidades, alta testabilidade e manutenibilidade.

O fluxo de uma requisição segue as seguintes camadas:

1. **Routes (Camada de Roteamento)**: Define os endpoints da API usando `Fastify`. Responsável pela validação dos schemas de entrada e saída com `Zod` via `fastify-type-provider-zod`.
   - _Exemplo: `src/routes/workout-plans/index.ts`_

2. **Controllers (Camada de Controle)**: Intermediários entre HTTP e os casos de uso. Extraem dados da requisição, invocam a factory correspondente e retornam a resposta. Não contêm lógica de negócio. Erros são tratados globalmente pelo `setErrorHandler` do Fastify — sem try/catch nos controllers.
   - _Exemplo: `src/controllers/workout-plan.controller.ts`_

3. **Use Cases (Camada de Casos de Uso)**: O coração da aplicação. Contêm a lógica de negócio pura, orquestrando os modelos de domínio e os repositórios. Trabalham com `InputDto` e `OutputDto` tipados, sem `null` nos retornos — campos opcionais usam `undefined`.
   - _Exemplo: `src/usecases/create-workout-plan.ts`_

4. **Factories**: Instanciam os casos de uso com suas dependências concretas (repositórios Prisma). Ponto central de composição da aplicação.
   - _Exemplo: `src/usecases/factories/make-create-workout-plan.ts`_

5. **Repositories (Camada de Repositório)**: Abstraem o acesso a dados. As interfaces definem o contrato que os casos de uso utilizam — seguindo o Princípio da Inversão de Dependência. Duas implementações concretas por repositório: Prisma (produção) e InMemory (testes). Nos repositórios Prisma, campos `null` do banco são sempre convertidos para `undefined` antes de restaurar os models.
   - _Interface: `src/repositories/interfaces/workout-plan-repository-interface.ts`_
   - _Prisma: `src/repositories/prisma/prisma-workout-plan-repository.ts`_
   - _InMemory: `src/repositories/in-memory/in-memory-workout-plan-repository.ts`_

6. **Models (Camada de Domínio)**: Representam as entidades centrais do negócio. Usam schema Zod para validação interna e expõem apenas getters — estado privado e imutável externamente. Possuem métodos de negócio (`finish()`, `deactivate()`, `complete()`, `updateProgress()`) e dois construtores estáticos: `create()` para novas entidades e `restore()` para reconstruir a partir do banco.
   - _Exemplo: `src/models/workout-plan.model.ts`_

## 🧪 Testes

Testes unitários com **Vitest** usando os repositórios InMemory — sem dependência de banco de dados ou framework HTTP. Convenção `sut` (System Under Test) para nomear a instância sendo testada.

## 🚀 Tecnologias Utilizadas

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Fastify](https://www.fastify.io/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) (via Docker)
- **Testes**: [Vitest](https://vitest.dev/)
- **Validação**: [Zod](https://zod.dev/)
- **Inteligência Artificial**: [Google Gemini API](https://ai.google.dev/)
- **Autenticação**: [better-auth](https://www.npmjs.com/package/better-auth)
- **Containerização**: [Docker](https://www.docker.com/)

## 🏁 Começando

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 24.x)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd treinos-backend
npm install
```

### 2. Configuração do Ambiente

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

Preencha o arquivo `.env` com as credenciais do banco de dados e outras chaves de API necessárias.

### 3. Executando o Banco de Dados

Inicie o contêiner do PostgreSQL com o Docker Compose:

```bash
docker-compose up -d
```

Execute as migrações do Prisma para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev
```

### 4. Executando a Aplicação

Para iniciar o servidor em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

### 5. Executando os Testes

Para rodar todos os testes unitários e de integração:

```bash
npm run teste
```

Para ver a cobertura dos testes:

```bash
npm run teste:coverage
```

## 📚 Documentação da API

Com o servidor em execução, a documentação da API gerada automaticamente está disponível em:

- **Scalar UI**: [http://localhost:3333/docs](http://localhost:3333/docs)

Você pode explorar todos os endpoints, schemas e testá-los diretamente pela interface.

## 🗄️ Schema do Banco de Dados

O schema do banco de dados é gerenciado pelo Prisma e está definido em `prisma/schema.prisma`. As principais entidades são:

- `User`: Armazena informações dos usuários.
- `WorkoutPlan`: Planos de treino, que contêm vários `WorkoutDay`.
- `WorkoutDay`: Dias específicos de treino dentro de um plano, contendo vários `WorkoutExercise`.
- `WorkoutExercise`: Exercícios específicos com séries, repetições, etc.
- `WorkoutSession`: Registra uma sessão de treino ativa ou completada.
- `TrainingLog`: Logs para treinos individuais.
- `UserGoal`: Metas personalizadas para os usuários.
- `Account` / `Session`: Modelos para gerenciamento de autenticação.
