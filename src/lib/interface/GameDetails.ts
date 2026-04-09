import { MiniGamePlayer } from "./MiniGamePlayer.js";

interface RPSGameDetails {
  player: MiniGamePlayer;
  choiceIndex: number;
  victory: boolean;
}
interface DiceGameDetails {
  player: MiniGamePlayer;
  diceNo: number;
  diff?: number;
  winType?: number;
}
interface ClosestDiceGameDetails {
  player: MiniGamePlayer;
  diceNo: number;
  diff?: number;
  winType?: number;
}

export { RPSGameDetails, DiceGameDetails, ClosestDiceGameDetails };
