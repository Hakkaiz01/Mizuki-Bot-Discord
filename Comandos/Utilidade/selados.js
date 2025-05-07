const Discord = require("discord.js")
const selado = require("../../config.json")
const divino = selado.divino
const extremo = selado.extremo
const celestial = selado.celestial
const sombrio = selado.sombrio
const infinito = selado.infinito
const base = 3
const bed1 = 8
const bed2 = 8
const orb = 11


function divino1(Num1, divino) {
    return Num1 * divino;
  };
  function extremo1(Num1, extremo) {
    return Num1 * extremo;
  };
  function celestial1(Num1, celestial) {
    return Num1 * celestial;
  };
  function sombrio1(Num1, sombrio) {
    return Num1 * sombrio;
  };
  function infinito1(Num1, infinito) {
    return Num1 * infinito ;
  };
  function essencias(Num1, base) {
    return Num1 * base;
  }
  function bedr(Num1, bed1) {
    return Num1 * bed1;
  }

function orb1(be1, orb) {
    return be1 * orb;
  }

module.exports = {
  name: 'selado',
  description: 'calcule os valores dos nucleos selados',
	permissions: Discord.PermissionFlagsBits.Administrator,
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: 'quantia',
        description: 'Digite a quantia desejada',
        type: Discord.ApplicationCommandOptionType.Integer,
        required: true,
    },
    {
        name: 'poderselado',
        description: 'Selecione o Poder Selado Desejado',
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
        choices: [
        {name: 'Selado Divino', value: 'divino'},
          {name: 'Selado Extremo', value: 'extremo'},
          {name: 'Selado Celestial', value: 'celestial'},
          {name: 'Selado Sombrio', value: 'sombrio'},
          {name: 'Selado Infinito', value: 'infinito'},
        ]
    },
],

  run: async (client, interaction) => {
    const Num1 = interaction.options.getInteger("quantia");
    let poder = interaction.options.getString("poderselado");
    const div = divino1(Num1, divino);
    const ext = extremo1(Num1, extremo);
    const celest = celestial1(Num1, celestial);
    const sombri = sombrio1(Num1, sombrio);
    const inf = infinito1(Num1, infinito);
    const ess = essencias(Num1, base);
	const be1 = bedr(Num1, bed1)
	const orbs = orb1(be1, orb)

    const di = new Discord.EmbedBuilder()
    .setTitle("DBC Super")
    .setColor("#55FFFF")
    .setThumbnail('https://cdn.discordapp.com/attachments/909620615969898497/1166341145329139773/itemnovo18.png?ex=654a22d6&is=6537add6&hm=ceea3b81e6331ed5fd2e3297dec4d74cfb9bf69eb9db0c1b3cdf197117957c09&')
    .setDescription(`**Poder Selado Divino** Quantia: \`${Num1}\` \n Dbcoins:\`\`${div}k\`\` \nEsponjas: \`\`${ess}\`\` \nDivinas: \`\`${ess}\`\``)
    const ex = new Discord.EmbedBuilder()
    .setTitle("DBC Super")
    .setColor("#FFFF55")
    .setThumbnail('https://cdn.discordapp.com/attachments/909620615969898497/1166341158054666331/itemnovo19.png?ex=654a22d9&is=6537add9&hm=070e836de55224c0af7e7d1dee0f208a24f9627cb2a88bb0cda95c918ca0a408&')
    .setDescription(`**Poder Selado Extremo** Quantia: \`${Num1}\` \n Dbcoins: \`\`${ext}k\`\` \nBedrocks: \`\`${be1}\`\` \nEsponjas: \`\`${ess * 2}\`\` \nEssencias Divinas: \`\`${ess * 2}\`\` \nEssencias Extremas: \`\`${ess}\`\` \nAproximadamente \`\`${orbs}\`\` Orbs da Avançada a Extrema.`)
    const ce = new Discord.EmbedBuilder()
    .setTitle("DBC Super")
    .setColor('#FF55FF')
    .setThumbnail('https://cdn.discordapp.com/attachments/909620615969898497/1166341163515646002/itemnovo20.png?ex=654a22da&is=6537adda&hm=5c1f4ecb44996d0940b61c51b19a5caedeab7b290c586549daa37d8fdd463211&')
    .setDescription(`**Poder Selado Celestial** Quantia: \`${Num1}\` \n Dbcoins: \`\`${celest}kk\`\` Bedrocks: \`\`${be1 * 2}\`\` \nEsponjas: \`\`${ess * 2 * 2}\`\` \nDivinas: \`\`${ess * 2 * 2}\`\` \nEssencias Extremas: \`\`${ess * 2}\`\` \nEssencias Celestiais: \`\`${ess}\`\` \nAproximadamente \`\`${orbs * 2}\`\` Orbs da Avançada a Extrema.`)
    const so = new Discord.EmbedBuilder()
    .setTitle("DBC Super")
    .setColor('#555555')
    .setThumbnail('https://cdn.discordapp.com/attachments/909620615969898497/1166341171698733156/itemnovo21.png?ex=654a22dc&is=6537addc&hm=cd22873eaf1b3923f3408a454a8c66340863da4f202be7c1442b449dd9d51c8d&')
    .setDescription(`**Poder Selado Sombrio** Quantia: \`${Num1}\` \n Dbcoins: \`\`${sombri}kk\`\` Bedrocks: \`\`${be1 * 2 * 2}\`\` \nEsponjas: \`\`${ess * 2 * 2 * 2}\`\` \nDivinas: \`\`${ess * 2 * 2 * 2}\`\` \nEssencias Extremas: \`\`${ess * 2 * 2}\`\` \nEssencias Celestiais: \`\`${ess * 2}\`\` \nEssencias Sombrias: \`\`${ess}\`\` \nAproximadamente \`\`${orbs * 2 * 2}\`\` Orbs da Avançada a Extrema.`)
    const infi = new Discord.EmbedBuilder()
    .setTitle("DBC Super")
    .setColor('#FFFFFF')
    .setThumbnail('https://cdn.discordapp.com/attachments/909620615969898497/1166341179416264724/itemnovo22.png?ex=654a22de&is=6537adde&hm=a422fd40f695fa5c22f3ec3d2957874f055dcdabefd3c004baee4e167db358a2&')
    .setDescription(`**Poder Selado Infinito** Quantia: \`${Num1}\` \n Dbcoins: \`\`${inf}kk\`\` Bedrocks: \`\`${be1 * 2 * 2 * 2}\`\` \nEsponjas: \`\`${ess * 2 * 2 * 2 * 2}\`\` \nDivinas: \`\`${ess * 2 * 2 * 2 * 2}\`\` \nEssencias Extremas: \`\`${ess * 2 * 2 * 2}\`\` \nEssencias Celestiais: \`\`${ess * 2 * 2}\`\` \nEssencias Sombrias: \`\`${ess * 2}\`\` \nEssencias Infinitas: \`\`${ess}\`\` \nAproximadamente \`\`${orbs * 2 * 2 * 2}\`\` Orbs da Avançada a Extrema.`)

    if(!poder) {
     interaction.reply({embeds: [di, ex, ce, so, infi], ephemeral: true})
    }

    if(poder === 'divino') {
        interaction.reply({embeds: [di], ephemeral: true})
    }
    if(poder === 'extremo') {
        interaction.reply({embeds: [ex], ephemeral: true})
    }
    if(poder === 'celestial') {
        interaction.reply({embeds: [ce], ephemeral: true})
    }
    if(poder === 'sombrio') {
       interaction.reply({embeds: [so], ephemeral: true})
    }
    if(poder === 'infinito') {
        interaction.reply({embeds: [infi], ephemeral: true})
    }
	if(!poder){
	  console.log(`O usuario ${interaction.user.tag} usou o comando /selados com a quantia ${Num1} e não selecionou um poder selado`)
	} else {
		console.log(`O usuario ${interaction.user.tag} usou o comando /selados com a quantia ${Num1} e selecionou o selado ${poder}`)
	}
}
}