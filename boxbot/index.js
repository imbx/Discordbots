require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require('fs')

client.login(process.env.BOT_TOKEN)
client.commands = new Discord.Collection()
client.prefix = process.env.PREFIX
client.musicQueue = new Map()

fs.readdir("./events/", (err, files) =>{
  if(err) return console.error(err)
  files.forEach(file => {
    if(!file.endsWith(".js")) return

    const event = require(`./events/${file}`)
    let eventName = file.split(".")[0]
    client.on(eventName, event.bind(null, client))
  })
})


fs.readdir("./commands/", (err, files) =>{
  if(err) return console.error(err)
  files.forEach(file => {
    if(!file.endsWith(".js")) return

    let props = require(`./commands/${file}`)
    let commandName = file.split(".")[0]

    client.commands.set(commandName, props)
  })
})

/*function kickuserbyId(msg, uId) {
  try{
    msg.guild.members.fetch(uId)
    .then(member => {
      let mVoice = member.voice
      if(!mVoice.channel) return msg.channel.send(`<@${uId}> no ta conectao   ☠️`)
      mVoice.setChannel(null)
      return msg.channel.send(`Adio <@${uId}> 👋🏿!`)
    })
  } catch(e) {
    return msg.channel.send(`<@${uId}> no esiste   ❌`)
    console.log(`err ${e}`)
  }
}*/