import { ChatInputCommandInteraction, Client, TextChannel } from "discord.js";
import { KS_NET } from "../../../lib/axios.js";
import { prisma } from "../../../lib/prisma.js";
import { chunkArray } from "../../../global/helper.global.js";
import { getLogger } from "../../../lib/pino.log.js";
import EmbedRedeem from "./EmbedRedeem.js";
import { RedeemStatus } from "../../../lib/interface/RedeemStatus.js";
import { PlayerWithMsgType } from "../../../lib/interface/PlayerWithMsgType.js";
const logger = getLogger(import.meta);
const RedeemCode = async (
  code: string,
  interaction?: ChatInputCommandInteraction,
  client?: Client,
) => {
  const type = interaction ? 0 : 1;

  let allPlayers = await prisma.player.findMany();
  let chunkedPlayer = chunkArray(allPlayers, 3);
  let RedeemStats: RedeemStatus = {
    manual: 0,
    redeemed: 0,
    invalid: 0,
    total: 0,
  };
  let formattedData: PlayerWithMsgType[] = [];
  for (const [index, playerBulkArr] of chunkedPlayer.entries()) {
    logger.trace(
      "Redeeming Code for " +
        playerBulkArr.length +
        " => Processing Batch : " +
        index +
        1,
    );
    try {
      let responseText = (
        await KS_NET.post("/gift-codes/bulk-redeem", {
          giftCode: code,
          accountIds: playerBulkArr.map((p) => p.PiD),
        })
      ).data;
      //  0 0 1 0 | 0 0 1 0 | 0 0 1 0
      let jsonArray = responseText
        .split("\n")
        .filter((line: any) => line.startsWith("data:"))
        .map((line: any) => JSON.parse(line.replace("data: ", "")));
      let playerDetails = jsonArray.filter((item: any) => {
        if (!item.playerInfo) {
          return false;
        }
        return true;
      });
      for (const players of playerDetails) {
        console.log(players);
        let msgTYPE = 0;
        switch (players.message) {
          case "Gift code already redeemed.": {
            msgTYPE = 1;
            break;
          }
          case "Gift code not found.": {
            msgTYPE = 2;
            break;
          }
        }
        let data = {
          PiD: players.accountId,
          pNAME: players.playerInfo.nickname,
          KiD: players.playerInfo.kingdom,
          msgTYPE: msgTYPE,
        };
        formattedData.push(data);
        if (msgTYPE === 0) RedeemStats.redeemed++;
        if (msgTYPE === 1) RedeemStats.manual++;
        if (msgTYPE === 2) RedeemStats.invalid++;
      }
      RedeemStats.total = allPlayers.length;
    } catch (err) {
      logger.error(err);
    }
    // playerBulkArr.forEach(() => {

    // })
  }

  let chunkFR = chunkArray(formattedData, 10);
  for (const [index, chunk] of chunkFR.entries()) {
    const logBatch: number = index + 1;
    let reply = await EmbedRedeem(true, 2, chunk, code, RedeemStats, logBatch);
    switch (type) {
      case 0: {
        // we have a interaction and a channel to send message to i.e. Manually done & has channel
        if (
          interaction?.channel &&
          interaction?.channel instanceof TextChannel
        ) {
          await interaction.followUp({ embeds: [reply] });
        }
        break;
      }
      case 1: {
        // Autoredeem Triggered
        const RedeemChannel = process.env.REDEEM_CHANNEL;
        if (client && RedeemChannel) {
          try {
            const channel = await client.channels.fetch(RedeemChannel);
            if (channel && channel.isTextBased() && channel.isSendable()) {
              await channel.send({ embeds: [reply] });
            }
          } catch (err) {
            logger.error(err);
          }
        }
        break;
      }
    }
  }
};
export default RedeemCode;
