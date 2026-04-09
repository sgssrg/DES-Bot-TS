import dotenv from "dotenv";

dotenv.config();

import { ApplicationCommandOptionType, REST, Routes } from "discord.js";

const commands = [
  {
    name: "purr",
    description: "Replies with Purr!",
  },
  {
    name: "rps",
    description: "Joins the Rock Paper Scissors game!",
    options: [
      {
        name: "what",
        description: "What do you want to do?",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "Create a game?",
            value: "create",
          },
          {
            name: "Join a game?",
            value: "join",
          },
          {
            name: "Begin a game?",
            value: "play",
          },
          {
            name: "Delete a game?",
            value: "delete",
          },
        ],
      },
    ],
  },
  {
    name: "set-bt",
    description: "Sets Bear Trap",
    options: [
      {
        name: "trap",
        description: "Choose which bear trap to set",
        type: ApplicationCommandOptionType.Integer,
        required: true,
        choices: [
          { name: "BT1", value: 1 },
          { name: "BT2", value: 2 },
        ],
      },
    ],
  },
  {
    name: "dice",
    description: "Joins the Closest Number Dice Guess game!",
    options: [
      {
        name: "what",
        description: "What do you want to do?",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "Create a game?",
            value: "create",
          },
          {
            name: "Join a game?",
            value: "join",
          },
          {
            name: "Begin a game?",
            value: "play",
          },
          {
            name: "Delete a game?",
            value: "delete",
          },
        ],
      },
      {
        name: "prediction",
        description: "Choose a number from 1 to 6",
        type: ApplicationCommandOptionType.Integer,
        required: false,
        choices: [
          { name: "1", value: 1 },
          { name: "2", value: 2 },
          { name: "3", value: 3 },
          { name: "4", value: 4 },
          { name: "5", value: 5 },
          { name: "6", value: 6 },
        ],
      },
    ],
  },
  {
    name: "help",
    description: "Shows help information!",
    options: [
      {
        name: "with",
        description: "Choose a category to get help on",
        type: ApplicationCommandOptionType.Integer,
        required: true,
        choices: [
          { name: "General Commands", value: 1 },
          { name: "Rock Paper Scissors Commands", value: 2 },
          { name: "Dice Prediction Commands", value: 3 },
          { name: "Bear Trap Commands", value: 4 },
          { name: "Translation Commands", value: 5 },
        ],
      },
    ],
  },
  {
    name: "redeem",
    description: "Redeem a code for everyone in DES currently in Database!!",
    options: [
      {
        name: "code",
        description: "Enter the code you want to redeem",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
