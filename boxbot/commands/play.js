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

        var songs = await Music.getVideosFromYT(args[0])

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
            
            songs.forEach(async element => {
                await queueConstruct.songs.push(element)
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
            songs.forEach(async element => {
                await serverQueue.songs.push(element)
            })
        }
    }
}