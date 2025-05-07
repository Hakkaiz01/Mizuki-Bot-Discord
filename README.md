# 💎 Mizuki Bot

Um bot multifuncional para Discord, projetado para automação, moderação, utilidades, diversão e sistemas avançados de formulários, sugestões, denúncias e staff. Ideal para comunidades que buscam organização, interatividade e automação inteligente.

---

## 📂 Estrutura do Projeto

```
Comandos/
  ! Owner/           # Comandos exclusivos do proprietário
  Administração/     # Moderação, staff, gerenciamento de canais e cargos
  Diversão/          # Comandos interativos e de entretenimento
  Utilidade/         # Utilidades, relatórios, informações e economia
configs/             # Configurações e bancos de dados auxiliares
database.json        # Banco de dados principal
Events/              # Eventos automáticos e sistemas inteligentes
form/                # Dados e controle de formulários
handler/             # Gerenciador de comandos/eventos
logs/                # Logs de erros, prompts e atividades
```

---

## ⚙️ Sistemas Principais

### 🛡️ Sistema de Moderação
- **Comandos:** ban, kick, clear, lock/unlock, punir, add/removestaff, addpalavra (palavras bloqueadas), setnick, cargo.
- **Automação:** anti-link, anti-spam, bloqueio de menções, filtro de palavras, logs de punições.
- **Eventos:** monitoramento em tempo real de mensagens e ações suspeitas.

---

### 📝 Sistema de Formulários
- **Fluxo Dinâmico:** Criação de canais privados para cada formulário, perguntas dinâmicas (configuráveis em `form/questions.json`).
- **Validação:** Controle de tempo, respostas obrigatórias, bloqueio de múltiplos envios.
- **Envio Automático:** Respostas enviadas para análise em canal específico, integração com banco de dados (`form/completedUsers.json`).
- **Gerenciamento:** Banimento de usuários do sistema de formulário (`form/bans.json`).

---

### 💡 Sistema de Sugestões
- **Envio Simples:** Usuários enviam sugestões via comando, que são postadas automaticamente em canal de sugestões.
- **Votação:** Reações automáticas para votação, gerenciamento de sugestões (aprovar, deletar).
- **Threads:** Criação automática de threads para discussão de cada sugestão.

---

### 🚨 Sistema de Denúncias
- **Relatórios:** Usuários podem reportar membros, mensagens ou problemas diretamente pelo bot.
- **Análise:** Equipe recebe denúncias em canal privado, com botões para aprovar, rejeitar ou solicitar mais informações.
- **Punições:** Integração com comandos de moderação para ação rápida.

---

### 🏅 Sistema de Staff & Avaliação
- **Avaliação:** Membros da staff podem ser avaliados por usuários, com coleta de feedback e cálculo de média.
- **Feedback:** Mensagens automáticas de agradecimento e atualização de status.
- **Banco de Dados:** Histórico de avaliações e desempenho da equipe.

---

### 🎉 Outros Recursos
- **Diversão:** Comandos hug, kiss, slap e outros para interação entre membros.
- **Utilidades:** ping, botinfo, userinfo, savecash, enquetes, sorteios, relatórios.
- **Logs:** Registro detalhado de erros, comandos executados e atividades suspeitas.

---

## 🚀 Como Usar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o `config.json` com tokens, IDs e canais necessários.
3. Inicie o bot:
   ```bash
   node index.js
   ```

---

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/)
- [discord.js](https://discord.js.org/)
- [quick.db](https://www.npmjs.com/package/quick.db) (armazenamento rápido)

---

## 📑 Observações

- Modular e expansível: fácil adicionar novos comandos e eventos.
- Logs detalhados para manutenção e auditoria.
- Estrutura pronta para integração com outros sistemas e APIs.

---
