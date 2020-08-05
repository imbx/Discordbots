const Discord = require('discord.js')

module.exports = (client, member) =>{
  client.channels.fetch("739487206661423185")
    .then(channel => {
      channel.send(`A chuparla ${member}`)
    })
}