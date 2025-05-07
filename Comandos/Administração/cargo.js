const Discord = require("discord.js")

module.exports = {
  name: "cargo", 
  description: "Ganhe cargos clicando nos botões.", 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "cargo",
        description: "Mencione o cargo que deseja ser adicionado no botão.",
        type: Discord.ApplicationCommandOptionType.Role,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        let cargo = interaction.options.getRole("cargo");

        let embed = new Discord.EmbedBuilder()
        .setColor("#006df0")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(`
        > 📌 Apos Clicar Voce Recebera o Cargo : **${cargo}**
        
        > 📌 Caso Queira Retirar O Cargo Clique Novamente No Botão Abaixo.`)
        

        let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("cargo_b")
            .setLabel("Ganhar Cargo!")
            .setStyle(Discord.ButtonStyle.Secondary)
        );

        interaction.reply({ embeds: [embed], components: [botao] })
    }


  }
}