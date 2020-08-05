const YouTube = require('simple-youtube-api')
const youtube = new YouTube(process.env.YT_KEY)
const ytdl = require('ytdl-core');
const Discord = require('discord.js')

module.exports = {
    async getVideosFromYT(link){
        return new Promise((res, rej) => {
            let songs = []
            let thumbnail = ''
            if(link.startsWith(`https://www.youtube.com/playlist?`))
                youtube.getPlaylist(link)
                    .then(async playlist => {
                        console.log("is here")
                        await playlist.getVideos().then(videos => {
                          videos.forEach(async vid => {
                            console.log(thumbnail)
                            if(thumbnail === '')
                              thumbnail = await this.getChannelThumbnail(vid.channel.id)
                            songs.push(await this.fillSongInfo(vid, thumbnail))
                          })
                        })
                        res(songs)
                    })
            else if(link.startsWith(`https://www.youtube.com/`))
                youtube.getVideo(link).then(async vid => {
                    let thumbn = await this.getChannelThumbnail(vid.channel.id)
                    songs.push(await this.fillSongInfo(vid, thumbn))
                    res(songs)
                })
            else
                youtube.searchVideos(link, 3).then(async vid => {
                    let thumbn = await this.getChannelThumbnail(vid[0].channel.id)
                    songs.push(await this.fillSongInfo(vid[0], thumbn))
                    res(songs)
                })
        }).then((s) => { return s }).catch((e) => { return e })
    },
    async getChannelThumbnail(cId){
        return await youtube.getChannelByID(cId)
        .then(ch =>{
            return ch.thumbnails.default.url
        })
    },
    fillSongInfo(vid, thmb){
        return {
            name: vid.title,
            url: vid.url,
            duration: vid.durationSeconds,
            artist: vid.channel.title,
            artistThumbnail: thmb
        }
    },
    async play(msg, song){
        const musicQueue = msg.client.musicQueue.get(msg.guild.id)

        if(!song){
            musicQueue.playing = false
            musicQueue.voiceChannel.leave()
            musicQueue.delete(msg.guild.id)
            return
        }

        musicQueue.playing = true
        const ytdlOption = /*{ highWaterMark: 1 << 25 }*/{ filter: 'audioonly', quality: 'highestaudio' };
        let stream = await ytdl(song.url, ytdlOption)

        const dispatcher = musicQueue.connection
          .play(stream, {type : "opus"})
          .on("finish", () =>{
            musicQueue.playing = false
            musicQueue.songs.shift()
            play(msg, musicQueue.songs[0])
          })
          .on("error", error => console.error(error))
        dispatcher.setVolumeLogarithmic(musicQueue.volume / 5)
        this.musicEmbed(msg)
        /*collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(`${user} ⏩ skipped the song`).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(`${user} ⏸ paused the music.`).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(`${user} ▶ resumed the music!`).catch(console.error);
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });*/

    /*collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });*/
    },
    async musicEmbed(msg){
        const musicQueue = msg.client.musicQueue.get(msg.guild.id)
        let songInfo = musicQueue.songs[0]
        let nextSongTitle = musicQueue.songs.length > 1 ? musicQueue.songs[1].name : "No hay mas"
        
        const infoEmbed = {
            color: 0xc41d7f,
            title: `Playing: ${songInfo.name}`,
            url: songInfo.url,
            author: {
                name: 'BoxBotMusic🎶',
                icon_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/package_1f4e6.png'
            },
            description: `by ${songInfo.artist}`,
            thumbnail: {
                url: songInfo.artistThumbnail
            },
            fields: [
              {
                name: '',
                value: `Songs in queue: ${musicQueue.songs.length - 1}`,
              },
            ],
            footer: {
                text: `Siguiente canción: ${nextSongTitle}`,
                //icon_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/multiple-musical-notes_1f3b6.png'
            }
        }
        
        var pMsg = await msg.channel.send({embed: infoEmbed})
        await pMsg.react("⏭");
        await pMsg.react("⏯");
        await pMsg.react("🔁");
        await pMsg.react("⏹");

        return pMsg

        const filter = (reaction, user) => user.id !== msg.client.user.id;
        var collector = pMsg.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });

        //musicQueue.msg.edit(infoEmbed)
    }
}