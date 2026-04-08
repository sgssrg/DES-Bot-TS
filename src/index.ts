import "dotenv/config"; // shorthand

// or the longer form:
import dotenv from "dotenv";
dotenv.config();

import { setBotReady } from "./lib/server.js";

import {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import { getLogger } from "./lib/pino.log.js";
import CatVoice from "./modules/Cat/CatVoice.js";

const logger = getLogger(import.meta);
const TranslatorChoice = process.env.TRANSLATOR_CHOICE || 0;

// Importing Translators
import LingvaTranslate from "./modules/Translater/LingvaTranslate.js";
import LibreTranslate from "./modules/Translater/LibreTranslate.js";
import RedeemMessageHandler from "./modules/Redeem/RedeemMessageHandler.js";
import RedeemInteractionHandler from "./modules/Redeem/RedeemInteractionHandler.js";
import { setBT } from "./modules/BT/BT.js";
import Dice from "./modules/Games/Dice.js";
import RPS from "./modules/Games/RPS.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login(String(process.env.DISCORD_TOKEN)).catch((err) => {
  logger.error("Login failed:", err);
});

client.once(Events.ClientReady, (readyClient) => {
  setBotReady(true); // Update the bot status to ready
  logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
  //   AutoRedeem(client); ==> AutoRedeem Scripts
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  CatVoice(message); // makes cat sound when hears meow or similar

  if (message.content) {
    const isDetect =
      message.content.startsWith("!dt") ||
      message.content.startsWith("!detect");
    const isTranslate =
      message.content.startsWith("!trans") ||
      message.content.startsWith("!translate") ||
      message.content.startsWith("!t");
    const isAddUserRedeemCommand = message.content.startsWith("!aur");
    const isDeleteUserRedeemCommand = message.content.startsWith("!dur");
    logger.trace(
      `isDetect${isDetect}| isTranslate${isTranslate} |  Number(TranslatorChoice) => ${Number(TranslatorChoice)}`,
    );
    if (Number(TranslatorChoice) === 0) {
      if (isDetect) {
        try {
          logger.info("Running detect using Lingva");
          await LingvaTranslate(message, 0);
        } catch (err) {
          logger.warn(err);
          try {
            logger.trace("Detecting via using Lingva");
            await LibreTranslate(message, 0);
          } catch (fallbackErr) {
            logger.warn(fallbackErr);
            message.reply("Cannot be Detected, Such a SPY Language haha!");
          }
        }
      }
      if (isTranslate) {
        try {
          logger.trace("Running Translate using Lingva");
          await LingvaTranslate(message, 1);
        } catch (err) {
          logger.warn(err);
          try {
            logger.trace("Detecting via using Lingva");
            await LibreTranslate(message, 1);
          } catch (fallbackErr) {
            logger.warn(fallbackErr);
            message.reply("Cannot be Translated, Such a SPY Language haha!");
          }
        }
      }
    }
    if (Number(TranslatorChoice) === 1) {
      if (isDetect) {
        try {
          logger.trace("Running Detect using Libre");
          await LibreTranslate(message, 0);
        } catch (err) {
          logger.warn(err);
          try {
            logger.trace("Detecting via using Lingva");
            await LingvaTranslate(message, 0);
          } catch (fallbackErr) {
            logger.warn(fallbackErr);
            message.reply("Cannot be Detected, Such a SPY Language haha!");
          }
        }
      }
      if (isTranslate) {
        try {
          logger.info("Running translate using LibreTranslate...");
          await LibreTranslate(message, 1);
        } catch (err) {
          logger.warn(err);
          try {
            logger.trace("Detecting via using Lingva");
            await LingvaTranslate(message, 1);
          } catch (fallbackErr) {
            logger.warn(fallbackErr);
            message.reply("Cannot be Translated, Such a SPY Language haha!");
          }
        }
      }
    }
    if (message.channelId === process.env.REDEEM_CHANNEL) {
      if (isAddUserRedeemCommand) {
        RedeemMessageHandler(message, 0);
      }
      if (isDeleteUserRedeemCommand) {
        RedeemMessageHandler(message, 1);
      }
    }
  }
});
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      switch (interaction.commandName) {
        case "set-bt":
          setBT(interaction);
          break;
        case "redeem":
          RedeemInteractionHandler(interaction);
          break;
        case "rps":
          RPS(interaction);
          break;
        case "dice":
          Dice(interaction);
          break;
      }
    }
  } catch (error) {
    logger.warn(error);
  }
});
