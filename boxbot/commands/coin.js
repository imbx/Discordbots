module.exports = {
  name: 'coin',
  description: 'Lanza una moneda',
  cooldown: 3,
  execute(client, msg, args){
    msg.channel.send("🌝  Lanzando moneda...   🌚\n🍀  MUCHA SUERTE        🍀")
    let coin = Math.floor(Math.random() * (4-1) + 1);
    setTimeout(function(){
      if(coin <= 2) msg.channel.send("🌝  Ha salido **CARA**          🌝")
      else msg.channel.send("🌚  Ha salido **CRUZ**          🌚")
    }, 1000);
  }
}