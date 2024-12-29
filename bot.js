const mineflayer = require('mineflayer')

// Bot yapılandırması
const bot = mineflayer.createBot({
  host: 'FlorexAI.aternos.me', // Aternos sunucu IP'nizi buraya girin
  port: 33227, // Varsayılan Minecraft port'u
  username: 'AFKBot', // Botunuzun kullanıcı adı
  version: '1.21.1' // Minecraft sürümü güncellendi
})

// Bot başlatıldığında
bot.on('spawn', () => {
  console.log('Bot sunucuya bağlandı!')
  
  // Her 5 saniyede bir rastgele hareket
  setInterval(() => {
    // Rastgele yön seçimi
    const yaw = Math.random() * Math.PI * 2
    const pitch = Math.random() * Math.PI - Math.PI / 2
    
    // Botun başını döndür
    bot.look(yaw, pitch, true)
    
    // Zıplama
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true)
      setTimeout(() => {
        bot.setControlState('jump', false)
      }, 100)
    }
  }, 5000)
})

// Sunucu mesajlarını konsola yazdır
bot.on('message', (message) => {
  console.log(message.toString())
})

// Hata yakalama
bot.on('error', (err) => {
  console.error('Bot hatası:', err)
})

// Bağlantı koptuğunda yeniden bağlan
bot.on('end', () => {
  console.log('Bağlantı koptu, yeniden bağlanılıyor...')
  setTimeout(() => {
    bot = mineflayer.createBot(bot.options)
  }, 5000)
})