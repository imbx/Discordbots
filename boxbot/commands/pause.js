module.exports = {
    name: 'pause',
    description: 'Pausa la música',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args){
        const serverQueue = msg.client.musicQueue.get(msg.guild.id)
        if(serverQueue){
            if(serverQueue.playing){
                serverQueue.connection.dispatcher.pause()
                serverQueue.playing = false
            }
        }
    }
  }