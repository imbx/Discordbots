module.exports = {
    name: 'stop',
    description: 'Termina la musica',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args){
        const serverQueue = msg.client.musicQueue.get(msg.guild.id)
        if(serverQueue){
            serverQueue.songs = []
            serverQueue.connection.dispatcher.end()
        }
    }
}