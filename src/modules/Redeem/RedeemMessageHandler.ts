import { Message } from "discord.js";
import { getLogger } from "../../lib/pino.log.js";
import { EmbedBuilder } from "discord.js";
import { prisma } from "../../lib/prisma.js";
import EmbedRedeem from "./utils/EmbedRedeem.js";
import fetchPlayerDetails from "./utils/fetchPlayerDetails.js";
import { Player } from "../../generated/prisma/client.js";
const logger = getLogger(import.meta);
const RedeemMessageHandler = async (message: Message, mode: number) => {
  let PiD = Number(message.content.split(" ")[1]);
  if (!PiD) {
    return await message.reply("Attach a PlayerrrrrID~nya!!!!");
  }
  switch (mode) {
    case 0:
      try {
        // fetching Player id from message
        logger.debug("Running AddUser with " + PiD);

        // finiding in DB if its present or not
        let ifPlayerExist = await prisma.player.findUnique({
          where: {
            PiD,
          },
        });
        if (ifPlayerExist) {
          let reply = await EmbedRedeem(false, 0, ifPlayerExist);
          return message.reply({ embeds: [reply] });
        }
        logger.trace("Player KSN Fetch Started");
        let player: Player | null = await fetchPlayerDetails(PiD);
        logger.trace("Player KSN Fetch Completed");

        if (player) {
          let createPlayer = await prisma.player.create({
            data: {
              PiD: player.PiD,
              KiD: player.KiD,
              pNAME: player.pNAME,
              PFP: player.PFP,
            },
          });
          console.log(createPlayer);
          let reply = await EmbedRedeem(true, 0, player);
          await message.reply({ embeds: [reply] });
        } else {
          logger.info("No Player found.");
        }
        //  now if the player doesnt exits create it logic --> Fetch User --> Upload User

        console.log(ifPlayerExist);
      } catch (err) {
        logger.error(err);
      }
      break;

    case 1: {
      try {
        logger.trace("Deleting user with PiD" + PiD);
        let deletedUser = await prisma.player.delete({
          where: {
            PiD: PiD,
          },
        });
        logger.trace(deletedUser);
        if (deletedUser) {
          let reply = await EmbedRedeem(false, 1, deletedUser);
          message.reply({ embeds: [reply] });
        }
      } catch (err) {
        logger.error(err);
        await message.reply(
          `There is no user with PiD ${PiD} in DB! Maybe a Typo? :>`,
        );
      }
      break;
    }
  }
};

export default RedeemMessageHandler;
