const YouTube = require('simple-youtube-api')
const youtube = new YouTube(process.env.YT_KEY)
const ytdl = require('ytdl-core');
const Discord = require('discord.js')

module.exports = {
  async getVideosFromYT(link) {
    console.log("getting vid")
    return new Promise(async (res) => {
      var songs = []
      var thumbnail = null

      if (link.startsWith(`https://www.youtube.com/playlist?`)) {
        await youtube.getPlaylist(link)
          .then(async playlist => {
            await playlist.getVideos()
              .then(videos => {
                videos.forEach(async vid => {
                  await songs.push(this.getSong(vid, thumbnail))
                })
              }).catch(e => {
                console.log(e)
                return e;
              })
              res(songs)
          }).catch(e => {
            console.log(e)
          })
      } else if (link.startsWith(`https://www.youtube.com/`)) {
        await youtube.getVideo(link)
          .then(vid => {
            songs.push(this.getSong(vid, thumbnail))
            res(songs)
          }).catch(e => {
            console.log(e)
          })
      } else {
        await youtube.searchVideos(link, 3)
          .then(vid => {
            songs.push(this.getSong(vid[0], thumbnail))
            res(songs)
            console.log("vid")
            console.log(songs)
          }).catch(e => {
            console.log(e)
          })
      }
      res(songs)
    })
  },
  async getSong(video, thumbnail){
    if (!thumbnail)
      thumbnail = await this.getChannelThumbnail(video.channel.id)
    return await this.fillSongInfo(video, thumbnail)
  },
  getChannelThumbnail(cId) {
    return youtube.getChannelByID(cId)
      .then(async ch => {
        return await ch.thumbnails
      }).catch(e => { console.log(e) })
  },
  fillSongInfo(vid, thmb) {
    return {
      name: vid.title,
      url: vid.url,
      duration: vid.durationSeconds,
      artist: vid.channel.title,
      artistThumbnail: thmb.default.url
    }
  },
  play(client, msg, song) {
    const musicQueue = msg.client.musicQueue.get(msg.guild.id)

    if (!song) {
      musicQueue.playing = false
      musicQueue.voiceChannel.leave()
      // musicQueue.delete(msg.guild.id)
      return
    }

    if (!musicQueue.message) musicQueue.message = this.musicEmbed(msg)
    else this.musicEmbed(msg, true);

    musicQueue.playing = true
    const ytdlOption = /*{ highWaterMark: 1 << 25 }*/ {
      filter: 'audioonly',
      quality: 'highestaudio'
    };
    let stream = ytdl(song.url, ytdlOption)

    const dispatcher = musicQueue.connection
      .play(stream)
      .on("finish", () => {
        musicQueue.playing = false
        musicQueue.songs.shift()
        this.play(msg, musicQueue.songs[0])
      })
      .on("error", error => console.error(error))
    dispatcher.setVolumeLogarithmic(musicQueue.volume / 5)
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
  async musicEmbed(msg, isEdit = false) {
    let musicQueue = msg.client.musicQueue.get(msg.guild.id)
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
      fields: [{
        name: 'Siguiente canción:',
        value: `${nextSongTitle}`,
      }, ],
      footer: {
        text: `Songs in queue: ${musicQueue.songs.length - 1}`,
        //icon_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/multiple-musical-notes_1f3b6.png'
      }
    }
    var pMsg = ""
    if(isEdit)
      pMsg = musicQueue.msg.edit(infoEmbed);
    else {
      var pMsg = await msg.channel.send({
        embed: infoEmbed
      })
      await pMsg.react("⏭");
      await pMsg.react("⏯");
      await pMsg.react("🔁");
      await pMsg.react("⏹");
    }
    return pMsg

    const filter = (reaction, user) => user.id !== msg.client.user.id;
    var collector = pMsg.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });
  }
}