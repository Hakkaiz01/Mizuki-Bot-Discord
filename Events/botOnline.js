  require('../index')

  const Discord = require('discord.js')
  const client = require('../index')
  const fs = require('fs')
  const logFile = './logs/logs.txt'; // coloque o caminho pro arquivo de log
  const errorLogFile = './logs/logse.txt';
  const { EmbedBuilder, WebhookClient } = require("discord.js");
  const { inspect } = require("util");
  const webhook = new WebhookClient({
    url: "",  // Webhook
  });
  
  client.on('ready', () => {
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const message = `Bot iniciado em ${timestamp}\n\n`;
    fs.appendFileSync(logFile, message);
    console.log(message)
    webhook.send("to online papi")
  });

    let status = [
      {
        name: `👑ㆍDBC Super`,
        type: Discord.ActivityType.Playing
      },
      {
        name: `👨🏼‍🔧ㆍBy: Hakkaiz`,
        type: Discord.ActivityType.Watching
      },
      {
        name: `💫ㆍdbcsuper.com`,
        type: Discord.ActivityType.Playing
      }
    ]


    client.on("ready", async () => {
  client.user.setStatus("dnd"),
          setInterval(async() => {
            let random = Math.floor(Math.random() * status.length);
          client.user.setActivity(status[random]);
      }, 10000);
    })

  process.on('unhandledRejection', error => {
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const errorMessage = `Erro em ${timestamp}: ${error}\n`;
    fs.appendFileSync(errorLogFile, errorMessage + error.stack + '\n\n\n');
    console.error('Exceção não tratada:', error);
  });

  process.on('unhandledRejection', error => {
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const errorMessage = `Erro em ${timestamp}: ${error}\n`;
    fs.appendFileSync(errorLogFile, errorMessage + error.stack + '\n\n\n');
    console.error('Exceção não tratada:', error);
  });



  //Evento do Avaliar Staff (Vai na sua pasta de eventos ou na index)
  client.on("interactionCreate", (interaction) => {
    if(interaction.isAutocomplete() && interaction.commandName == "avaliarstaff"){
      client.slashCommands.get(interaction.commandName)?.autoCompleteRun(interaction)
  }
  });

  client.on('error', error => {
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const errorMessage = `Erro em ${timestamp}: `;
    console.error(errorMessage, error);
    fs.appendFileSync(errorLogFile, errorMessage + error.stack + '\n\n\n');
  });

  const embed = new EmbedBuilder().setColor("Red");

  client.on("error", (err) => {
      console.log(err);

      embed
        .setTitle("Discord API Erro")
        .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
        .setDescription(
          `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.log(reason, "\n", promise);

      embed
        .setTitle("Rejeição/captura não tratada")
        .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
        .addFields(
          {
            name: "Razão",
            value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``,
          },
          {
            name: "Promise",
            value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``,
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtException", (err, origin) => {
      console.log(err, "\n", origin);

      embed
        .setTitle("Exceção/captura não capturada")
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
        .addFields(
          {
            name: "Erro",
            value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
          },
          {
            name: "Origem",
            value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
      console.log(err, "\n", origin);

      embed
        .setTitle("Monitor de exceção não capturada")
        .setURL(
          "https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor"
        )
        .addFields(
          {
            name: "Erro",
            value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
          },
          {
            name: "Origem",
            value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on("warning", (warn) => {
      console.log(warn);

      embed
        .setTitle("Aviso do monitor de exceção não detectada")
        .setURL("https://nodejs.org/api/process.html#event-warning")
        .addFields({
          name: "Aviso",
          value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``,
        })
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });