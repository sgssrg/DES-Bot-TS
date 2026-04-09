import { DiceGameDetails } from "../lib/interface/GameDetails.js";
import { MiniGamePlayer } from "../lib/interface/MiniGamePlayer.js";

const msgCatVoice: Array<string> = [
  "Meow",
  "Nya",
  "Nyan",
  "Purr",
  "Myaoon",
  "Nyaan",
];

let subreddits: Array<string> = ["catmemes", "wholesomememes"];

let DICE_ROLL_ANIMATION = [
  "https://cdn.pixabay.com/animation/2025/11/09/20/47/20-47-29-580_512.gif",
  "https://cdn.pixabay.com/animation/2025/11/09/20/47/20-47-29-10_512.gif",
  "https://cdn.pixabay.com/animation/2025/11/09/20/47/20-47-29-54_512.gif",
  "https://cdn.pixabay.com/animation/2025/11/09/20/47/20-47-29-65_512.gif",
  "https://cdn.pixabay.com/animation/2025/11/09/20/47/20-47-29-446_512.gif",
  "https://cdn.pixabay.com/animation/2025/11/09/20/47/20-47-29-70_512.gif",
];

let rpsON: boolean = true;
let diceON: boolean = true;
let playersRPS: MiniGamePlayer[] = [
  { PiD: "1332959141479583747", dNAME: "SG" },
  { PiD: "1490051534266962081", dNAME: "[des] Lime" },
];
let playersDice: DiceGameDetails[] = [];
let diceVal: number = 0;
const RPSChoices = ["Rock 💎", "Paper 🧻", "Scissors ✂️"];

const INVERSE_RPS_STATUS = () => {
  rpsON = !rpsON;
  return rpsON;
};
const INVERSE_DICE_STATUS: () => boolean = () => {
  diceON = !diceON;
  return diceON;
};
const PUSH_PLAYER_RPS = (player: MiniGamePlayer) => {
  playersRPS.push(player);
};
const CLEAR_RPS_ARRAY = () => {
  playersRPS = [];
};
const PUSH_PLAYER_DICE = (player: DiceGameDetails) => {
  playersDice.push(player);
};
const CLEAR_DICE_ARRAY = () => {
  playersDice = [];
};
const ROLL_DICE = () => {
  diceVal = Math.floor(Math.random() * 6) + 1;
};
const addSubR = (sr: string) => {
  subreddits.push(sr);
};

export {
  DICE_ROLL_ANIMATION,
  msgCatVoice,
  subreddits,
  addSubR,
  rpsON,
  playersRPS,
  INVERSE_RPS_STATUS,
  PUSH_PLAYER_RPS,
  RPSChoices,
  CLEAR_RPS_ARRAY,
  CLEAR_DICE_ARRAY,
  PUSH_PLAYER_DICE,
  playersDice,
  diceON,
  INVERSE_DICE_STATUS,
  ROLL_DICE,
  diceVal,
};
