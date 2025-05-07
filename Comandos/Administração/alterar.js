const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'alterarconfig',
    description: 'Altera o valor da configuração "form".',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: 'valor',
        description: 'Novo valor da configuração (true ou false).',
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: true,
    }],

    run: async (client, interaction) => {
        const {
            value
        } = interaction.options.get('valor');

        if (value === true || value === false) {
            try {
                const configFile = 'config.json';
                const rawData = fs.readFileSync(configFile);
                const config = JSON.parse(rawData);
                config.form = value;
                
                fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

                await interaction.reply({
                    content: `O formulário foi alterado para ${value}`,
                    ephemeral: true
                });
            } catch (error) {
                console.error('Erro ao alterar o valor da configuração:', error);
                await interaction.reply('Ocorreu um erro ao tentar alterar a configuração.');
            }
        } else {
            await interaction.reply('O valor deve ser true ou false.');
        }
    }
};