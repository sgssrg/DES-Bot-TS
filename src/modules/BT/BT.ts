import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import triggerTrap from "./utils/triggerTrap.js";
import { getLogger } from "../../lib/pino.log.js";

const logger = getLogger(import.meta);
const {
  BT1_HOUR,
  BT1_MINUTE,
  BT2_HOUR,
  BT2_MINUTE,
  NOTIFY_BT_BEFORE_TIME,
  BT_CHANNEL,
} = process.env;

const BT_C = BT_CHANNEL as string; // channel IDs are strings

const isBTChannel = (channelId: string) => channelId === BT_C;

export const setBT = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.channel && interaction.channel instanceof TextChannel) {
    await interaction.deferReply();
    const currentChannelId = interaction.channel.id;
    logger.trace("BT Trap Command Triggered!");

    // Reference times
    const referenceUTCBT1 = new Date();
    referenceUTCBT1.setUTCHours(
      Number(BT1_HOUR),
      Number(BT1_MINUTE) - Number(NOTIFY_BT_BEFORE_TIME),
      0,
      0,
    );

    const referenceUTCBT2 = new Date();
    referenceUTCBT2.setUTCHours(
      Number(BT2_HOUR),
      Number(BT2_MINUTE) - Number(NOTIFY_BT_BEFORE_TIME),
      0,
      0,
    );

    if (!isBTChannel(currentChannelId)) {
      return await interaction.editReply(
        "Command only works on Bear Trap Channel! Sorry!",
      );
    }

    const trapValue = interaction.options.get("trap")?.value;
    await interaction.editReply(`Bear Trap ${trapValue} has been set!`);

    if (trapValue === 1) {
      const firstDelayBT1 = referenceUTCBT1.getTime() - Date.now();
      setTimeout(() => {
        triggerTrap(1, interaction);
        setInterval(() => triggerTrap(1, interaction), 48 * 60 * 60 * 1000);
      }, firstDelayBT1);
    }

    if (trapValue === 2) {
      const firstDelayBT2 = referenceUTCBT2.getTime() - Date.now();
      setTimeout(() => {
        triggerTrap(2, interaction);
        setInterval(() => triggerTrap(2, interaction), 48 * 60 * 60 * 1000);
      }, firstDelayBT2);
    }
  }
};
