import { ChatInputCommandInteraction, Interaction } from "discord.js";
import { getLogger } from "../../lib/pino.log.js";

const logger = getLogger(import.meta);
const { DICE_C, diceON, CLEAR_DICE_ARRAY, PUSH_PLAYER_DICE, playersDice } =
  process.env;
const isDiceChannel = (channelId: string) => {
  return channelId === DICE_C;
};
const Dice = async (interaction: ChatInputCommandInteraction) => {
  logger.trace("Dice Triggered");
  let currentChannelId = interaction.channel?.id || ""; // remove this
  logger.trace(currentChannelId);
  logger.trace(isDiceChannel(currentChannelId));
  // console.log(isDiceChannel(interaction.channel?.id));
  await interaction.deferReply();
  const work = interaction?.options.getString("what");
  if (!isDiceChannel(currentChannelId)) {
    return await interaction.editReply(
      "Command only works on Dice Channel! Smeowrry!",
    );
  }
  //   if (!DiceON && isDiceChannel(currentChannelId)) {
  //     return await interaction.reply(
  //       "No Rock, Paper, Scissors game is currently active! Smeowrry!",
  //     );
  //   }
  if (work && isDiceChannel(currentChannelId)) {
    switch (work) {
      case "create": {
        if (!diceON && !isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "Please go to Rock, Paper, Scissors channel to start a game!",
          );
        }
        if (diceON && isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "Go To Dice Channel To Join The Current Game!",
          );
        }
        if (diceON && isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "A Rock, Paper, Scissors game is already ongoing! Please join the current game or wait for it to finish!",
          );
        }
        createDice(interaction);
        break;
      }
      case "join": {
        if (!isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "Command only works on Dice Channel! Smeowryyyyyyyy!",
          );
        }
        if (!diceON && isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "No Rock, Paper, Scissors game is currently active! Smeowryyyyyyyy!",
          );
        }

        joinDice(interaction);
        break;
      }
      case "play": {
        playDice(interaction);
        break;
      }
      case "delete": {
        deleteDice(interaction);
        break;
      }
    }
  }
};
const createDice = (inteaction: Interaction) => {
  return;
};
const joinDice = (inteaction: Interaction) => {
  return;
};

const playDice = (inteaction: Interaction) => {
  return;
};

const deleteDice = (inteaction: Interaction) => {
  return;
};
export default Dice;
