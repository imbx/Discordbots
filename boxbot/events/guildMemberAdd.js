const Discord = require('discord.js')

module.exports = (client, member) =>{
    let amount = 1
    client.channels.fetch("739487206661423185")
        .then(channel => {
            channel.messages.fetch({limit: amount}).then(msg => {
                channel.bulkDelete(msg)
            })
            channel.send(`Bienvenido ${member}`)
        })
}