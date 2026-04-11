import { EmbedBuilder } from "discord.js";
import {
  eRedeemSuccess,
  eRedeemFailure,
} from "../../../global/color.global.js";
import { Player } from "../../../generated/prisma/client.js";
import Table from "cli-table3";

import { getLogger } from "../../../lib/pino.log.js";
import { PlayerWithMsgType } from "../../../lib/interface/PlayerWithMsgType.js";
import { RedeemStatus } from "../../../lib/interface/RedeemStatus.js";

const logger = getLogger(import.meta);

const EmbedRedeem = async (
  success: boolean,
  type: number,
  data: Player | PlayerWithMsgType[],
  code?: string,
  redeemStatus?: RedeemStatus,
  logBatch?: number,
) => {
  let embed = new EmbedBuilder();

  embed.setColor(success ? eRedeemSuccess : eRedeemFailure);
  let Author = process.env.BOT_NAME || "DES-1405";
  embed.setAuthor({ name: Author });
  switch (type) {
    case 0: {
      logger.info("Case 1");
      // Add/Remove/Duplicate People Embed
      if (data && !Array.isArray(data)) {
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
    } // Add/Duplicate Player
    case 1: {
      // delete player
      logger.info("Case 2");
      if (data && !Array.isArray(data)) {
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
    } // Delete Player
    case 2: {
      let redeemTable = new Table({
        head: ["Player", "Status"],
        colWidths: [20, 10],
        style: { head: [], border: [] },
        wordWrap: true,
        colAligns: ["left", "center"],
      });
      if (data && Array.isArray(data) && redeemStatus && logBatch) {
        data.forEach((player) => {
          let { pNAME, msgTYPE } = player;
          let msgTYPEResolved = "";
          if (msgTYPE === 0) msgTYPEResolved = "✅ Redeemed";
          if (msgTYPE === 1) msgTYPEResolved = "❌ Manual";
          if (msgTYPE === 2) msgTYPEResolved = "❌ GC";

          redeemTable.push([pNAME, msgTYPEResolved]);
        });
        logger.trace(`${redeemStatus.total} | `);
        embed.setDescription(
          `Redeeming GiftCodes for ${logBatch + 1}-${logBatch + data.length} and Code (${code})\n\n\`\`\`\n${redeemTable.toString()}\n\`\`\``,
        );

        embed.addFields(
          {
            name: ":tulip: Redeemed",
            value: String(redeemStatus?.redeemed),
            inline: true,
          },
          {
            name: ":x: Manual",
            value: String(redeemStatus?.manual),
            inline: true,
          },
          {
            name: ":dagger: Invalid",
            value: String(redeemStatus?.invalid),
            inline: true,
          },
          {
            name: ":melting_face: Expired",
            value: String(redeemStatus?.expired),
            inline: true,
          },
        );
      }
    } // AutoRedeem/ManualRedeem
  }
  // returns a Embed
  return embed;
};
export default EmbedRedeem;
