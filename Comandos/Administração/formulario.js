const Discord = require("discord.js")
const {
    QuickDB
} = require("quick.db")
const db = new QuickDB()

module.exports = {
    name: "formulário", 
    description: "Abra o painel do formulário para os membros.", 
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: "canal_formulário",
        description: "Canal para enviar o formulário para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }, ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({
                content: `Você não possui permissão para utilizar este comando.`,
                ephemeral: true
            })
        } else {
            const canal_formulario = interaction.options.getChannel("canal_formulário")

            if (canal_formulario.type !== Discord.ChannelType.GuildText) {
                interaction.reply({
                    content: `O canal ${canal_formulario} não é um canal de texto.`,
                    ephemeral: true
                })
            } else {
                await db.set(`canal_formulario_${interaction.guild.id}`, canal_formulario.id)


                let embed = new Discord.EmbedBuilder()
                    .setDescription("Random")
                    .setTitle("Canais Configurados!")
                    .setDescription(`> Canal do Formulário: ${canal_formulario}.`)

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                }).then(() => {
                    let embed_formulario = new Discord.EmbedBuilder()
                        .setColor("#ffae00")
                        .setImage("https://cdn.discordapp.com/attachments/909620615969898497/1166748507651178496/Orange_Gradient_Hello_Discord_Profile_Banner_2.png?ex=654b9e39&is=65392939&hm=0f721371928beba5b9ffd34940ea55f752440dcb71e0eace510f1417f2c23cfb&")
                        .setDescription(`#\n══════  ◖___Formulário___◗ ══════ \nFaça seu formulário clicando no botão abaixo!\n- Requisitos: \n - Responder o formulário o mais formal possível.\n - Estar a no mínimo 1 Semana no Servidor do Discord.\n - Possuir no Minimo 15 anos de idade\n\n- Benefícios:\n - /pagamentostaff\n - Vip Goku ingressando como Estagiário.\n - Vip Boo ao ser promovido para Ajudante.`);

                    let botao = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("formulario")
                        .setLabel("Iniciar Formulário")
                        .setStyle(Discord.ButtonStyle.Secondary)
                    );

                    canal_formulario.send({
                        embeds: [embed_formulario],
                        components: [botao]
                    })
                })
            }
        }
    }
}