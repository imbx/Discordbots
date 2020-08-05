module.exports = {
    name: 'shuffle',
    description: 'Mezcla las canciones que haya en cola',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args){
        const serverQueue = msg.client.musicQueue.get(msg.guild.id)
        if(serverQueue){
            let songs = serverQueue.songs
            if(serverQueue.songs.length > 3){
                for(let i = songs.length-1; i > 1; i--){
                    let j = Math.floor(Math.random() * i)
                    if(j == 0) j = 1
                    if(i == 0) j = 0
                    const temp = songs[i]
                    songs[i] = songs[j]
                    songs[j] = temp
                  }
            }else msg.channel.send(`Añade más canciones primero 6plau`)
        }
    }
}