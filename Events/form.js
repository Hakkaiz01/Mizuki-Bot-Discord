require('../index')

const Discord = require('discord.js')
const client = require('../index')
const fs = require('fs');
const path = require('path');
let config = require('../config.json');
const Vibrant = require('node-vibrant');
const { match } = require('assert');

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        // Lendo o arquivo config.json a cada vez que um botão é pressionado
        try {
            const rawData = fs.readFileSync(path.join(__dirname, '../config.json'));
            config = JSON.parse(rawData);
        } catch (error) {
            console.error('Erro ao ler o arquivo config.json:', error);
        }
        if (interaction.customId === "formulario") {
            const user = interaction.user;
            const guild = interaction.guild;
            let nome = `${user.username}-formulário`;
			let categoria = `1166792861392580668`

            if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

            if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                return interaction.reply({
                    content: `❌ Você já possui um formulário aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)} digite **cancelar** nele para poder abrir outro!`,
                    ephemeral: true
                })
            }
            if (config.form === false) return interaction.reply({
                content: `**O Formulário está desabilitado no momento!**`,
                ephemeral: true
            })

            // Carregar IDs de usuários do arquivo

            let questions = [];
            //let completedUsers = [];
            let bans = [];

            // Carregar perguntas do arquivo JSON se existir
            if (fs.existsSync('./form/questions.json')) {
                try {
                    const data = fs.readFileSync('./form/questions.json', 'utf8');
                    if (data) {
                        questions = JSON.parse(data);
                    }
                } catch (error) {
                    console.error('Erro ao carregar as perguntas:', error);
                }
            }

            // Carregar IDs de usuários do arquivo JSON se existir
            //if (fs.existsSync('./form/completedUsers.json')) {
            //    try {
            //        const data = fs.readFileSync('./form/completedUsers.json', 'utf8');
            //        if (data) {
            //            completedUsers = JSON.parse(data);
            //            if (!Array.isArray(completedUsers)) {
            //                completedUsers = [];
            //            }
            //       }
            //   } catch (error) {
            //        console.error('Erro ao carregar os IDs dos usuários:', error);
            //   }
            // }
            // Verifica se o usuário já completou o formulário antes de permitir que ele inicie novamente
            //if (completedUsers.includes(user.id)) {
             //   return interaction.reply({
             //       content: `Você já completou o formulário anteriormente ou você está na lista banidos e não pode fazer o formulário.`,
                  //  ephemeral: true
            //    });
           // }

            // Cria um canal privado para o usuário
            const channel = await guild.channels.create({
                name: `『📜』${user.username}-formulário`,
                type: Discord.ChannelType.GuildText,
                parent: categoria,
                permissionOverwrites: [{
                        id: user.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    },
                ],
            })

            interaction.reply({
                content: `✅ Seu canal de formulário foi aberto em ${channel}!`,
                ephemeral: true
            })

			const inicio = Date.now();

            const avatarURL =  user.displayAvatarURL({ extension: "png" });


            Vibrant.from(avatarURL)
    .getPalette()
    .then((palette) => {
        // Obtém a cor predominante (vibrant)
        const vibrantColor = palette.Vibrant.hex || '#ffffff';

        const em = new Discord.EmbedBuilder().setThumbnail(user.displayAvatarURL({dynamic: true})).setDescription(`#\nBem-vindo ao Seu formulário! \n- Responda às perguntas a abaixo. \n\n> \`Você tem 10 minutos para responder cada pergunta caso contrario o canal será fechado!\` \n\n> \`Não Peça para que nenhum staff leia seu formulário, isso poderá fazer ele ser anulado!\` \n\n> \`Certifique-se de seguir os requisitos ou seu formulário será Anulado!\` \n- \`Para cancelar o formulário digite\` **cancelar**`)
        .setColor(vibrantColor)
        .setTimestamp()
        .setFooter({
            text: `© DBC Super Forms`
        })

    const wel = channel.send({
        content: `${user}`,
        embeds: [em]
    });

    sendNextQuestion();

    })


            let currentQuestion = 0;
			const questionTimeStart = Date.now();

			let sentQuestion;

            
            const sendNextQuestion = async () => {
                const question = questions[currentQuestion];
                currentQuestion++;
                sentQuestion = await channel.send(question);
            };

			const resetAnswers = async (confirmationMessage) => {
                answers.length = 0;
            
                currentQuestion = 0;
            
                if (confirmationMessage) {
                    await confirmationMessage.delete().catch(console.error);
                }
            
                sendNextQuestion();
            };

            const collector = channel.createMessageCollector({
                filter: (msg) => msg.author.id === user.id
            });
            const answers = [];

            const timeLimit = 1200000;

            let timeout;

