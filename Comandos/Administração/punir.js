const Discord = require("discord.js")
const ms = require('ms')
const fs = require('fs');
const canal = "1147371479898538014"

module.exports = {
    name: 'punir', 
    description: 'aplique uma punição', 
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
            name: 'player',
            description: 'Digite o nick do player',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'tipo',
            description: 'escolha o tipo de punição',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [{
                    name: 'TempBan',
                    value: 'tempban'
                },
                {
                    name: 'Warn',
                    value: 'warn'
                },
                {
                    name: 'Mute',
                    value: 'mute'
                },
            ]
        },
        {
            name: 'motivo',
            description: 'Digite o motivo da punição',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'tempo',
            description: 'Caso a punição seja mute ou tempban digite o tempo (Coloque um tempo em s/d/m.)',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'imagem',
            description: 'Coloque o link da Imagem caso tenha, se n tiver envie a imagem separadamente',
            type: Discord.ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const channel = interaction.guild.channels.cache.get(canal)
        const player = interaction.options.getString("player");
        const tipo = interaction.options.getString("tipo");
        let tempo = interaction.options.getString('tempo')
        let img = interaction.options.getString('imagem')
        const motivo = interaction.options.getString("motivo");


        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: `Você não possui permissão para utilizar este comando.`,
                ephemeral: true
            });
        }

        let bans = [];
        const bansFile = './form/bans.json';

        if (!img) {
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
                    value: `\`\`\`${player}\`\`\``,
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

            if (fs.existsSync(bansFile)) {
                try {
                    const data = fs.readFileSync(bansFile, 'utf8');
                    if (data) {
                        bans = JSON.parse(data);
                    }
                } catch (error) {
                    console.error('Erro ao carregar os bans:', error);
                }
            }

            
            if (!bans.includes(player)) {
                bans.push(player);
            }

            
            fs.writeFile(bansFile, JSON.stringify(bans), (err) => {
                if (err) {
                    console.error('Erro ao salvar os bans:', err);
                }
            });

            interaction.reply({
                content: `Sua Punição foi enviada`,
                ephemeral: true
            })
            channel.send({
                embeds: [embedfull]
            })

        } else {
            let tempoms = ms(tempo)
            if (isNaN(tempoms)) return interaction.reply({
                ephemeral: true,
                content: 'A opção tempo está inválida: \`' + tempo + '\`.'
            })

            const embedfull = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                })
                .setColor("Random")
                .setTimestamp(new Date(new Date().getTime() + tempoms))
                .setFooter({
                    text: `Termino da Punição:`
                })
                .addFields({
                    name: `Player:`,
                    value: `\`\`\`${player}\`\`\``,
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

            if (fs.existsSync(bansFile)) {
                try {
                    const data = fs.readFileSync(bansFile, 'utf8');
                    if (data) {
                        bans = JSON.parse(data);
                    }
                } catch (error) {
                    console.error('Erro ao carregar os bans:', error);
                }
            }

           
            if (!bans.includes(player)) {
                bans.push(player);
            }

            
            fs.writeFile(bansFile, JSON.stringify(bans), (err) => {
                if (err) {
                    console.error('Erro ao salvar os bans:', err);
                }
            });

            interaction.reply({
                content: `Sua Punição foi enviada para ${canal}`,
                ephemeral: true
            })
            channel.send({
                embeds: [embedfull]
            })
            channel.send({
                content: `${img}`
            })

        }

    }
}