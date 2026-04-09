import { EmbedBuilder } from "discord.js";
import { eDiceColor, eRPSColor } from "../../../global/color.global.js";
import { chunkArray } from "../../../global/helper.global.js";
import { diceVal, RPSChoices } from "../../../global/variables.global.js";
import VictoryConditionRPS from "./VictoryConditionRPS.js";
import {
  DiceGameDetails,
  RPSGameDetails,
} from "../../../lib/interface/GameDetails.js";
import { getLogger } from "../../../lib/pino.log.js";
import { MiniGamePlayer } from "../../../lib/interface/MiniGamePlayer.js";
const logger = getLogger(import.meta);

/**
 * EmbedGame
 * @param gameType 0 = RPS, 1 = Dice
 * @param method 0 = Join Game, 1 = Begin Game
 * @param data Game details or player list
 * @param diceWinType Dice-specific win type
 */
const EmbedGame = async (
  gameType: number,
  method: number,
  data?: DiceGameDetails[] | RPSGameDetails[] | MiniGamePlayer[],
  diceWinType?: number,
): Promise<EmbedBuilder[]> => {
  const errorEmbed = new EmbedBuilder()
    .setAuthor({ name: "DES-1405" })
    .setTitle("Error")
    .setDescription("Something went wrong building the embed.");

  try {
    switch (method) {
      case 0: {
        if (data && Array.isArray(data)) {
          return await joinEmbedHandler(gameType, data as MiniGamePlayer[]);
        }
        break;
      }
      case 1: {
        if (data && Array.isArray(data)) {
          return await beginEmbedHandler(
            gameType,
            diceWinType,
            data as RPSGameDetails[] | DiceGameDetails[],
          );
        }
        break;
      }
    }
  } catch (err) {
    logger.error(err, "EmbedGame failed");
  }

  return [errorEmbed];
};

export default EmbedGame;

// ---------------- JOIN HANDLER ----------------
const joinEmbedHandler = async (
  gameType: number,
  data: MiniGamePlayer[],
): Promise<EmbedBuilder[]> => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: "DES-1405" })
    .setColor(eRPSColor);

  if (gameType === 0) {
    embed
      .setTitle("Rock, Paper, Scissors")
      .setDescription(
        `The game has started! Use /join-rps to join the game! Current Players: ${data.length}`,
      );

    const groups = chunkArray(data, 5);
    groups.forEach((group, index) => {
      embed.addFields({
        name: `Players ${index * 5 + 1}-${index * 5 + group.length}`,
        value: group.map((p) => `:chess_pawn: <@${p.PiD}>`).join("\n"),
      });
    });

    embed.addFields({
      name: "Current Players",
      value: data.map((p) => `<@${p.PiD}>`).join(", "),
    });
  }
  return [embed];
};

// ---------------- BEGIN HANDLER ----------------
const beginEmbedHandler = async (
  gameType: number,
  diceWinType: number | undefined,
  data: RPSGameDetails[] | DiceGameDetails[],
): Promise<EmbedBuilder[]> => {
  const embed = new EmbedBuilder().setAuthor({ name: "DES-1405" });

  if (gameType === 0) {
    embed.setColor(eRPSColor);
    const gameData = data as RPSGameDetails[];
    const groups = chunkArray(gameData, 5);

    embed
      .setTitle("Rock, Paper, Scissors - Player Rolls 💎🧻✂️")
      .setDescription("Here are the choices made for each player:");

    if (gameData.length < 5) {
      gameData.forEach((p) =>
        embed.addFields({
          name: p.player.dNAME,
          value: RPSChoices[p.choiceIndex ?? 0],
          inline: true,
        }),
      );
    } else {
      groups.forEach((group, index) =>
        embed.addFields({
          name: `Players ${index * 5 + 1}-${index * 5 + group.length}`,
          value: group
            .map(
              (p) =>
                `:chess_pawn: ${p.player.dNAME} : ${RPSChoices[p.choiceIndex ?? 0]}`,
            )
            .join("\n"),
        }),
      );
    }

    const victoryHolder = VictoryConditionRPS(gameData);
    const victoryEmbed = new EmbedBuilder()
      .setTitle("Rock, Paper, Scissors - Victory!")
      .setDescription(`The winner is: <@${victoryHolder.PiD}>!`)
      .setColor(eRPSColor);

    return [embed, victoryEmbed];
  }

  if (gameType === 1) {
    embed.setColor(eDiceColor);
    const gameData = data as DiceGameDetails[];
    logger.trace(gameData);

    switch (diceWinType) {
      case 0:
        embed
          .setTitle(":game_die: We have a winner!")
          .setDescription(
            "Congratulations to the following user(s) who guessed the correct number! and extremely accurate!! :dart:",
          )
          .addFields(
            gameData.map((p, i) => ({
              name: `Winner ${i + 1}`,
              value: `<@${p.player.PiD}>`,
              inline: true,
            })),
          );
        return [embed];

      case 1:
        embed
          .setTitle("Only One Prediction Made!")
          .setDescription(
            `Only one prediction was made. The closest guess was ${gameData[0].diff} away from the actual number! The closest user was <@${gameData[0].player.PiD}>.`,
          );
        return [embed];

      case 2:
        embed
          .setTitle(":knot: It's a tie!")
          .setDescription(
            "Multiple users had the same closest guess. Randomly selecting a winner among them.",
          )
          .addFields(
            gameData.map((u, i) => ({
              name: `:bell_pepper: Tied User ${i + 1}`,
              value: `<@${u.player.PiD}> with a guess ${u.diff} away`,
              inline: true,
            })),
          );
        return [embed];

      case 3:
        embed
          .setTitle(`:trophy: ${gameData[0].player.dNAME} wins the game!`)
          .setDescription(
            `:game_die: The Dice rolled was ${diceVal}\n\nThe closest guess was ${gameData[0].diff} away from the actual number! The closest user was <@${gameData[0].player.PiD}>.\n\nHence, <@${gameData[0].player.PiD}> is the winner!`,
          );
        return [embed];
    }
  }

  return [embed];
};
