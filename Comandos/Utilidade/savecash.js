const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
let config = require('../../config.json');

module.exports = {
  name: 'savenick', 
  description: 'Salve Seu Nick para resgatar seu cash proxima temp', 
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    try {
      const rawData = fs.readFileSync(path.join(__dirname, '../../config.json'));
      config = JSON.parse(rawData);
    } catch (error) {
      console.error('Erro ao ler o arquivo config.json:', error);
    }

    if (config.savenick === false) {
      return interaction.reply({
        content: `**O sistema de SaveNick está desabilitado no momento!**`,
        ephemeral: true
      });
    }

    const modal = new Discord.ModalBuilder()
      .setCustomId('savenick_modal')
      .setTitle('Salvar Nickname');


    const nickInput = new Discord.TextInputBuilder()
      .setCustomId('nick')
      .setLabel('Seu nick no servidor')
      .setStyle(Discord.TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow = new Discord.ActionRowBuilder().addComponents(nickInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    client.once('interactionCreate', async modalInteraction => {
      if (!modalInteraction.isModalSubmit()) return;

      if (modalInteraction.customId === 'savenick_modal') {
        const nick = modalInteraction.fields.getTextInputValue('nick');
        const member = modalInteraction.member;
        const canal = interaction.guild.channels.cache.get('1192986494361678025');

        let users = [];
        let nicks = [];

        if (fs.existsSync('./configs/database.json')) {
          try {
            const data = fs.readFileSync('./configs/database.json', 'utf8');
            if (data) {
              users = JSON.parse(data);
              if (!Array.isArray(users)) {
                users = [];
              }
            }
          } catch (error) {
            console.error('Erro ao carregar os IDs dos usuários:', error);
          }
        }

        if (fs.existsSync('./configs/databasenicks.json')) {
          try {
            const data = fs.readFileSync('./configs/databasenicks.json', 'utf8');
            if (data) {
              nicks = JSON.parse(data);
              if (!Array.isArray(nicks)) {
                nicks = [];
              }
            }
          } catch (error) {
            console.error('Erro ao carregar os nicks dos usuários:', error);
          }
        }

        if (users.includes(member.id) || nicks.includes(nick.toLowerCase())) {
          return modalInteraction.reply({
            content: `**Você Já salvou seu Nick ou Seu usuário já está vinculado.**`,
            ephemeral: true
          });
        }

        users.push(member.id);
        nicks.push(nick.toLowerCase());

        fs.writeFile('./configs/database.json', JSON.stringify(users), (err) => {
          if (err) {
            console.error('Erro ao salvar o ID do usuário:', err);
          }
        });

        fs.writeFile('./configs/databasenicks.json', JSON.stringify(nicks), (err) => {
          if (err) {
            console.error('Erro ao salvar os nicks do usuário:', err);
          }
        });

        modalInteraction.reply({ content: `Você foi vinculado ao nick \`${nick}\` com sucesso!`, ephemeral: true })
          .then(() => {
            canal.send(`Usuário: ${member} || Nick: \`${nick}\``)
              .catch(error => console.error('Erro ao enviar mensagem para o canal:', error));
          })
          .catch(error => console.error('Erro ao responder à interação:', error));
      }
    });
  }
};
