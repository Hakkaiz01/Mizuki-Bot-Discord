const Discord = require('discord.js');
const client = require('../index');
const fs = require('fs');
const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");

const errorLogFile = './logs/logse.txt';
const webhook = new WebhookClient({
  url: ""
});

// Função para lidar com erros
function handleError(error, context) {
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const errorMessage = `Erro em ${timestamp}: ${error}\n`;
  fs.appendFileSync(errorLogFile, errorMessage + error.stack + '\n\n\n');
  console.error('Exceção não tratada:', error);

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle(context.title)
    .setURL(context.url)
    .addFields(
      { name: "Erro", value: `\`\`\`${inspect(error, { depth: 0 }).slice(0, 1000)}\`\`\`` },
      ...(context.fields || [])
    )
    .setTimestamp();

  webhook.send({ embeds: [embed] });
}

// Lidando com interações
client.on("interactionCreate", (interaction) => {
  if (interaction.isAutocomplete() && interaction.commandName == "avaliarstaff") {
    client.slashCommands.get(interaction.commandName)?.autoCompleteRun(interaction);
  }
});

// Eventos de erro
client.on('error', error => {
  handleError(error, { title: "Erro na API do Discord", url: "https://discordjs.guide/popular-topics/errors.html#api-errors" });
});

process.on('unhandledRejection', (reason, promise) => {
  handleError(reason, {
    title: "Rejeição/captura não tratada",
    url: "https://nodejs.org/api/process.html#event-unhandledrejection",
    fields: [{ name: "Promise", value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\`` }]
  });
});

process.on('uncaughtException', (error, origin) => {
  handleError(error, {
    title: "Exceção/captura não capturada",
    url: "https://nodejs.org/api/process.html#event-uncaughtexception",
    fields: [{ name: "Origem", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }]
  });
});

process.on('uncaughtExceptionMonitor', (error, origin) => {
  handleError(error, {
    title: "Monitor de exceção não capturada",
    url: "https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor",
    fields: [{ name: "Origem", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }]
  });
});

process.on('warning', (warn) => {
  handleError(warn, {
    title: "Aviso do monitor de exceção não detectada",
    url: "https://nodejs.org/api/process.html#event-warning"
  });
});
