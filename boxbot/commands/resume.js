module.exports = {
    name: 'resume',
    description: 'Continua la música',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args){
        const serverQueue = msg.client.musicQueue.get(msg.guild.id)
        if(serverQueue){
            if(!serverQueue.playing && serverQueue.songs.length > 0){
                serverQueue.connection.dispatcher.resume()
                serverQueue.playing = true
            }
        }
    }
  }