const Discord = require('discord.js');
const client = require('../index');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    const userId = interaction.user.id;

    if (interaction.isButton()) {
        if (interaction.customId === 'positivo' || interaction.customId === 'negativo') {
            const currentVote = await db.get(`${userId}_${interaction.message.id}`);
            const hasVoted = currentVote != null;

            if (hasVoted && currentVote === interaction.customId) {
                await db.delete(`${userId}_${interaction.message.id}`);

                let positivo1 = await db.get(`positivo_${interaction.message.id}`) || [];
                let negativo1 = await db.get(`negativo_${interaction.message.id}`) || [];

                if (interaction.customId === 'positivo') {
                    positivo1 = positivo1.filter(id => id !== userId);
                    await db.set(`positivo_${interaction.message.id}`, positivo1);
                } else {
                    negativo1 = negativo1.filter(id => id !== userId);
                    await db.set(`negativo_${interaction.message.id}`, negativo1);
                }

                const totalVotos = positivo1.length + negativo1.length;
                let media = 0;

                if (totalVotos > 0) {
                    const diferenca = positivo1.length - negativo1.length;
                    const equilibrio = diferenca / totalVotos;
                    media = 5 + equilibrio * 5;
                }

                media = Math.min(Math.max(media, 0), 10);

                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('positivo')
                            .setLabel(`${positivo1.length}`)
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setEmoji('👍'),
                        new Discord.ButtonBuilder()
                            .setCustomId('negativo')
                            .setLabel(`${negativo1.length}`)
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setEmoji('👎'),
                        new Discord.ButtonBuilder()
                            .setCustomId('media')
                            .setLabel(`Média: ${media.toFixed(1)}`)
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setEmoji('🎭'),
                    );

                await interaction.update({ components: [row] });
                return;
            }

            if (!hasVoted) {
                const modal = new Discord.ModalBuilder()
                    .setCustomId('feedbackModal')
                    .setTitle('Feedback do Staff');

                const feedbackInput = new Discord.TextInputBuilder()
                    .setCustomId('feedbackInput')
                    .setLabel('Deixe seu feedback a respeito do staff')
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setRequired(true);

                const feedbackActionRow = new Discord.ActionRowBuilder().addComponents(feedbackInput);
                modal.addComponents(feedbackActionRow);

                await db.set(`${userId}_votingFor_${interaction.message.id}`, interaction.customId);
                await interaction.showModal(modal);
            } else {
                const embed = new Discord.EmbedBuilder()
                    .setDescription('Você já votou.')
                    .setColor("#2f3136");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'feedbackModal') {
            const feedback = interaction.fields.getTextInputValue('feedbackInput');
            const votingFor = await db.get(`${userId}_votingFor_${interaction.message.id}`);

            let positivo1 = await db.get(`positivo_${interaction.message.id}`) || [];
            let negativo1 = await db.get(`negativo_${interaction.message.id}`) || [];

            await db.set(`${userId}_${interaction.message.id}`, votingFor);

            if (votingFor === 'positivo') {
                positivo1.push(userId);
                await db.set(`positivo_${interaction.message.id}`, positivo1);
            } else {
                negativo1.push(userId);
                await db.set(`negativo_${interaction.message.id}`, negativo1);
            }

            const totalVotos = positivo1.length + negativo1.length;
            let media = 0;

            if (totalVotos > 0) {
                const diferenca = positivo1.length - negativo1.length;
                const equilibrio = diferenca / totalVotos;
                media = 5 + equilibrio * 5;
            }

            media = Math.min(Math.max(media, 0), 10);

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('positivo')
                        .setLabel(`${positivo1.length}`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setEmoji('👍'),
                    new Discord.ButtonBuilder()
                        .setCustomId('negativo')
                        .setLabel(`${negativo1.length}`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setEmoji('👎'),
                    new Discord.ButtonBuilder()
                        .setCustomId('media')
                        .setLabel(`Média: ${media.toFixed(1)}`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setDisabled(true)
                        .setEmoji('🎭'),
                );

            const feedbackChannel = client.channels.cache.get('1255882903414374490');
			const authorName = interaction.message.embeds[0]?.author?.name || 'desconhecido';
			const staffNick = authorName.replace('Staff: ', '');

			const embed = new Discord.EmbedBuilder()
            .setDescription(`> \`Staff:\` \`${staffNick}\`\n> \`Usúario:\` ${interaction.user} \n> \`Voto: ${votingFor}\`\n> \`FeedBack:\` \n\`\`\`${feedback}\`\`\``)
            .setColor("Random")
            .setTimestamp()
			
            feedbackChannel.send({embeds: [embed]});

            await interaction.update({ components: [row] });
        }
    }
});


client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        const staffData = await db.get(`staff_${newMember.id}`);
        if (staffData && staffData.messageId) {
            const messageId = staffData.messageId;
            const canal = await newMember.guild.channels.fetch('1185606991490600980');
            const message = await canal.messages.fetch(messageId);

            if (message) {
                const memberRoles = newMember.roles.cache;
                const sortedRoles = memberRoles.sort((a, b) => b.position - a.position);
                const cargoMaisAlto = sortedRoles.first();
                let cor;

                // Defina as cores com base no cargo mais alto
                const estagiario = '418563420569206784';
                const ajudante = '387042755156770819';
                const Mod = '406885855169609768';
                const configdc = '506235729525997578';
                const config = '1006296306458841098';
                const adm = '388819208362000384';

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

                const embed = new Discord.EmbedBuilder()
                    .setColor(cor)
                    .setAuthor({ name: `Staff: ${newMember.user.username}`, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`- Nick: **${newMember.nickname || newMember.user.username}**\n- Cargo Atual: ${cargoMaisAlto}\n - Clique Abaixo Para Avaliar!`);

                await message.edit({ embeds: [embed] });
            }
        }
    }
});
