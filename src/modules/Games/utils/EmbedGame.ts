import { EmbedBuilder } from "discord.js";
import { eRPSColor } from "../../../global/color.global.js";
import { chunkArray } from "../../../global/helper.global.js";
import { RPSChoices } from "../../../global/variables.global.js";
import VictoryConditionRPS from "./VictoryConditionRPS.js";
import { GameDetails } from "../../../lib/interface/GameDetails.js";
import { getLogger } from "../../../lib/pino.log.js";
const logger = getLogger(import.meta);
/* 
GAMETYPE ==>
   0    -->  Rock, Paper, Scisor(RPS)
   1    -->  Dice
METHOD ==>
   0    --> Join Game    
   1    --> Begin Game

   data : -->
   
   
*/
// Always return EmbedBuilder[]
const EmbedGame = async (
  gameType: number,
  method: number,
  data?: string[] | GameDetails[],
): Promise<EmbedBuilder[]> => {
  const errorEmbed = new EmbedBuilder()
    .setAuthor({ name: "DES-1405" })
    .setTitle("Error")
    .setDescription("Idk meh some error is here");

  switch (method) {
    case 0: {
      if (data && Array.isArray(data)) {
        const embed = await joinEmbedHandler(gameType, data as string[]);
        return embed ? [embed] : [errorEmbed]; // wrap in array
      }
      break;
    }
    case 1: {
      if (data && Array.isArray(data)) {
        const embeds = await beginEmbedHandler(gameType, data as GameDetails[]);
        return Array.isArray(embeds) ? embeds : [embeds ?? errorEmbed]; // normalize
      }
      break;
    }
  }
  return [errorEmbed]; // fallback
};

export default EmbedGame;

const joinEmbedHandler = async (gameType: number, data: string[]) => {
  let Embed = new EmbedBuilder();
  Embed.setAuthor({ name: "DES-1405" });
  Embed.setColor(eRPSColor);
  switch (gameType) {
    case 0: {
      Embed.setTitle("Rock, Paper, Scissors")
        .setDescription(
          `The game has started! Use /join-rps to join the game! Current Players: ${data.length}`,
        )
        .setColor(eRPSColor);
      let groupPlayers = chunkArray(data, 5);

      groupPlayers.forEach((group, index) => {
        Embed.addFields({
          name: ` Players ${index + 1}-${index + group.length}`,
          value: group.map((player) => `:chess_pawn: <@${player}>`).join("\n"),
        });
      });
      Embed.addFields({
        name: "Current Players",
        value: data.map((p: string) => `<@${p}>`).join(", "),
      });
      return Embed;
    }
    case 1: {
    }
  }
};
const beginEmbedHandler = async (gameType: number, data: GameDetails[]) => {
  let Embed = new EmbedBuilder();
  Embed.setAuthor({ name: "DES-1405" });
  Embed.setColor(eRPSColor);
  let groupPlayers = chunkArray(data, 5);
  switch (gameType) {
    case 0: {
      logger.trace(data);
      Embed.setTitle("Rock, Paper, Scissors - Player Rolls 💎🧻✂️");
      Embed.setDescription("Here are the choices made for each player:");
      if (data.length < 5) {
        Embed.addFields(
          data.map((p) => ({
            name: `${p.player.dNAME}`,
            value: RPSChoices[p.choiceIndex],
            inline: true,
          })),
        );
      } else {
        groupPlayers.forEach((group, index) => ({
          name: "Players " + (index * 5 + 1) + "-" + (index * 5 + group.length),
          value: groupPlayers.forEach((group, index) => {
            Embed.addFields({
              name: `Players ${index * 5 + 1}-${index * 5 + group.length}`,
              value: group
                .map(
                  (p) =>
                    `:chess_pawn: ${p.player.dNAME} : ${RPSChoices[p.choiceIndex]}`,
                )
                .join("\n"),
              inline: false,
            });
          }),
        }));
      }
      let victoryHolder = VictoryConditionRPS(data);
      const victoryEmbed = new EmbedBuilder()
        .setTitle("Rock, Paper, Scissors - Victory!")
        .setDescription(`The winner is: <@${victoryHolder.PiD}>!`)
        .setColor(eRPSColor);
      logger.trace(victoryHolder);
      return [Embed, victoryEmbed];
    }
  }
};
