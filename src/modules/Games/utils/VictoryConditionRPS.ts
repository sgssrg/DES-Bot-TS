import { pathToFileURL } from "node:url";
import { GameDetails } from "../../../lib/interface/GameDetails.js";
import { getLogger } from "../../../lib/pino.log.js";
const logger = getLogger(import.meta);
const VictoryConditionRPS = (data: GameDetails[]) => {
  for (let playerCI = 1; playerCI < data.length; playerCI++) {
    const playerC = data[playerCI];
    const playerR = data[playerCI - 1];
    if (
      (playerC.choiceIndex === 0 && playerR.choiceIndex === 2) ||
      (playerC.choiceIndex === 1 && playerR.choiceIndex === 0) ||
      (playerC.choiceIndex === 2 && playerR.choiceIndex === 1)
    ) {
      data.splice(playerCI - 1, 1);
      playerCI--;
    } else if (
      (playerR.choiceIndex === 0 && playerC.choiceIndex === 2) ||
      (playerR.choiceIndex === 1 && playerC.choiceIndex === 0) ||
      (playerR.choiceIndex === 2 && playerC.choiceIndex === 1)
    ) {
      data.splice(playerCI, 1);
      playerCI--;
    }
  }
  data[0].victory = true;
  return data[0]?.player;
};
export default VictoryConditionRPS;
