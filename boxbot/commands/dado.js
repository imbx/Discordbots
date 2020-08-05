module.exports = {
    name: 'dado',
    description: 'Lanza un dado',
    cooldown: 3,
    execute(client, msg, args){
        msg.channel.send("🎲  Lanzando dado...     🎲\n🍀  MUCHA SUERTE     🍀")
        let dice = Math.floor(Math.random() * (7-1) + 1);
        setTimeout(function(){
        msg.channel.send(`🎲  Ha salido el **${dice}**           🎲`)
        }, 1000);
    }
  }