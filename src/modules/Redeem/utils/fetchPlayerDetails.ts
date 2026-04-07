import { KS_NET } from "../../../lib/axios.js";

import { getLogger } from "../../../lib/pino.log.js";
const logger = getLogger(import.meta);
const fetchPlayerDetails = async (PiD: number) => {
  try {
    let fetchedPlayer = await KS_NET.get(`/player-info?playerId=${PiD}`);
    let fetchedDetails = {
      pNAME: fetchedPlayer.data.data.name,
      PiD: Number(fetchedPlayer.data.data.playerId),
      KiD: Number(fetchedPlayer.data.data.kingdom),
      PFP: fetchedPlayer.data.data.profilePhoto,
    };
    logger.info("Fetched player details:" + JSON.stringify(fetchedDetails));
    return fetchedDetails;
  } catch (err) {
    logger.error(err);
    return null;
  }
};
export default fetchPlayerDetails;