const sendFinalResponse = async () => {
    const fim = Date.now();

    //completedUsers.push(user.id);

    //fs.writeFile('./form/completedUsers.json', JSON.stringify(completedUsers), (err) => {
    //    if (err) {
    //        console.error('Erro ao salvar os IDs dos usuários:', err);
     //   }
    //});

    const answersChannel = await guild.channels.fetch('1148692375170981948'); // Insira o ID do canal onde as respostas serão enviadas

    const timeTaken1 = fim - inicio; 

    let formdurationstring;

    if (timeTaken1 < 60000) {
        const formdurationseconds = Math.round(timeTaken1 / 1000);
        formdurationstring = `${formdurationseconds} Segundo${formdurationseconds !== 1 ? 's' : ''}`;
    } else {
        const formdurationminutes = Math.floor(timeTaken1 / 60000);
        const remainingsecounds = Math.round((timeTaken1 % 60000) / 1000);
        formdurationstring = `${formdurationminutes} Minuto${formdurationminutes !== 1 ? 's' : ''} e ${remainingsecounds} Segundo${remainingsecounds !== 1 ? 's' : ''}`;
    }

    const avatarURL =  user.displayAvatarURL({ extension: "png" });

    Vibrant.from(avatarURL)
    .getPalette()
    .then((palette) => {
        const vibrantColor = palette.Vibrant.hex || '#ffffff';

        const embed = new Discord.EmbedBuilder().setTitle(`Novo Formulário`).setDescription(`# **Formulário de:**${user}\n**ID:**\`${user.id}\`\n**Entrou em:** \`${user.createdAt}\` \n **Tempo de Conclusão:** \`${formdurationstring}\``).setThumbnail(user.displayAvatarURL({
            dynamic: true
        })).setTimestamp().setColor(vibrantColor);

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("aceitar")
            .setLabel("Aceitar Formulário")
            .setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder()
            .setCustomId("recusar")
            .setLabel("Recusar Formulário")
            .setStyle(Discord.ButtonStyle.Danger)
        )
    
        for (let i = 0; i < questions.length; i++) {
            embed.addFields({
                name: `> ${questions[i]}`,
                value: `\`\`\`${answers[i]}\`\`\``,
                inline: false
            });
        }
    
        answersChannel.send({
            embeds: [embed],
            components: [row]
        });
        channel.send('**Suas Respostas foram registradas.** \nO canal será fechado em 5 segundos');
    })


    setTimeout(() => {
        channel.delete();
    }, 5000);
};

