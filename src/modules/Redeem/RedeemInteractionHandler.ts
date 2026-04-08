import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import { getLogger } from "../../lib/pino.log.js";
import RedeemCode from "./utils/RedeemCode.js";
const logger = getLogger(import.meta);

const RedeemInteractionHandler = async (
  interaction: ChatInputCommandInteraction,
) => {
  if (interaction.channel && interaction.channel instanceof TextChannel) {
    await interaction.deferReply();

    const code = interaction.options.getString("code");
    if (code) {
      // Do something with the code
      logger.trace("Redeem Interaction Triggered with Code " + code);
      await interaction.editReply(`You entered code: ${code}`);
      RedeemCode(code, interaction);
    } else {
      await interaction.editReply("No code provided!");
    }
  }
};

export default RedeemInteractionHandler;
