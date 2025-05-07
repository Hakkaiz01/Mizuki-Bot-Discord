require('../index')

const Discord = require('discord.js')
const client = require('../index')


client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    let canal1 = "1165707297247469681"

    const canal = [canal1]; // coloque quantas canais quiser
  
  if (canal.includes(String(message.channel.id))) {
  
    await message.react("<:emoji_11:1148053954899484722>")
    await message.react("👍")
    await message.react("👎")
    

  } 
   if (canal1.includes(String(message.channel.id))) {
     await message.channel.send(`<@&1171092220099711087>`).then((msg) => {
                      setTimeout(() => {
                          msg.delete();
                      }, 2000)
                  }).catch(console.error);

     }

  
}
)

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let canal1 = "1165707297247469681";
  let canal2 = "1188621052545355847"

  const canais = [canal1];

  if (canais.includes(newMessage.channel.id)) {
      await newMessage.channel.send(`<@&1171092220099711087>`).then((msg) => {
                      setTimeout(() => {
                          msg.delete();
                      }, 2000)
                  }).catch(console.error);
  }
});