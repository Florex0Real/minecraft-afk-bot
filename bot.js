const mineflayer = require("mineflayer");
const axios = require("axios");

// Bot yapılandırması
let bot = mineflayer.createBot({
  host: "FlorexAI.aternos.me", // Aternos sunucu IP'nizi buraya girin
  port: 33227, // Varsayılan Minecraft port'u
  username: "AFKBot", // Botunuzun kullanıcı adı
  version: "1.21.1", // Minecraft sürümü güncellendi
});

// HuggingFace API detayları
const API_URL = "https://api-inference.huggingface.co/models/gpt2"; // Model URL'si
const API_KEY = "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"; // HuggingFace API anahtarınızı buraya ekleyin

// HuggingFace API çağrısı
async function getChatbotReply(message) {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: message },
      { headers: { Authorization: `Bearer ${API_KEY}` } },
    );
    return response.data.generated_text || "Cevap alınamadı.";
  } catch (error) {
    console.error("Chatbot API hatası:", error);
    return "Bir hata oluştu.";
  }
}

// Bot başlatıldığında
bot.on("spawn", () => {
  console.log("Bot sunucuya bağlandı!");

  // Her 5 saniyede bir rastgele hareket
  setInterval(() => {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = Math.random() * Math.PI - Math.PI / 2;
    bot.look(yaw, pitch, true);

    if (Math.random() < 0.3) {
      bot.setControlState("jump", true);
      setTimeout(() => {
        bot.setControlState("jump", false);
      }, 100);
    }
  }, 5000);
});

// Sohbette bir mesaj geldiğinde
bot.on("chat", async (username, message) => {
  if (username === bot.username) return; // Kendi mesajlarını görmezden gel
  console.log(`[${username}] ${message}`);

  // Mesaja yanıt alın
  const reply = await getChatbotReply(message);
  bot.chat(reply); // Minecraft sohbetine yanıt gönder
});

// Sunucu mesajlarını konsola yazdır
bot.on("message", (message) => {
  console.log(message.toString());
});

// Hata yakalama
bot.on("error", (err) => {
  console.error("Bot hatası:", err);
});

// Bağlantı koptuğunda yeniden bağlan
bot.on("end", () => {
  console.log("Bağlantı koptu, yeniden bağlanılıyor...");
  setTimeout(() => {
    bot = mineflayer.createBot(bot.options);
  }, 5000);
});
