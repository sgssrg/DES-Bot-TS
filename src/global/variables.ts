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
export { msgCatVoice, subreddits, addSubR };
