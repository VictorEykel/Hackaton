
# Travel AI ✈️

**Travel AI** é uma plataforma web inteligente de atendimento ao cliente focada em planejamento de viagens, que utiliza inteligência artificial para oferecer suporte personalizado, reservas automatizadas e análise avançada de dados. Nosso objetivo é transformar a experiência do usuário, tornando o planejamento de viagens mais ágil, eficiente e humanizado.

## Estrutura 🗂️
```
/src
    /app
        /api --> Contém todas as rotas e lógicas relacionadas à API.
        /chat --> Rota do chatbot, fluxo e comunicação com o banco de dados.
        /dashboard --> Rota e lógica para o dashboard, inclui relatórios detalhados
    /components 
    /lib  --> Helpers, conexão com MongoDB, integração com n8n
    /services --> Serviços para chamadas HTTP, abstração de APIs externas e workflows n8n
    /hooks --> Custom React hooks para estado e lógica compartilhada
    /types --> Tipos TypeScript para mensagens, dados, respostas
    /styles

```
## API's 🔌
Cada pasta dentro de `/src/app/api` representa uma rota API REST, responsável por uma funcionalidade específica:
- `/api/chat`: Handler e lógica do chatbot, gerencia fluxo e contexto
- `/api/dashboard`: Dados para KPIs e relatórios do dashboard 
- `/api/atendimentos`: Gerencia operações relacionadas a atendimentos ao cliente, incluindo criação, atualização e consulta.  

- `/api/messages`: Responsável pelo gerenciamento das mensagens trocadas no sistema, incluindo envio, recebimento e histórico.  


- `/api/conversations`: Controla o fluxo das conversas, sessões e contexto entre o usuário e o chatbot.  


- `/api/resumo`: Gera resumos das interações, atendimentos ou dados relevantes para análise rápida. 

## Ferramentas Utilizadas
- **Next.js 15** com Turbopack
- **React** com TypeScript
- **MongoDB** para armazenamento de dados
- **n8n** para automação de fluxos (validação, reservas, finalização)
- **OpenAI** para inteligência artificial

---

## Instalação 🚀
1. Clone o repositório:

> git clone https://github.com/VictorEykel/Hackaton
> cd Hackaton

2. Instale as dependências:

> pnpm install

3. Configure as variáveis de ambiente no arquivo `.env.local` (exemplo):

> MONGODB_URI=your_mongodb_connection_string
> 
> OPENAI_API_KEY=your_openai_api_key
> N8N_API_URL=your_n8n_api_url

4. Rode a aplicação em modo de desenvolvimento:

> pnpm run dev

5. Acesse no navegador:

> http://localhost:3000