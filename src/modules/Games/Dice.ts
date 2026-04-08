import { ChatInputCommandInteraction } from "discord.js";
import { getLogger } from "../../lib/pino.log.js";

const logger = getLogger(import.meta);
const Dice = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  const work = interaction?.options.getString("what");
  if (work) {
    switch (work) {
      case "play":
    }
  }
};
const createDice = () => {
  return;
};
const joinDice = () => {
  return;
};

const playDice = () => {
  return;
};

const deleteDice = () => {
  return;
};
export default Dice;
