import { ChatInputCommandInteraction } from "discord.js";
import { getLogger } from "../../lib/pino.log.js";
import {
  rpsON,
  INVERSE_RPS_STATUS,
  msgCatVoice,
  playersRPS,
  PUSH_PLAYER_RPS,
  RPSChoices,
  CLEAR_RPS_ARRAY,
} from "../../global/variables.global.js";
import { RPSGameDetails } from "../../lib/interface/GameDetails.js";
import EmbedGame from "./utils/EmbedGame.js";

const logger = getLogger(import.meta);
const { RPS_CHANNEL } = process.env;
const isRPSChannel = (channelId: string) => {
  return channelId === RPS_CHANNEL;
};
const RPS = async (interaction: ChatInputCommandInteraction) => {
  logger.trace("RPS Triggered");
  let currentChannelId = interaction.channel?.id || ""; // remove this
  logger.trace(currentChannelId);
  logger.trace(isRPSChannel(currentChannelId));
  // console.log(isRPSChannel(interaction.channel?.id));
  await interaction.deferReply();
  const work = interaction?.options.getString("what");
  if (!isRPSChannel(currentChannelId)) {
    return await interaction.editReply(
      "Command only works on RPS Channel! Smeowrry!",
    );
  }
  //   if (!rpsON && isRPSChannel(currentChannelId)) {
  //     return await interaction.reply(
  //       "No Rock, Paper, Scissors game is currently active! Smeowrry!",
  //     );
  //   }
  if (work && isRPSChannel(currentChannelId)) {
    switch (work) {
      case "create": {
        if (!rpsON && !isRPSChannel(currentChannelId)) {
          return await interaction.editReply(
            "Please go to Rock, Paper, Scissors channel to start a game!",
          );
        }
        if (rpsON && isRPSChannel(currentChannelId)) {
          return await interaction.editReply(
            "Go To RPS Channel To Join The Current Game!",
          );
        }
        if (rpsON && isRPSChannel(currentChannelId)) {
          return await interaction.editReply(
            "A Rock, Paper, Scissors game is already ongoing! Please join the current game or wait for it to finish!",
          );
        }
        createRPS(interaction);
        break;
      }
      case "join": {
        if (!isRPSChannel(currentChannelId)) {
          return await interaction.editReply(
            "Command only works on RPS Channel! Smeowryyyyyyyy!",
          );
        }
        if (!rpsON && isRPSChannel(currentChannelId)) {
          return await interaction.editReply(
            "No Rock, Paper, Scissors game is currently active! Smeowryyyyyyyy!",
          );
        }

        joinRPS(interaction);
        break;
      }
      case "play": {
        playRPS(interaction);
        break;
      }
      case "delete": {
        deleteRPS(interaction);
        break;
      }
    }
  }
};

export default RPS;

const createRPS = async (interaction: ChatInputCommandInteraction) => {
  logger.info("RPS Game Enrollment Started!");
  logger.trace(`Current RPS Channel: ${RPS_CHANNEL}`);
  INVERSE_RPS_STATUS();
  return await interaction.editReply(
    `Let's Play Rock, Paper, Scissors!! ${msgCatVoice[Math.floor(Math.random() * msgCatVoice.length)]}!!!!`,
  );
};

const joinRPS = async (interaction: ChatInputCommandInteraction) => {
  const PiD = interaction?.user?.id;
  const dNAME = interaction.user.displayName;
  let playerExists = playersRPS.includes({ PiD, dNAME });
  if (playerExists) {
    return await interaction.editReply(
      ":x: You are already in the game! DON'T U DARE COME NEAR ME AGAIN :pouting_cat:!",
    );
  }
  PUSH_PLAYER_RPS({ PiD, dNAME });
  logger.trace(playersRPS);
  return await interaction.editReply(
    `:white_check_mark: <@${PiD}> is added to the game`,
  );
};

const playRPS = async (interaction: ChatInputCommandInteraction) => {
  if (playersRPS.length >= 2) {
    const pNAME = interaction.user?.displayName;
    logger.trace(pNAME);
    let playerRoll: RPSGameDetails[] = [];
    for (const player of playersRPS) {
      let choiceIndex = Math.floor(Math.random() * RPSChoices.length);
      playerRoll.push({ player, choiceIndex, victory: false });
    }

    // EmbedGame now always returns EmbedBuilder[]
    const replyEmbeds = await EmbedGame(0, 1, playerRoll);

    return interaction.followUp({ embeds: replyEmbeds });
  } else {
    return interaction.followUp(
      "DIEEEEEE!!!! <2 Players are you lonely? I'm Smeorry...",
    );
  }
};

const deleteRPS = async (interaction: ChatInputCommandInteraction) => {
  INVERSE_RPS_STATUS();
  CLEAR_RPS_ARRAY();
  return await interaction.editReply(
    "Deleted the current Rock, Paper, Scisorr Game",
  );
};
