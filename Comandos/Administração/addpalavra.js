const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'addpalavra',
    description: 'Adiciona palavras à lista de bloqueio',
    type: Discord.ApplicationCommandType.CHAT_INPUT,
    options: [
        {
            name: 'palavra',
            description: 'Palavra a ser adicionada à lista de bloqueio',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
		if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: `Você não possui permissão para utilizar este comando.`,
                ephemeral: true
            })
        }
        const palavraNova = interaction.options.getString('palavra').toLowerCase();
        const caminhoArquivo = path.join(__dirname, '../../palavrasblock.json');

        try {
            let palavrasBloqueadas = require(caminhoArquivo);

            if (palavrasBloqueadas.includes(palavraNova)) {
                return interaction.reply({content: `A palavra "${palavraNova}" já está na lista de bloqueio.`, ephemeral: true});
            }

            palavrasBloqueadas.push(palavraNova);

            fs.writeFile(caminhoArquivo, JSON.stringify(palavrasBloqueadas, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({content: 'Ocorreu um erro ao adicionar a palavra à lista de bloqueio.', ephemeral: true});
                }
                console.log(`A palavra "${palavraNova}" foi adicionada à lista de bloqueio.`);
                interaction.reply({content: `A palavra "${palavraNova}" foi adicionada à lista de bloqueio.`, ephemeral: true});
            });
        } catch (error) {
            console.error(error);
            interaction.reply({content: 'Ocorreu um erro ao ler o arquivo de palavras bloqueadas.', ephemeral: true});
        }
    }
};
