const Discord = require('discord.js');
const client = require('../index');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fs = require('fs');
let msg;
let palavrasBloqueadas = [];
const blockedRoles = ['506235729525997578', '1006296306458841098', '388819208362000384', '406885855169609768'];
const staff = '478559798795829248';
const permitido = "893191529903030292"

module.exports = {
  name: "sugestão.js",
};

function palavras() {
    try {
        const data = fs.readFileSync('./palavrasblock.json', 'utf8');
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar as perguntas:', error);
    }
    return [];
}

function palavrasblock(messageContent) {
    return palavrasBloqueadas.some(palavra => {
        const pattern = new RegExp(`\\b${palavra.replace(/[o0]/g, '[o0]').replace(/[i1]/g, '[i1]').replace(/[s5]/g, '[s5]').replace(/[a4]/g, '[a4]')}\\b`, 'gi');
        return pattern.test(messageContent.toLowerCase());
    });
}

function containsLink(messageContent) {
    const regexLinkDc = /www\.discord\.\S+/gi;
    const regexLinkDiscordGG = /discord\.gg\/\S+/gi;
    return regexLinkDc.test(messageContent) || regexLinkDiscordGG.test(messageContent);
}

function links(messageContent) {
    const regexLink = /https?:\/\/(?:www\.)?\S+/gi;
    const regexLinkDiscordGG = /discord\.gg\/\S+/gi;
    return regexLink.test(messageContent) && !regexLinkDiscordGG.test(messageContent);
}

function caracteres(messageContent) {
    const pattern = /(.)\1{3,}/gi; 
    return pattern.test(messageContent);
}

// Verifica mensagens editadas
client.on('messageUpdate', async (oldMessage, newMessage) => {
	 if (!oldMessage.author || oldMessage.author.bot) return;

    if (fs.existsSync('./palavrasblock.json')) {
		palavrasBloqueadas = palavras();
        }

        if (palavrasblock(newMessage.content)) {
            newMessage.delete();
            return newMessage.channel.send(`Sua mensagem contém a palavra \`${palavrasBloqueadas.find(palavra => newMessage.content.toLowerCase().includes(palavra))}\` e foi excluída!`).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });
        }
    
});


client.on('messageCreate', async message => {

if(message.author.bot) return;
	
if (fs.existsSync('./palavrasblock.json')) {
	palavrasBloqueadas = palavras();
	}

	if (!message.ephemeral){

	if (palavrasblock(message.content) && !message.channel.name.startsWith('『📜』')) {
		message.delete();
		const palavraEncontrada = palavrasBloqueadas.find(palavra => message.content.toLowerCase().includes(palavra));
                return message.channel.send(`Sua mensagem contem a palavra \`${palavraEncontrada}\` é por esse motivo foi excluida!`).then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
    }}

if (links(message.content)) {
    const member = message.member;
    const idsCategoriasPermitidas = ['829053970172346449', '632943943780139028', '1166792861392580668', '384254033327816725', '632620541869817876'];
    const blocked = member.roles.cache.some(role => blockedRoles.includes(role.id));

    if (blocked) return;
    if (idsCategoriasPermitidas.includes(message.channel.parentId) || message.channel.name.startsWith('『📸』')) return;
    else {
        message.delete();
        return message.channel.send('Não é permitido o envio de Servidores nesse canal!!').then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 5000);
        });
    }
}

if (containsLink(message.content)) {
    const member = message.member;
    const blocked = member.roles.cache.some(role => blockedRoles.includes(role.id));

    if (blocked) return;

    if (message.channel.name.startsWith('『🌍』') || message.channel.name.startsWith('『📨』')) {
        return;
    }

    if (member.roles.cache.some(role => staff.includes(role.id))) {
        message.delete();
        return message.channel.send('Não é permitido o envio de Servidores nesse canal!!').then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 5000);
        });
    } else {
        message.delete();
        member.ban({ reason: "Divulgação de Servidores" });
        return message.channel.send('Não é permitido o envio de Servidores nesse canal!!').then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 5000);
        });
    }
}

