import { Client } from "discord.js";

let initDelay = new Date();
initDelay.setUTCHours(
  Number(process.env.REDEEM_TIME_HOUR) || 12,
  Number(process.env.REDEEM_TIME_MINUTE) || 0,
  0,
  0,
);
import { getLogger } from "../../lib/pino.log.js";
import RedeemCode from "./utils/RedeemCode.js";
import { KS_NET } from "../../lib/axios.js";
import { prisma } from "../../lib/prisma.js";
const logger = getLogger(import.meta);
const AutoRedeem = (client: Client) => {
  let firstDelay = initDelay.getTime() - Date.now();
  if (firstDelay < 0) {
    initDelay.setDate(initDelay.getDate() + 1); // move to next day
    firstDelay = initDelay.getTime() - Date.now();
  }
  setTimeout(() => {
    logger.info("AutoRedeem GC Timeout ended");
    setInterval(
      async () => {
        logger.info("AutoRedeem GC Intervals started");
        let checkKSNET = (await KS_NET.get("/gift-codes")).data.data.giftCodes;
        let isClaimGC = []; // will contain GC(Str) + claim(bool)
        for (const codeArrElem of checkKSNET) {
          let isPresent = await prisma.giftcode.findUnique({
            where: {
              code: codeArrElem.code,
            },
          });
          isClaimGC.push({
            code: codeArrElem.code,
            claim: !!isPresent,
          });
        }

        //  to be claimed
        let toClaim = isClaimGC.filter((c) => !c.claim);
        for (const [index, elem] of toClaim.entries()) {
          const { code } = elem;
          RedeemCode(code, undefined, client);
        }
      },
      Number(process.env.REDEEM_CHECK || 12) * 60 * 60 * 1000,
    );
  }, firstDelay);
};
export default AutoRedeem;
