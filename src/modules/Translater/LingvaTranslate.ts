import { getLogger } from "../../lib/pino.log.js";
import type { Message } from "discord.js"; // importing type Message
const logger = getLogger(import.meta); // initialize Logger

import fetchReferencedMessage from "../../utils/fetchReferencedMessage.js";

import { LingvaT } from "../../lib/axios.js";

const LingvaTranslate = async (message: Message, mode: number) => {
  logger.trace(process.env.LINGVA_URL);

  switch (mode) {
    case 0:
      try {
        logger.info("Case 0 is Triggered");
        let detectOriginalReply = await fetchReferencedMessage(message);
        if (!detectOriginalReply?.content) {
          logger.info("Unable to detect");
          return message.reply("Cannot Fetch Referenced Message! Smeowry!");
        }
        logger.info(detectOriginalReply.content);
        const detectQuery = `
            query Translate($text: String!) {
              translation(query: $text) {
                source {
                  detected { code name }
                }
              }
            }`;
        const detectedLangResponse = await LingvaT.post(
          "/graphql", // replace with your Lingva GraphQL endpoint
          {
            query: detectQuery,
            variables: {
              text: detectOriginalReply.content,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        logger.debug(detectedLangResponse?.data);
        logger.debug(detectedLangResponse?.data?.data?.translation);
        logger.debug(
          detectedLangResponse?.data?.data?.translation?.source?.detected?.code,
          detectedLangResponse?.data?.data?.translation?.source?.detected?.name,
        );
        return detectOriginalReply.reply(
          `The message by ${detectOriginalReply?.author} might be "${detectedLangResponse?.data?.data?.translation?.source?.detected?.name}(${detectedLangResponse?.data?.data?.translation?.source?.detected?.code})"`,
        );
      } catch (err) {
        logger.warn(err);
        await message.reply(
          `Sorry, I couldn't detect language of the original message,
          Reason: ${err}`,
        );
      }
      break;

    case 1:
      // referencing to the original text
      logger.info("Case 1 is Triggered");
      try {
        let targetLang = "en"; // default target language is English
        if (message.content.split(" ").length === 2) {
          let langParams = message.content.split(" ")[1];
          targetLang = langParams;
        }

        let toTranslateMessage = await fetchReferencedMessage(message);

        if (toTranslateMessage) {
          let safeContent =
            toTranslateMessage.content?.trim().replaceAll(/^"|"$/g, "") ?? "";
          logger.trace(`Cleaned content: ${safeContent}`);
          const translateQuery = `query Translate($target: String, $text: String!) {
               translation(target: $target, query: $text) {
               target {
                    text
               }
               }
          }`;
          let translatedText = await LingvaT.post("/graphql", {
            query: translateQuery,
            variables: {
              target: targetLang,
              text: toTranslateMessage.content,
            },
          });
          logger.info(translatedText.data?.data?.translation?.target?.text);
          toTranslateMessage.reply(
            `${toTranslateMessage.author}: "${translatedText.data?.data?.translation?.target?.text}"`,
          );
          break;
        } else {
          return message.reply("Cannot Fetch Referenced Message! Smeowry!");
        }
      } catch (err) {
        logger.warn(err);
        await message.reply(
          `Sorry, I couldn't do translation for the original message.,
          Reason: ${err}`,
        );
      }
  }
};
export default LingvaTranslate;
