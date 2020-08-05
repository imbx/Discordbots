const Music = require('../include/music')

module.exports = {
    name: 'gijolist',
    description: 'Reproduce las playlist de gijonias',
    aliases: ['gijo'],
    args: false,
    usage: '<numero>',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args){
        const gijolistas = [
            "https://www.youtube.com/playlist?list=PL0WrIemiw8Ckefg1rLYdkCuV4RoDeP1HC",
            "https://www.youtube.com/playlist?list=PL0WrIemiw8CmYYUqSBcPHM3gKtAiAkTOt"
        ]
        let identifier = 0
        if(args.length)
            if(!isNaN(args[0])) identifier = args[0]
        
        let argToSend = []
        argToSend.push(gijolistas[identifier])
        client.commands.get("play").execute(client, msg, argToSend)
    }
  }