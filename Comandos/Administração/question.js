const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "perguntas", 
    description: "Atualiza o arquivo form/questions.json aguardando o envio de um arquivo JSON", 
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
      if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            return interaction.reply(`Você não possui permissão para utilizar este comando.`);
        }
        await interaction.reply({
            content: "Por favor, envie um arquivo JSON contendo as perguntas neste canal.\nO formato esperado é:\n```json\n[\"Qual seu nick no Servidor?\", \"Qual sua Idade?\"]\n```",
            ephemeral: true,
        });

        
        const filter = (message) => {
            return (
                message.author.id === interaction.user.id &&
                message.attachments.size > 0 &&
                message.attachments.first().name.endsWith(".json")
            );
        };

       
        const collector = interaction.channel.createMessageCollector({
            filter,
            time: 60000, 
            max: 1, 
        });

        collector.on("collect", async (message) => {
            const attachment = message.attachments.first();

            try {
                
                const response = await fetch(attachment.url);
                const data = await response.json();

                
                if (!Array.isArray(data) || !data.every((item) => typeof item === "string")) {
                    return interaction.channel.send({
                        content: "O arquivo enviado precisa conter um array de strings. Exemplo:\n```json\n[\"Qual seu nick no Servidor?\", \"Qual sua Idade?\"]\n```",
                    });
                }

                
                const filePath = path.resolve("form/questions.json");

                
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

                
                await message.delete();

                return interaction.channel.send("O arquivo `questions.json` foi atualizado com sucesso!");
            } catch (error) {
                console.error(error);

                
                await message.delete();

                return interaction.channel.send("Ocorreu um erro ao processar o arquivo. Certifique-se de que ele esteja no formato correto e tente novamente.");
            }
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
                return interaction.channel.send("Tempo esgotado! Nenhum arquivo foi enviado.");
            }
        });
    },
};
