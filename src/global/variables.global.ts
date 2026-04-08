import { MiniGamePlayer } from "../lib/interface/MiniGamePlayer.js";

const msgCatVoice: Array<string> = [
  "Meow",
  "Nya",
  "Nyan",
  "Purr",
  "Myaoon",
  "Nyaan",
];
let subreddits = ["catmemes", "wholesomememes"];

const addSubR = (sr: string) => {
  subreddits.push(sr);
};
let rpsON = false;
let diceON = false;
let playersRPS: MiniGamePlayer[] = [];
let playersDice: MiniGamePlayer[] = [];

const INVERSE_RPS_STATUS = () => {
  rpsON = !rpsON;
};
const PUSH_PLAYER_RPS = (player: MiniGamePlayer) => {
  playersRPS.push(player);
};
const CLEAR_RPS_ARRAY = () => {
  playersRPS = [];
};
const PUSH_PLAYER_DICE = (player: MiniGamePlayer) => {
  playersDice.push(player);
};
const CLEAR_DICE_ARRAY = () => {
  playersDice = [];
};
const RPSChoices = ["Rock 💎", "Paper 🧻", "Scissors ✂️"];

export {
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
};
