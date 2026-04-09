import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { getLogger } from "../../lib/pino.log.js";
const logger = getLogger(import.meta);
const { DICE_C } = process.env;

import {
  diceON,
  CLEAR_DICE_ARRAY,
  diceVal,
  PUSH_PLAYER_DICE,
  playersDice,
  INVERSE_DICE_STATUS,
  msgCatVoice,
  ROLL_DICE,
} from "../../global/variables.global.js";
import { MiniGamePlayer } from "../../lib/interface/MiniGamePlayer.js";
import EmbedGame from "./utils/EmbedGame.js";
import { DiceGameDetails } from "../../lib/interface/GameDetails.js";
const isDiceChannel = (channelId: string) => {
  return channelId === DICE_C;
};
const Dice = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply(); // AS soon we get Defer it

  logger.trace("Dice Triggered");

  let currentChannelId = interaction.channel?.id || ""; // remove this
  logger.trace(currentChannelId);
  logger.trace(isDiceChannel(currentChannelId));

  logger.trace(isDiceChannel(currentChannelId));

  const work = interaction?.options.getString("what");
  if (!isDiceChannel(currentChannelId)) {
    return await interaction.editReply(
      "Command only works on Dice Channel! Smeowrry!",
    );
  }
  if (work && isDiceChannel(currentChannelId)) {
    switch (work) {
      case "create": {
        if (!diceON && !isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "Please go to Dice channel to start a game!",
          );
        }
        if (diceON && !isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            `A game is currently in session go to <#${DICE_C}>! and use /dice what:Join A Game? to join the game and add prediction if you want or get a randomized prediction!`,
          );
        }
        if (diceON && isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "A Dice game is already ongoing! Please join the current game or wait for it to finish!",
          );
        }
        createDice(interaction);
        break;
      }

      case "join": {
        if (!diceON && isDiceChannel(currentChannelId)) {
          return await interaction.editReply(
            "No Dice game is currently active! Please Make one!! Smeowryyyyyyyy!",
          );
        }
        joinDice(interaction);
        break;
      }

      case "play": {
        if (playersDice.length >= 2) {
          playDice(interaction);
        } else {
          return interaction.editReply(
            "Plehj Get Morehr Pwlayer to Jwoin! Hehe~myaoon!",
          );
        }
        break;
      }
      case "delete": {
        if (diceON) {
          deleteDice(interaction);
        } else {
          return await interaction.editReply(
            "No active Sessions! of Dice Minigame... ~woofwoof (ifykyk)",
          );
        }
        break;
      }
    }
  }
};

const createDice = async (interaction: ChatInputCommandInteraction) => {
  logger.info("Closest Guess Game Enrollment Started!");
  logger.trace(`Current RPS Channel: ${DICE_C}`);
  INVERSE_DICE_STATUS();
  return await interaction.editReply(
    `Let's Play Rock, Paper, Scissors!! ${msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)]}!!!!`,
  );
};

const joinDice = async (interaction: ChatInputCommandInteraction) => {
  const PiD = interaction.user.id;
  const exists = playersDice.find((p) => p.player.PiD === interaction.user.id);

  if (exists) {
    return await interaction.editReply(
      `<@${PiD}> exists in the MiniGame --> Dice ||| Don't Be Hasty Haha!`,
    );
  }
  const pDETAILS: DiceGameDetails = {
    player: { PiD, dNAME: interaction.user.displayName },

    diceNo: Number(
      interaction?.options?.get("prediction")?.value ||
        Math.floor(Math.random() * 6) + 1,
    ),
  };

  PUSH_PLAYER_DICE(pDETAILS);
  return await interaction.editReply(
    `<@${PiD}> is added to the game! and predicted ${pDETAILS.diceNo}`,
  );
};

const playDice = async (interaction: ChatInputCommandInteraction) => {
  ROLL_DICE();

  // now handleing victory
  // 1st Case strighforward victory
  let instaWIN = playersDice.filter((p) => p.diceNo === diceVal);
  for (const p of instaWIN) {
    p.winType = 0;
    p.diff = 0;
  }
  if (instaWIN.length > 0) {
    let reply = await EmbedGame(1, 1, instaWIN, 0);
    await interaction.editReply({ embeds: reply });
  }

  let closestUsers: DiceGameDetails[] = playersDice.map((p) => ({
    player: p.player,
    diceNo: p.diceNo,
    diff: Math.abs(p.diceNo - diceVal),
  }));
  closestUsers.sort((a, b) => (a.diff ?? Infinity) - (b.diff ?? Infinity));

  if (
    closestUsers.length === 0 &&
    interaction.channel &&
    interaction.channel instanceof TextChannel &&
    interaction.channel.isSendable()
  ) {
    return await interaction.editReply("No predictions were made!");
  }

  if (
    closestUsers.length === 1 &&
    interaction.channel &&
    interaction.channel instanceof TextChannel &&
    interaction.channel.isSendable()
  ) {
    let reply = await EmbedGame(1, 1, closestUsers, 1);
    return await interaction.editReply({ embeds: reply });
  }

  if (
    closestUsers[0].diff === closestUsers[1].diff &&
    interaction.channel &&
    interaction.channel instanceof TextChannel &&
    interaction.channel.isSendable()
  ) {
    const minDiff = closestUsers[0].diff;
    const tiedUsers = closestUsers.filter((user) => user.diff === minDiff);
    let reply = await EmbedGame(1, 1, tiedUsers, 2);
    return await interaction.editReply({ embeds: reply });
  } else {
    let reply = await EmbedGame(1, 1, closestUsers, 3);
    return await interaction.editReply({ embeds: reply });
  }
};
const deleteDice = async (interaction: ChatInputCommandInteraction) => {
  if (diceON) {
    INVERSE_DICE_STATUS();
    CLEAR_DICE_ARRAY();
    return await interaction.editReply(
      "Deleted the current Rock, Paper, Scisorr Game",
    );
  } else {
    return await interaction.editReply("NO SESSIONS WERE ACTIVE!!!!!......:<");
  }
};

export default Dice;
