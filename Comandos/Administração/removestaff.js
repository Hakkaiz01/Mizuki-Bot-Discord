const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "removestaff",
    description: "Remover um staff.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: "user",
        description: "Selecione um usuário para remover do staff.",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
        autocomplete: true,
    }],

    run: async (client, interaction) => {
        
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: `Você não possui permissão para utilizar este comando.`,
                ephemeral: true
            });
        }

        const userr = interaction.options.getUser("user");
        const user = interaction.guild.members.cache.get(userr.id);

        
        if (!user) {
            return interaction.reply({
                content: `O usuário selecionado não está mais presente no servidor.`,
                ephemeral: true
            });
        }

        const cargoEspecificoId = '478559798795829248';

        
        if (!user.roles.cache.has(cargoEspecificoId)) {
            return interaction.reply({
                content: `O usuário selecionado não possui o cargo necessário.`,
                ephemeral: true
            });
        }

        const staffData = await db.get(`staff_${userr.id}`);

        if (staffData && staffData.messageId) {
            try {
                const canal = await interaction.guild.channels.fetch('1185606991490600980');
                const message = await canal.messages.fetch(staffData.messageId);
                if (message) {
                    await message.delete();
                }
            } catch (err) {
                console.error('Erro ao deletar a mensagem:', err);
            }

            
            const rolesToRemove = [user.roles.highest.id, cargoEspecificoId];
            await user.roles.remove(rolesToRemove, 'Removido como staff');

            
            await db.delete(`staff_${userr.id}`);

            return interaction.reply({
                content: `Staff ${userr.username} removido com sucesso.`,
                ephemeral: true
            });
        } else {
            return interaction.reply({
                content: `Usuário ${userr.username} não é um staff ou não foi encontrado.`,
                ephemeral: true
            });
        }
    },

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const cargoEspecificoId = '478559798795829248';
        const membersWithRole = interaction.guild.members.cache.filter(member =>
            member.roles.cache.has(cargoEspecificoId)
        );

        const choices = membersWithRole.map(member => ({
            name: member.user.username,
            value: member.user.id,
        }));

        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
        await interaction.respond(filtered);
    }
};
