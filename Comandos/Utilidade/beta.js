const Discord = require("discord.js");
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();
const logFile = './logs/prompts.txt';
module.exports = {
    name: 'gpt',
    description: 'Digite seu prompt para que o bot responda',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: 'prompt',
        description: 'Diga o que precisa!',
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
    }],


    run: async (client, interaction) => {
        const prompt = interaction.options.getString("prompt");
        const allowedRoles = ['1175883641746890803', '1175883676098248764', '1175883724320157766', '1175883805857423410', '1175883842205261937', '743576281102418021'];
        const allowedChannelId = '1176553978692112434'; 
		const user = await client.users.fetch(interaction.user.id);

        const hasAllowedRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));
        const isAllowedChannel = interaction.channelId === allowedChannelId;
        const allowedChannel = interaction.guild.channels.cache.get(allowedChannelId);
        if (!hasAllowedRole) {
            return interaction.reply({content: `Você não tem permissão para usar este comando.`, ephemeral: true});
        }
        if(!isAllowedChannel){
            return interaction.reply({content:`Você não está no canal correto, vá para o canal ${allowedChannel} para utilizar esse comando!`, ephemeral: true})
        }
    
        interaction.reply({content: "Carregando...", ephemeral: true}).then(async (msg) => {
            setTimeout(() => {
                msg.edit(`\`Solicitado por ${interaction.user.username}\` \n\`Prompt: ${prompt}\``);
            }, 3000);

    
            let response = await kand.conversationAnimeBotChat({
                message: `${prompt}`,
            });
    
            
            if (typeof response === 'object' && response.content) {
                response = response.content; 
            }
    
            
            const maxLength = 3000;
            const splitMessages = [];
            let tempMessage = "";
    
            response.split(" ").forEach((word) => {
                if ((tempMessage + word).length < maxLength) {
                    tempMessage += (tempMessage === "" ? "" : " ") + word;
                } else {
                    splitMessages.push(tempMessage);
                    tempMessage = word;
                }
            });
    
            if (tempMessage) {
                splitMessages.push(tempMessage);
            }
    
            for (let i = 0; i < splitMessages.length; i++) {
				const message = `Usuario: ${interaction.user.tag} // Prompt: ${prompt} \n ${response}`
                const embed = new Discord.EmbedBuilder()
                    .setDescription(`Parte [${i + 1}/${splitMessages.length}] - ${interaction.user} \n${splitMessages[i]}`)
                    .setColor("Random");
    
                const channel = interaction;
                await user.send({ embeds: [embed], ephemeral: false });
				await msg.edit(`A Resposta foi enviada em seu privado`);
				
            }
        });
    }


};