if (containsLink(message.content) && message.channel.id !== permitido) {
    const member = message.member;
    const blocked2 = member.roles.cache.some(role => staff.includes(role.id));
    const blocked = member.roles.cache.some(role => blockedRoles.includes(role.id));
    const idsCategoriasPermitidas = ['829053970172346449'];

    if (idsCategoriasPermitidas.includes(message.channel.parentId) || message.channel.name.startsWith('『📸』') || blocked2 || blocked) {
        return;
    } else {
        message.delete();
        return message.channel.send('Não é permitido o envio de links nesse canal!!').then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 5000);
        });
    }
}
	

 if (message.content) {
	   if (!message.guild) return;
		if (message.author.bot) return;
	   if(message.channel.id !== '1185253405640376370') return;


	if(message.content > 1000) {
		message.delete()
		return message.channel.send(`Sua mensagem passou de mil caracteres e não pode ser enviada!`).then( (msg) => {
			setTimeout( () => {
			msg.delete()
		    }, 8000)
		});
	}

	const regexEmoji = /(<a?:\w+:\d+>)|([\u{1F300}-\u{1F9FF}])/gu;
	const regexLink = /https?:\/\/(?:www\.)?\S+/gi;

	const contemEmoji = regexEmoji.test(message.content);
	const contemLink = regexLink.test(message.content);

    if (contemEmoji || contemLink) {
        // Se a mensagem contém palavras bloqueadas, interrompe o processamento
		message.delete()
        return message.channel.send('Sua Sugestão possui palavras, links ou caracteres bloqueados, remova elas e tente enviar novamente!!').then( (msg) => {
			setTimeout( () => {
			msg.delete()
		    }, 8000)
		});
    }

	    if (message.content.length < 32) {
			message.delete()
    return message.channel.send('Sua mensagem deve ter pelo menos 32 caracteres.').then((msg) => {
        setTimeout(() => {
            msg.delete();
        }, 8000);
    });
}

if (caracteres(message.content)) {
	message.delete()
    return message.channel.send('Sua mensagem contém repetição de Caracteres é por isso n foi enviada!').then((msg) => {
        setTimeout(() => {
            msg.delete();
        }, 8000);
    });
}
	   
        const channelId = await db.get(`canalsugestao_${message.guild.id}`);

        if (message.channel.id !== channelId) return;

        try {
            await message.delete();
        } catch (error) {
            console.error('Erro ao deletar mensagem', error);
        }
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Enviado Por: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**Sugestão:** \n${message.content}`)
			.setTimestamp()
            .setFooter({text: `ID: ${message.author.id}`})
            .setColor("#ffae00")
        msg = embed;

        const row1 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('aceitar_sugestao')
                    .setLabel(`0`)
                    .setStyle(2)
                    .setEmoji('1138219908610662540'),
                new Discord.ButtonBuilder()
                    .setCustomId('recusar_sugestao')
                    .setLabel(`0`)
                    .setStyle(2)
                    .setEmoji('1138219921998876682'),
                new Discord.ButtonBuilder()
                    .setCustomId('mostrar_votos')
                    .setLabel('Mostrar Votos')
                    .setStyle(1)
            );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [row1] });
        db.set(`suggest_${message.id}`, true);

        const thread = await sentMessage.startThread({
            name: `Sugestão Thread - ${message.author.username}`,
            autoArchiveDuration: 60,
            startMessage: message.content
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const userId = interaction.user.id;

    let yesVotes = await db.get(`positivo_${interaction.message.id}`) || [];
    let noVotes = await db.get(`negativo_${interaction.message.id}`) || [];

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('aceitar_sugestao')
                .setLabel(`${yesVotes.length}`)
                .setStyle(2)
                .setEmoji('1138219908610662540'),
            new Discord.ButtonBuilder()
                .setCustomId('recusar_sugestao')
                .setLabel(`${noVotes.length}`)
                .setStyle(2)
                .setEmoji('1138219921998876682'),
            new Discord.ButtonBuilder()
                .setCustomId('mostrar_votos')
                .setLabel('Mostrar Votos')
                .setStyle(1)
        );

    if (interaction.customId === 'aceitar_sugestao' || interaction.customId === 'recusar_sugestao') {
        let r = db.get(`${userId}_${interaction.message.id}`);
        const embed = new Discord.EmbedBuilder()
            .setDescription('Você já votou.')
            .setColor("#2f3136");

        if (r === 1) {
            await db.delete(`${userId}_${interaction.message.id}`);
        } else {
            await db.set(`${userId}_${interaction.message.id}`, 1);

            if (interaction.customId === 'aceitar_sugestao') {
                if (yesVotes.includes(userId)) {
                    const index = yesVotes.indexOf(userId);
                    if (index > -1) {
                        yesVotes.splice(index, 1);
                    }
                } else {
                    yesVotes.push(userId);
                }
                await db.set(`positivo_${interaction.message.id}`, yesVotes);
            } else {
                if (noVotes.includes(userId)) {
                    const index = noVotes.indexOf(userId);
                    if (index > -1) {
                        noVotes.splice(index, 1);
                    }
                } else {
                    noVotes.push(userId);
                }
                await db.set(`negativo_${interaction.message.id}`, noVotes);
            }
        }
        // Atualizar os botões imediatamente após o voto
        row.components[0].setLabel(`${yesVotes.length}`);
        row.components[1].setLabel(`${noVotes.length}`);
        interaction.update({ components: [row] });
    }


    if (interaction.customId === 'mostrar_votos') {
		
		if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: `Você não possui permissão para utilizar este Botão.`,
                ephemeral: true
            })
        }
		
        const yesVotes = await db.get(`positivo_${interaction.message.id}`) || [];
        const noVotes = await db.get(`negativo_${interaction.message.id}`) || [];

        const yesUsernames = yesVotes.map(userId => `<@${userId}>`).join('\n');
        const noUsernames = noVotes.map(userId => `<@${userId}>`).join('\n');

        const embed = new Discord.EmbedBuilder()
          .setColor("#2f3136")

        if (yesUsernames.length > 0) {
            embed.addFields({ name: 'Votação positiva', value: yesUsernames, inline: true });
        } else {
            embed.addFields({ name: 'Votação positiva', value: 'Sem votação', inline: true });
        }

        if (noUsernames.length > 0) {
            embed.addFields({ name: 'Votação negativa', value: noUsernames, inline: true });
        } else {
            embed.addFields({ name: 'Votação negativa', value: 'Sem votação', inline: true });
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
    }


})