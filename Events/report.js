require('../index')

const Discord = require('discord.js')
const client = require('../index')
const {
    QuickDB
} = require("quick.db");
const db = new QuickDB({
    table: "ticket"
});
const ms = require('ms')
const randomString = require("randomized-string");
const fs = require('fs');

function lerArquivo() {
    try {
        const data = fs.readFileSync('array.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo array.json:', error.message);
        return [];
    }
}

function buscarCodigo(codigo) {
    const arrayData = lerArquivo();

    // Verificar se arrayData é um objeto antes de continuar
    if (typeof arrayData !== 'object' || arrayData === null) {
        console.error('Os dados do arquivo não são um objeto válido.');
        return null;
    }

    // Procurar a chave no objeto
    const codigoEncontrado = arrayData[codigo];

    return codigoEncontrado || null;
}

// Função para remover a entrada correspondente ao código no array.json
function removerCodigo(codigo) {
  const dataFilePath = './array.json';

  if (fs.existsSync(dataFilePath)) {
      try {
          const data = fs.readFileSync(dataFilePath, 'utf8');
          if (data) {
              const dados = JSON.parse(data);

              // Remove a entrada correspondente ao código
              delete dados[codigo];

              // Salva os dados atualizados de volta no arquivo
              fs.writeFileSync(dataFilePath, JSON.stringify(dados, null, 2), "utf-8");
          }
      } catch (error) {
          console.error('Erro ao remover o código:', error);
      }
  }
}

client.on('interactionCreate', async (interaction) => {
	if (interaction.customId === 'analise') {

            const modal = new Discord.ModalBuilder().setCustomId("modal_denuncia").setTitle("Forneça o Codigo da Denuncia")

            const text = new Discord.TextInputBuilder()
                .setCustomId("codigo")
                .setLabel("Digite o Codigo de Denuncia")
                .setPlaceholder("Digite aqui!")
                .setStyle(1)
            const text2 = new Discord.TextInputBuilder()
                .setCustomId("tipo")
                .setLabel("Digite o Tipo da Punição")
                .setPlaceholder("tempban, warn, mute")
                .setStyle(1)
            const text3 = new Discord.TextInputBuilder()
                .setCustomId("tempo")
                .setLabel("Digite Tempo")
                .setPlaceholder("Exemplo: 1d, 3h")
                .setStyle(1)

            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text))
            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text2))
            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text3))

            return interaction.showModal(modal)

        }
        if (interaction.customId === 'recusado') {
            const modal = new Discord.ModalBuilder().setCustomId("modal_denuncia_recusada").setTitle("Forneça o Codigo da Denuncia")

            const text = new Discord.TextInputBuilder()
                .setCustomId("codigo2")
                .setLabel("Digite o Codigo de Denuncia")
                .setPlaceholder("Digite aqui!")
                .setStyle(1)
                const text2 = new Discord.TextInputBuilder()
                .setCustomId("motivo")
                .setLabel("Digite o Motivo do anulamento")
                .setPlaceholder("Digite aqui!")
                .setStyle(1)

            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text))
            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text2))

            return interaction.showModal(modal)

        }

        if (interaction.isModalSubmit() && interaction.customId === "modal_denuncia") {
            const codigo = interaction.fields.getTextInputValue("codigo");
            const tempo = interaction.fields.getTextInputValue("tempo");
            const tipo = interaction.fields.getTextInputValue("tipo");
            const codigoEncontrado = buscarCodigo(codigo);

            if (!codigoEncontrado) {
                return interaction.reply({content: 'Código não encontrado. Por favor, verifique e tente novamente.', ephemeral: true});
            } else {
                console.log(codigoEncontrado)
                const user = interaction.guild.members.cache.get(codigoEncontrado)
                user.send('Sua Denuncia Foi Aceita por um Staff.')

                const Botao = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`abc`)
                        .setDisabled(true)
                        .setLabel(`Denuncia Aceita`)
                        .setStyle(Discord.ButtonStyle.Success),
                    )

                interaction.message.edit({
                    components: [Botao]
                })

                const mensagemOriginal = interaction.message;
                let jogador = ''
                let motivo = ''
                let arquivo = ''

                if (mensagemOriginal.embeds && mensagemOriginal.embeds.length > 0) {
                  const primeiraEmbed = mensagemOriginal.embeds[0];
                
                  const descricaoEmbed = primeiraEmbed.description;
                
                  const jogadorMatch = descricaoEmbed.match(/Jogador: (.+?) \|/);
                  const motivoMatch = descricaoEmbed.match(/Motivo: (.+?)\n/);
                
                  jogador = jogadorMatch ? jogadorMatch[1].trim() : null;
                  motivo = motivoMatch ? motivoMatch[1].trim() : null;
                
                }

                if (mensagemOriginal.attachments && mensagemOriginal.attachments.size > 0) {
                  mensagemOriginal.attachments.forEach(anexo => {
                    if (anexo.contentType.startsWith('image')) {
                      arquivo = anexo.url;
                
                    }
                  });
                }



if (!arquivo && mensagemOriginal.content) {
  const linksEncontrados = mensagemOriginal.content.match(/(https?:\/\/[^\s]+)/g);

  if (linksEncontrados && linksEncontrados.length > 0) {
    arquivo = linksEncontrados[0].replace(/\*\*$/g, '');
  }
}

let tempoms = ms(tempo)
            if (isNaN(tempoms)) return interaction.reply({
                ephemeral: true,
                content: 'A opção tempo está inválida: \`' + tempo + '\`.'
            })

const embedfull = new Discord.EmbedBuilder()
                .setTitle("Sistema de Punições")
                .setColor("Red")
                .setTimestamp(new Date(new Date().getTime() + tempoms))
                .setFooter({
                    text: `Termino da Punição:`
                })
                .addFields({
                    name: `Player:`,
                    value: `\`\`\`${jogador}\`\`\``,
                    inline: true
                }, {
                    name: `Tipo da Punição:`,
                    value: `\`\`\`${tipo}\`\`\``,
                    inline: true
                }, {
                    name: `Tempo da punição:`,
                    value: `\`\`\`${tempo}\`\`\``,
                    inline: true
                }, {
                    name: `Motivo da punição:`,
                    value: `\`\`\`${motivo}\`\`\``,
                    inline: true
                }, );

                const channel = interaction.guild.channels.cache.get('1147371479898538014')
                channel.send({embeds: [embedfull]})
                channel.send({content: `Prova: ${arquivo}`})
                removerCodigo(codigo);
                interaction.reply({
                  content: `O dono da Denuncia foi notificado`,
                  ephemeral: true
              })
                await interaction.message.delete()

            }
        }
        if (interaction.isModalSubmit() && interaction.customId === "modal_denuncia_recusada") {
            const codigo = interaction.fields.getTextInputValue("codigo2");
            const motivo = interaction.fields.getTextInputValue("motivo");
            const codigoEncontrado = buscarCodigo(codigo);

            if (!codigoEncontrado) {
                return interaction.reply({
                    content: 'Código não encontrado. Por favor, verifique e tente novamente.',
                    ephemeral: true
                });
            } else {
                removerCodigo(codigo);
                const user = interaction.guild.members.cache.get(codigoEncontrado)
                interaction.reply({
                    content: `O dono da Denuncia foi notificado`,
                    ephemeral: true
                })
                user.send(`Sua Denuncia Foi Recusada por um Staff. \n**Motivo:** ${motivo}`)
                interaction.message.delete()
            }
        }
	
})