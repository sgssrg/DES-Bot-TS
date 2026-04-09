import { msgCatVoice } from "../../global/variables.global.js";
import type { ChatInputCommandInteraction } from "discord.js";
const CatVoiceI = async (interaction: ChatInputCommandInteraction) => {
  const meowRandom: string =
    msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)] || "meow";

  await interaction.reply(meowRandom);
};

export default CatVoiceI;
