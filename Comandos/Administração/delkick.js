const Discord = require("discord.js")
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: 'deldb', 
  description: 'Deletar database de kick e bans', 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: 'user',
        description: 'Digite o Id do usuario a ter a dataBase apagada',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }
],

  run: async (client, interaction) => {
		if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {

            interaction.reply({
                content: `Você não possui permissão para utilizar este comando.`,
                ephemeral: true
            })

        } else {
			let user = interaction.options.getString("user");

			db.delete(`kickCounter_${user}`);
			db.delete(`mentionCounter_${user}`);

			interaction.reply({content: 'DataBase Apagada!', ephemeral: true})
		}

    
  }
}