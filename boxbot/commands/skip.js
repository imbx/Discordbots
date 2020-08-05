const Music = require('../include/music')

module.exports = {
    name: 'skip',
    description: 'Salta la canción',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args){
        const serverQueue = msg.client.musicQueue.get(msg.guild.id)
        if(serverQueue){
            serverQueue.songs.shift()
            Music.play(msg, serverQueue.songs[0])
        }
    }
}