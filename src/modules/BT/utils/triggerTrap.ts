import { EmbedBuilder, Interaction, TextChannel } from "discord.js";
import { eBTColor } from "../../../global/color.global.js";
import { getLogger } from "../../../lib/pino.log.js";

const logger = getLogger(import.meta);

function triggerTrap(BTNumber: number, interaction: Interaction) {
  if (interaction.channel && interaction.channel instanceof TextChannel) {
    // Tags User
    interaction.channel?.send(
      `<@&${BTNumber === 1 ? process.env.BT1_ROLL_ID : process.env.BT2_ROLL_ID}> is active!`,
    );
    // Embed for UI/UX
    let BT_EMBED_BEFORE = new EmbedBuilder()
      .setAuthor({
        name: `DES-1405 ~~ ${BTNumber === 1 ? "BT1" : "BT2"}`,
      })
      .setTitle(`${BTNumber === 1 ? "BT1" : "BT2"} is active!`)
      .setDescription(
        `<@&${BTNumber === 1 ? process.env.BT1_ROLL_ID : process.env.BT2_ROLL_ID}> begins in ${process.env.NOTIFY_BT_BEFORE_TIME || 10} mins, Recall your troops 🪤`,
      )
      .setColor(eBTColor);
    logger.trace(`Triggering BT${BTNumber} code block triggerTrap!`);
    interaction.channel?.send({ embeds: [BT_EMBED_BEFORE] });
    setTimeout(
      () => {
        // Tags User
        if (interaction.channel && interaction.channel instanceof TextChannel) {
          interaction.channel?.send(
            `<@&${BTNumber === 1 ? process.env.BT1_ROLL_ID : process.env.BT2_ROLL_ID}> has started!`,
          );
          // Embed for UI/UX
          let BT_EMBED_ON_ALERT = new EmbedBuilder()
            .setAuthor({
              name: `DES-1405 ~~ ${BTNumber === 1 ? "BT1" : "BT2"}`,
            })
            .setTitle(`${BTNumber === 1 ? "BT1" : "BT2"} is active!`)
            .setDescription(
              `<@&${BTNumber === 1 ? process.env.BT1_ROLL_ID : process.env.BT2_ROLL_ID}> has Started, Please Join 🪤`,
            )
            .setColor(eBTColor);
          interaction.channel?.send({ embeds: [BT_EMBED_ON_ALERT] });
        }
      },
      Number(process.env.NOTIFY_BT_BEFORE_TIME || 10) * 60 * 1000,
    ); // NOTIFY_BT_BEFORE_TIME minutes later
  }
}
export default triggerTrap;
