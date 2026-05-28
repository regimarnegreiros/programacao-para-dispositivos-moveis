# App de Gestão Financeira

Este projeto consiste em uma aplicação completa de Gestão Financeira, contendo um aplicativo móvel (Frontend com Expo/React Native) e uma API REST (Backend com Node.js, Express, Prisma e MySQL). 

O projeto atende a todos os requisitos e customizações propostos, garantindo isolamento de dados por usuário, segurança e uma interface moderna.

---

## 🚀 Funcionalidades e Requisitos Atendidos

### Frontend
- ✅ Filtro de mês/ano nas telas de Lista e Resumo (`MonthYearPicker`).
- ✅ Gráficos de Pizza na aba de resumo para melhor visualização das despesas.
- ✅ Edição e exclusão de transações via modal acionado por "Toque Longo".
- ✅ Categorias customizadas interativas (grid de ícones do Material Icons).
- ✅ Tela de Login e Registro com validação de acesso, visibilidade de senha e Confirmação de Senha.
- ✅ Mensagem de boas-vindas com o nome do usuário autenticado na tela principal.
- ✅ Layout adaptável com `SafeAreaView` e `KeyboardAvoidingView`.

### Backend
- ✅ Banco de dados relacional MySQL (via Prisma ORM) para persistência permanente.
- ✅ Autenticação robusta utilizando JWT (JSON Web Token) e encriptação de senha com `bcrypt`.
- ✅ Rotas protegidas (middlewares) garantindo o isolamento de dados: cada usuário acessa apenas suas próprias categorias e transações.
- ✅ Validação rígida de requisições utilizando a biblioteca `zod`.
- ✅ API REST completa com rotas de CRUD para Categorias e Transações.
- ✅ Seed populando o banco com as 5 categorias padrões bloqueadas contra exclusão.
- ✅ Variáveis de ambiente configuradas (`.env.example`).
- ✅ Arquivo do Postman exportado para testes.

---

## 🛠️ Como Configurar e Rodar o Projeto

**Pré-requisitos:**
- Node.js 24+
- Servidor MySQL rodando na sua máquina (ex: XAMPP, Docker, etc.) na porta padrão (3306).

### Passo 1: Configurar a API (Backend)

1. Acesse a pasta do backend:
   ```bash
   cd gestao-financeira-api
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` e renomeie para `.env`.
   - Certifique-se de que a `DATABASE_URL` aponta para o seu banco de dados MySQL local. Exemplo:
     ```env
     DATABASE_URL="mysql://root:@localhost:3306/gestao_financeira"
     JWT_SECRET="sua-chave-super-secreta"
     ```
4. Crie o banco de dados, aplique o Schema e popule as categorias padrões:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   > O servidor iniciará na porta **3000**.

### Passo 2: Configurar o Aplicativo (Frontend)

1. Abra um novo terminal e acesse a pasta do frontend:
   ```bash
   cd gestao-financeira
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. O aplicativo tentará detectar o IP da sua máquina automaticamente em modo de desenvolvimento usando o servidor do Expo. (Opcional) Caso o auto-discovery falhe ou você precise forçar um IP diferente, basta criar um arquivo `.env` nesta pasta com a variável `EXPO_PUBLIC_API_URL=http://<SEU_IP>:3000`.
4. Inicie o Expo:
   ```bash
   npx expo start --clear
   ```
5. Para testar:
   - Aperte `a` para abrir no Android Emulator, `i` no iOS Simulator, ou escaneie o QR Code no app "Expo Go" do seu celular.

---

## 🧪 Testando as Rotas com o Postman

Para facilitar a correção e o teste do backend de forma independente, você pode utilizar o **Postman**. 
Já deixamos uma Collection de testes pronta no projeto.

### Como Importar a Collection

1. Abra o Postman.
2. Clique em **Import** e selecione o arquivo que está em:
   `gestao-financeira-api/postman/collection.json`
3. A collection chamada `Gestão Financeira API` será importada contendo todas as requisições documentadas.

### Testando Manualmente e Variáveis de Ambiente

> **Aviso Importante sobre Autenticação:** Como o app agora usa segurança por JWT, você precisa passar um cabeçalho `Authorization: Bearer <TOKEN>` em rotas protegidas. Para simplificar, crie uma conta primeiro ou faça Login para pegar o Token gerado.

1. **Health-check**
   - **GET** `http://localhost:3000/`
   - *Retorna: `{"ok": true, "name": "gestao-financeira-api"}`*

2. **Registro e Login**
   - **POST** `http://localhost:3000/auth/register` (Cria a conta e retorna o token de acesso).
   - **POST** `http://localhost:3000/auth/login` (Autentica e retorna o token de acesso).
   > *Copie o `token` que vier da resposta e cole na aba "Authorization" > "Bearer Token" nas requisições subsequentes.*

3. **Listar Categorias**
   - **GET** `http://localhost:3000/categories`
   - *Retorna as categorias padrão do Seed (e as customizadas do usuário logado).*

4. **Criar Nova Categoria**
   - **POST** `http://localhost:3000/categories`
   - **Body (JSON):**
     ```json
     {
       "name": "health",
       "displayName": "Saúde",
       "icon": "favorite",
       "background": "#FFB6B6",
       "isIncome": false
     }
     ```

5. **Atualizar e Excluir Categoria**
   - **PUT** `http://localhost:3000/categories/:id`
   - **DELETE** `http://localhost:3000/categories/:id`
   > *Ao tentar excluir uma categoria padrão, a API retorna Erro 400 avisando que elas não podem ser removidas.*

6. **Criar Transação**
   - **POST** `http://localhost:3000/transactions`
   - **Body (JSON):**
     ```json
     {
       "description": "Salário de outubro",
       "value": 3500.50,
       "date": "2026-04-29T00:00:00.000Z",
       "categoryId": "<ID_DA_CATEGORIA>"
     }
     ```

7. **Validação de Erros**
   - Se você enviar a rota POST de transação com um `value` faltando ou um dado corrompido, a validação interna via **Zod** será acionada, retornando Erro HTTP `400 Bad Request` com os devidos *details* indicando qual campo falhou.
