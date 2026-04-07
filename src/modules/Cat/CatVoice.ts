import { msgCatVoice } from "../../global/variables.js";
import type { Message } from "discord.js";
const CatVoice = async (message: Message) => {
  const catVoiceRegex: RegExp =
    /(meow|nya|purr|myaoon|nyaan|miau|mew|nyan|mao)/i;
  const meowRandom: string =
    msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)] || "meow";
  if (catVoiceRegex.test(message.content)) {
    console.log(msgCatVoice);
    await message.reply(meowRandom);
  }
};

export default CatVoice;
