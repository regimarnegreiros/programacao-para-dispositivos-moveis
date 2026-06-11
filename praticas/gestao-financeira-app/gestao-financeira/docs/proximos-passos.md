# Próximos Passos (Evoluções Futuras)

Este documento foi criado para registrar possíveis melhorias e novas funcionalidades (opcionais) que não foram cobertas no fluxo principal do tutorial, mas que são altamente recomendadas para evoluir o projeto.

### 1. AsyncStorage como cache offline
Encapsular a leitura/escrita no `AsyncStorage` em um arquivo de lib (`lib/storage.js`). A ideia é popular o cache assim que os dados chegarem da API e utilizá-los como *fallback* temporário sempre que houver problemas na rede ou quando o servidor estiver inativo, garantindo maior resiliência ao app.

### 2. Autenticação de Usuários
Atualmente, a API e o App são *single-tenant* (os dados são globais). Um avanço gigantesco para a segurança e controle é introduzir o modelo de Autenticação. Isso envolve:
- Criar a entidade `User` no banco de dados com Prisma.
- Proteger rotas da API exigindo tokens JWT (`Authorization: Bearer <token>`).
- Implementar as rotas de *Login*, *Signup* e possivelmente *Refresh Tokens*.
- Construir as telas de *Login/Registro* no front-end em Expo e proteger as telas internas com o *Expo Router* ou rotas condicionais.

### 3. Edição de Transações
Embora a API e o `GlobalState.jsx` já possuam suporte a atualizar dados (`updateTransaction(id, data)` / `PUT /transactions/:id`), o app em si ainda não dispõe de uma interface (tela/modal) para editar o valor, a data ou a descrição de uma transação.
- **Dica:** O `<TransactionItem>` poderia abrir um formulário pré-preenchido ao ser clicado, em vez de/ou além de suportar exclusão via "long press".

### 4. Filtros e Paginação
- No lado do servidor, permitir via Query Params (ex: `?month=10&year=2026`) que a API devolva apenas transações daquele período.
- No app, implementar abas ou um *Date Picker* focado em meses para ver os gastos isolados de um mês específico em vez de sempre mostrar o acumulado global da história inteira no Resumo.
