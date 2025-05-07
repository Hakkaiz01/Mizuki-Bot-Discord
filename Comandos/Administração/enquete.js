const Discord = require("discord.js")
const ms = require('ms')

module.exports = {
    name: 'enquete', 
    description: 'Crie uma enquete no servidor.', 
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
            name: 'tempo',
            description: 'Coloque um tempo em s/m/d.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'canal',
            description: 'Selecione o canal da enquete',
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({
                ephemeral: true,
                content: 'Você não possui permissão para utilizar este comando.'
            })
        } else {
            const tempo = interaction.options.getString('tempo')
            const canal = interaction.options.getChannel('canal')

            let tempoms = ms(tempo)
            if (isNaN(tempoms)) return interaction.reply({
                ephemeral: true,
                content: 'A opção tempo está inválida: \`' + tempo + '\`.'
            })

            const emojis = ['1️⃣', '2️⃣']

            const embed = new Discord.EmbedBuilder()
                .setColor("#0090ff")

                .setDescription(` 
# __Votação De Reset__

*  (${emojis[0]}) Resetar o Servidor e Caminhar para Proxima Temporada:

    - Recompensando o TOP 1 com Uma Medalha de Ouro e o TOP2/TOP3 Com uma Medalha de Prata! ( De Acordo com o PA ) ( Medalha Representativa da Primeira Temporada! )
    - Criação do Kit Dano de Acordo com o PA Salvo!
    - Devolução de Uma Parte dos Cashs Comprados Nessa Temporada! ( De 20% até 100%! )
    - Temporada Mais Focada em PVP!

* (${emojis[1]}) Manter essa Temporada por Mais Tempo!`)
                .setTimestamp(new Date(new Date().getTime() + tempoms))
                .setFooter({
                    text: `Final da enquete:`
                })

            interaction.reply({
                ephemeral: true,
                content: 'Enquete Criada!'
            }).then(() => {
                canal.send({
                    content: `|| @everyone ||`,
                    embeds: [embed]
                }).then((msgg) => {
                    emojis.forEach(emoji => {
                        msgg.react(emoji)
                    })

                    setTimeout(async () => {

                        const msg = await canal.messages.fetch(msgg.id);

                        let emojiOpc1 = msg.reactions.cache.get(emojis[0])?.count || 0;
                        let emojiOpc2 = msg.reactions.cache.get(emojis[1])?.count || 0;
                        // if (msg.reactions.cache.get(emojis[0])?.me) {
                        //   emojiOpc1--
                        // }
                        // if (msg.reactions.cache.get(emojis[1])?.me) {
                        //   emojiOpc2--
                        // }

                        let win
                        if (emojiOpc1 > emojiOpc2) win = `Resetar o Servidor e Caminhar para Proxima Temporada:

    - Recompensando o TOP 1 com Uma Medalha de Ouro e o TOP2/TOP3 Com uma Medalha de Prata! ( De Acordo com o PA ) ( Medalha Representativa da Primeira Temporada! )
    - Criação do Kit Dano de Acordo com o PA Salvo!
    - Devolução de Uma Parte dos Cashs Comprados Nessa Temporada! ( De 20% até 100%! )
    - Temporada Mais Focada em PVP! \n\n**Total de reações: \`${emojiOpc1}\`**`
                        if (emojiOpc2 > emojiOpc1) win = `Manter essa Temporada por Mais Tempo! \n\n**Total de reações: \`${emojiOpc2}\`**`
                        if (emojiOpc1 === emojiOpc2) win = `As duas opções foram votadas igualmente \n\n**Total de reações: \`${emojiOpc1}\`.**`

                        const embedOff = new Discord.EmbedBuilder()
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({
                                    dynamic: true
                                })
                            })
                            .setColor("#b31200")
                            .setThumbnail(interaction.guild.iconURL({
                                dynamic: true
                            }))
                                            .setDescription(` 
# __Votação De Reset__

*  (${emojis[0]}) Resetar o Servidor e Caminhar para Proxima Temporada:

    - Recompensando o TOP 1 com Uma Medalha de Ouro e o TOP2/TOP3 Com uma Medalha de Prata! ( De Acordo com o PA ) ( Medalha Representativa da Primeira Temporada! )
    - Criação do Kit Dano de Acordo com o PA Salvo!
    - Devolução de Uma Parte dos Cashs Comprados Nessa Temporada! ( De 20% até 100%! )
    - Temporada Mais Focada em PVP!

* (${emojis[1]}) Manter essa Temporada por Mais Tempo!`)
                            .setTimestamp(new Date(new Date().getTime() + tempoms))
                            .setFooter({
                                text: `Enquete encerrada às:`
                            })

                        msg.reply({
                            content: `#\n**🔹 Enquete Encerrada 🔹**\n\n **✍ __Opção Mais Votada:__** \n ➥ ${win}`
                        })
                        msg.edit({
                            embeds: [embedOff]
                        }).then(() => {
                            setTimeout(() => {
                                msg.delete()
                            }, 3000)
                        })
                    }, tempoms)
                })
            })
        }
    }
}