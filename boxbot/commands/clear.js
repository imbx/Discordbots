module.exports = {
  name: 'clear',
  description: 'Limpia mensajes',
  aliases: ['clearmessages', 'cleanchat', 'clean'],
  args: true,
  usage: '<numero>',
  cooldown: 5,
  guildOnly: false,
  execute(client, msg, args){
    if(args.length){
      let amount = args[0]
      if(!isNaN(amount) && msg.member.hasPermission("MANAGE_MESSAGES")){
        amount++
        if(amount > 100) amount = 100
        msg.channel.messages.fetch({limit: amount})
          .then(messages => {
            msg.channel.bulkDelete(messages, true)
          })
      } else msg.channel.send("Ha ocurrido un error")
  } else msg.channel.send("Especifica el numero de mensajes a borrar (Máximo 100)")
  }
}