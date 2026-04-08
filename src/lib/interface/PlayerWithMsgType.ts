import { Player } from "../../generated/prisma/client.js";

interface PlayerWithMsgType extends Partial<Player> {
  msgTYPE: number;
}
export { PlayerWithMsgType };