collector.on('collect', async (msg) => {

    clearTimeout(timeout);

    const ban = msg.content.toLowerCase().trim();
    const answer = msg.content;

    if (answer.toLowerCase() === 'cancelar') {
        clearTimeout(timeout);
        channel.send('O formulário foi cancelado pelo usuário. Excluindo o canal em 5 segundos').then(() => {
            setTimeout(() => {
                channel.delete();
                collector.stop();
            }, 5000);
        }).catch(console.error);
        return;
    }

    const maxAnswerLength = 1000;

                if (answer.length > maxAnswerLength) {
                    channel.send(`Sua resposta excedeu o limite de ${maxAnswerLength} caracteres. Por favor, responda novamente.`)
                    currentQuestion--; // Reduz a contagem para refazer a pergunta
                    return sendNextQuestion();
                }

    //if (bans.includes(ban)) {
     //   channel.send('Seu nick foi encontrado na lista de Banimentos/Avisos recentes. Encerrando o formulário.').then(() => {
      //      completedUsers.push(user.id);
       //     fs.writeFile('./form/completedUsers.json', JSON.stringify(completedUsers), (err) => {
       //         if (err) {
      //              console.error('Erro ao salvar os IDs dos usuários:', err);
       //         }
      //      });
       //     setTimeout(() => {
       //         channel.delete();
     //           collector.stop();
      //      }, 5000);
      //  }).catch(console.error);
   //     return;
   // }

    if (fs.existsSync('./palavrasblock.json')) {
        try {
            const data = fs.readFileSync('./palavrasblock.json', 'utf8');
            if (data) {
                palavrasBloqueadas = JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar as perguntas:', error);
        }
    }

    // Verifica se a mensagem contém palavras bloqueadas
    const contemPalavraBloqueada = palavrasBloqueadas.some(palavra => {
        const padrao = new RegExp(`\\b${palavra}\\b`, 'gi');
        return padrao.test(msg.content.toLowerCase());
    });

    const regexEmoji = /(<a?:\w+:\d+>)|([\u{1F300}-\u{1F9FF}])/gu;
    const contemEmoji = regexEmoji.test(msg.content);

    if (contemPalavraBloqueada || contemEmoji) {
        currentQuestion--; 
        channel.send('**Sua Resposta possui palavras/caracteres bloqueados ou emojis, remova e tente enviar novamente sua resposta!**').then((msg1) => {
            setTimeout(() => {
                msg1.delete()
            }, 5000);
        });
        return sendNextQuestion();
    }

    answers.push(answer);

    if (currentQuestion >= questions.length) {
        clearTimeout(timeout);

        const avatarURL =  user.displayAvatarURL({ extension: "png" });

        Vibrant.from(avatarURL)
        .getPalette()
        .then(async(palette) => {
            const vibrantColor = palette.Vibrant.hex || '#ffffff';
    
            const embed = new Discord.EmbedBuilder().setTitle(`# Seu Formulário`).setThumbnail(user.displayAvatarURL({dynamic: true})).setColor(vibrantColor);
        const bot = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("enviar").setStyle(Discord.ButtonStyle.Success).setLabel("Enviar!"),
            new Discord.ButtonBuilder().setCustomId("resetar").setStyle(Discord.ButtonStyle.Danger).setLabel("Resetar !")
        );

        for (let i = 0; i < questions.length; i++) {
            embed.addFields({
                name: `> ${questions[i]}`,
                value: `\`\`\`${answers[i]}\`\`\``,
                inline: false
            });
        }

        const confirmationMessage = await channel.send({embeds: [embed], components: [bot]});
        const confirmationCollector = confirmationMessage.createMessageComponentCollector({componentType: Discord.ComponentType.Button, time: timeLimit});
        confirmationCollector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'resetar') {
                clearTimeout(timeout);
                channel.send('O formulário foi resetado pelo usuário. Reiniciando...').then((ms) => {
                    setTimeout(() => {
                        ms.delete();
                        resetAnswers(confirmationMessage); 
                    }, 1000); 
                }).catch(console.error);
                return;
            } else if (buttonInteraction.customId === "enviar") {
                if (confirmationMessage) {
                    await confirmationMessage.delete().catch(console.error);
                }
                sendFinalResponse();
                return;
            }
        });
        })

        return;
    }

    sendNextQuestion();

    timeout = setTimeout(() => {
        channel.send('O tempo limite foi atingido. O formulário foi cancelado devido à falta de resposta.').then(() => {
            setTimeout(() => {
                channel.delete();
                collector.stop();
            }, 5000);
        }).catch(console.error);
    }, timeLimit);
});

//sendNextQuestion();

timeout = setTimeout(() => {
    // Fecha o canal privado após o tempo limite
    channel.send('O tempo limite foi atingido. O formulário foi cancelado devido à falta de resposta.').then(() => {
        setTimeout(() => {
            channel.delete();
            collector.stop();
        }, 5000);
    }).catch(console.error);
}, timeLimit);
              
        }
    }
});