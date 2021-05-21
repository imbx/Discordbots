const Music = require('../include/music')

module.exports = {
    name: 'play',
    description: 'Reproduce música de YouTube',
    aliases: ['p', 'playlist', 'playmusic'],
    args: true,
    usage: '<url>/<nombre>',
    cooldown: 5,
    voiceChannelOnly: true,
    guildOnly: true,
    async execute(client, msg, args) {
        const voiceChannel = msg.member.voice.channel
        const serverQueue = msg.client.musicQueue.get(msg.guild.id)

        var songs = []
        songs = Music.getVideosFromYT(args[0])

        setTimeout(async() => {
            console.log(songs)
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    message: null,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                }
    
                msg.client.musicQueue.set(msg.guild.id, queueConstruct)
                
                await songs.then(song => {
                    song.forEach(element =>{
                        queueConstruct.songs.push(element)
                    }) 
                })
    
                try {
                    await voiceChannel.join()
                        .then(connection => {
                            queueConstruct.connection = connection
                        })
                    Music.play(msg, queueConstruct.songs[0])
                } catch (e) {
                    console.log(e)
                    msg.client.musicQueue.delete(msg.guild.id)
                    return msg.channel.send(e)
                }
            } else {
                await songs.then(song => {
                    song.forEach(element =>{
                        queueConstruct.songs.push(element)
                    }) 
                })
            }
        },2000)
    }
}