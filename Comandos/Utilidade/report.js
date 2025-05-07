const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const randomString = require("randomized-string");
const fs = require("fs");
const path = require("path");
module.exports = {
  name: 'report',
  description: 'Reportar um jogador',
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    interaction.reply({content: `Report iniciado no seu privado`, ephemeral: true})

    const user = interaction.user;
    
    await user.send('Digite o Nick do jogador:');
    
    try {
      const playerAnswer = await user.dmChannel.awaitMessages({ max: 1, time: 60000, errors: ['time'] });
      const playerNick = playerAnswer.first().content;

      await user.send('Digite o Motivo da Denúncia:');


      const reasonAnswer = await user.dmChannel.awaitMessages({ max: 1, time: 60000, errors: ['time'] });
      const reportReason = reasonAnswer.first().content;

      await user.send('Envie a prova (pode ser um vídeo, imagem ou link):');

      const proofAnswer = await user.dmChannel.awaitMessages({ 
        max: 1, 
        time: 60000, 
        errors: ['time'], 
        filter: (msg) => msg.attachments.size > 0 || msg.content.trim() !== ''
      });


      let proofContent = '';

      var randomToken = randomString
      .generate({ length: 6, charset: "hex" })
      .toUpperCase();

      const aaaaa = randomToken

      const dataToSave = {
        [aaaaa]: interaction.user.id,
      };
      const path = require("path");

const dataFilePath = './array.json';

let existingData = {};
if (fs.existsSync(dataFilePath)) {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        if (data) {
            existingData = JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar os dados existentes:', error);
    }
}

existingData[randomToken] = interaction.user.id;

fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2), (err) => {
    if (err) {
        console.error('Erro ao salvar os dados:', err);
    }
});


      const reportEmbed = new Discord.EmbedBuilder()
        .setTitle('Nova Denúncia')
        .setDescription(`Jogador: ${playerNick} | Motivo: ${reportReason} \n\nCodigo de denuncia: ${aaaaa}\n\nAutor: ${interaction.user}`)
        .setTimestamp();

    const Botao = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
        .setCustomId(`analise`)
        .setLabel(`Aceitar Denúncia`)
        .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
        .setCustomId(`recusado`)
        .setLabel(`Recusar Denúncia`)
        .setStyle(Discord.ButtonStyle.Success)
    )

    const channel = await client.channels.fetch('1200535538181095564');

    if (proofAnswer.first().attachments.size > 0) {
      proofContent = proofAnswer.first().attachments.first().url;

      channel.send({content: '||<@&478559798795829248> || **Prova:**', embeds: [reportEmbed], components: [Botao], files: [proofContent]})

    } else {
      proofContent = proofAnswer.first().content;
      channel.send({content: `**Prova: ${proofContent}**`, embeds: [reportEmbed], components: [Botao]})
    }
      // Envia o embed para um canal privado (substitua 'ID_DO_CANAL' pelo ID do canal desejado)


      await user.send('O relatório foi enviado com sucesso, você será notificado se a denuncia for aceita ou não. Obrigado por reportar!');

    } catch (error) {
      console.error(error);
      await user.send('Tempo expirado ou ocorreu um erro. Por favor, tente novamente.');
    }
  }
};