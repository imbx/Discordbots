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
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel
        let guildID = message.guild.id
        let queueConstruct =  {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            message: null,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        let retrievedSongs = Music.getVideosFromYT(args[0])
        let songs = await retrievedSongs
        console.log(songs)
        console.log("fill musicqueue")
        if(!client.musicQueue) client.musicQueue = new Map();
        if(client.musicQueue.size < 1) 
            client.musicQueue.set(guildID, queueConstruct);

        console.log("push songs")
        songs.forEach(element => {
            console.log(client.musicQueue);
            client.musicQueue.songs.push(element)
        })
        console.log(client.musicQueue)
        voiceChannel.join()
            .then(connection => {
                client.musicQueue.connection = connection
            })

        try{
            Music.play(client, message, await client.musicQueue.songs[0])
        }
        catch (e) {
            console.log(e)
            client.musicQueue.delete(message.guild.id)
            message.channel.send(e)
        }
    }
}