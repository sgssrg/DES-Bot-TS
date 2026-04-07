import { EmbedBuilder } from "discord.js";
import { eRedeemSuccess, eRedeemFailure } from "../../../global/color.js";
import { Player } from "../../../generated/prisma/client.js";
import { getLogger } from "../../../lib/pino.log.js";

const logger = getLogger(import.meta);

const EmbedRedeem = async (success: boolean, type: number, data?: Player) => {
  let embed = new EmbedBuilder();

  embed.setColor(success ? eRedeemSuccess : eRedeemFailure);
  let Author = process.env.BOT_NAME || "DES-1405";
  embed.setAuthor({ name: Author });
  switch (type) {
    case 0: {
      logger.info("Case 1");
      // Add/Remove/Duplicate People Embed
      if (data) {
        const { PiD, pNAME, KiD, PFP } = data;
        let Title: string = success
          ? `:white_check_mark: New AutoRedeem Added`
          : ":x: Player Found in Database (Cannot Be Duplicate Entries)";
        embed.setTitle(Title);

        let Description: string = success
          ? `Player ${pNAME} has been added to the redeem list!`
          : `Player ${pNAME} Cannot be added as Duplicate`;
        embed.setDescription(Description);

        embed.addFields(
          {
            name: ":dart: Player Name",
            value: pNAME,
          },
          {
            name: ":tickets: Player ID (PiD)",
            value: String(PiD),
          },
          {
            name: ":house_with_garden: Kingdom (KiD)",
            value: String(KiD),
          },
        );
        embed.setThumbnail(PFP);
      }
      return embed;
    }
    case 1: {
      // delete player
      logger.info("Case 2");
      if (data) {
        embed.setTitle(":x: Player Deleted from Database");
        const { PiD, pNAME, KiD, PFP } = data;

        embed.setDescription(`${pNAME} has been removed to the redeem list!`);
        embed.addFields(
          {
            name: ":dart: Player Name",
            value: String(pNAME),
          },
          {
            name: ":tickets: Player ID (PiD)",
            value: String(PiD),
          },
          {
            name: ":house_with_garden: Kingdom (KiD)",
            value: String(KiD),
          },
        );
        embed.setThumbnail(PFP);
        return embed;
      }
    }
  }
  // returns a Embed
  return embed;
};
export default EmbedRedeem;
