const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "addstaff",
    description: "Adicionar um staff.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
            name: "user",
            description: "Mencione um usuário.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "nick",
            description: "Digite o nick do staff.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            interaction.reply(`Você não possui permissão para utilizar este comando.`);
        } else {
            let userr = interaction.options.getUser("user");
            let nick = interaction.options.getString("nick");
            let user = interaction.guild.members.cache.get(userr.id);
            const memberRoles = user.roles.cache;
            const sortedRoles = memberRoles.sort((a, b) => b.position - a.position);
            const cargoMaisAlto = sortedRoles.first();
            const estagiario = '418563420569206784';
            const ajudante = '387042755156770819';
            const Mod = '406885855169609768';
            const configdc = '506235729525997578';
            const config = '1006296306458841098';
            const adm = '388819208362000384';
            const canalid = '1185606991490600980';
            const canal = await interaction.guild.channels.fetch(canalid);
            let cor;

            if (cargoMaisAlto.id === estagiario) {
                cor = '#2ECC71';
            } else if (cargoMaisAlto.id === ajudante) {
                cor = '#F1C40F';
            } else if (cargoMaisAlto.id === Mod) {
                cor = '#00ffff';
            } else if (cargoMaisAlto.id === configdc) {
                cor = '#4169E1';
            } else if (cargoMaisAlto.id === config) {
                cor = '#C27C0E';
            } else if (cargoMaisAlto.id === adm) {
                cor = '#ff0000';
            }

            const row1 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('positivo')
                        .setLabel(`0`)
                        .setStyle(2)
                        .setEmoji('👍'),
                    new Discord.ButtonBuilder()
                        .setCustomId('negativo')
                        .setLabel(`0`)
                        .setStyle(2)
                        .setEmoji('👎'),
                    new Discord.ButtonBuilder()
                        .setCustomId('media')
                        .setLabel(`0.0`)
                        .setStyle(2)
                        .setDisabled(true)
                        .setEmoji('🎭'),
                );

            let embed = new Discord.EmbedBuilder()
                .setColor(cor)
                .setAuthor({ name: `Staff: ${userr.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`- Nick: **${nick}**\n- Cargo Atual: ${cargoMaisAlto}\n - Clique Abaixo Para Avaliar!`);

            const message = await canal.send({ embeds: [embed], components: [row1] });

            await db.set(`staff_${userr.id}`, { messageId: message.id });

            interaction.reply({ content: `Staff ${userr.username} adicionado com sucesso.`, ephemeral: true });
        }
    }
};
