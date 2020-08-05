const Discord = require('discord.js')

const frasesPaInsultar = [
    "Ok basura   😒",
    "Cállate basura   😒",
    "Mucho texto   😒",
    "KYS (Keep yourself safe)",
    "Cállate patatero"
]

function wordCounter(stringToCheck, keywords) {
    var counter = 0
    for (var i = 0; i < keywords.length; i++) {
      if (stringToCheck.indexOf(keywords[i]) > -1) {
        counter++
      }
    }
    return counter;
}

module.exports = (client, msg) =>{
    if(msg.author.bot) return 
    if(!msg.content.startsWith(`${client.prefix}`)) {
        if(msg.author.id != process.env.OWNERID){
            if(Math.floor(Math.random() * (30-1) + 1) <= 6){
                msg.channel.send(frasesPaInsultar[(Math.floor(Math.random() * (frasesPaInsultar.length) + 1)) - 1])
            }
        }
        else
        {
            let keywords = ['hola', 'bot', 'bb', 'te', 'quiero', 'amo', '<3', ':heart:', 'tq', '❤️', '😍', 'buen', 'chico']
            if(wordCounter(msg.content, keywords) >= 2)
                msg.channel.send(`Hola mi <@${process.env.OWNERID}>  😍❤️😍❤️`)
            
            keywords = ['me', 'quieres', 'quieres?']
            if(wordCounter(msg.content, keywords) >= 2)
                msg.channel.send(`Te amo <@133650346135388160>  ❤️`)

            keywords = ['ladra', 'bot', 'puto', 'perro']
            if(wordCounter(msg.content, keywords) >= 2)
                msg.channel.send(`Guau guau`)
        }
        return
    }

    const args = msg.content.slice(client.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))
    
    if(cmd.args && !args.length) {ç
        let reply = 'Faltan argumentos'
        if(cmd.usage){
            reply += `\nLa forma correcta de usar el comando sería: \`${client.prefix}${cmd.name} ${cmd.usage}\``
        }
        return msg.channel.send(reply)
    }

    if(cmd.guildOnly && msg.channel.type !== 'text')
        return msg.reply('Este comando solo es válido en servidores')

    if(!cmd) return

    try {
        cmd.execute(client, msg, args)
    }
    catch(e){
        console.error(e)
        msg.channel.send('Error')
    }
}