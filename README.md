# DES-1405 Discord Chat Bot

This is a chat bot made for Discord, This is the source code of the bot and you can host it yourself!

### Features

- Translator --> [LingvaTranslate](https://github.com/TheDavidDelta/lingva-translate) / [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) (Both are available)[Default LingvaTranslate]
- GiftCode Redeem(Auto/Manual) --> Uses [KSNet API](https://kingshot.net/)
- BT Reminders using Embed and Role Tagging
- It Meows!

---

---

## How to install?

[`view docs`](docs/INSTALLATION.md)

---

---

---

## Commands of BOT

---

### Text Command

---

#### Redeem Channel

These command are for players who want auto redeem and manual redeem, that means DB pulls player data from here to run redeem service.

```
!aur <PlayerID> --> Adds a Player to Database
!dur <PlayerID> --> Deletes a Player from Database
```

---

#### Anywhere

```
!t                  -->  while replying to a message
!t <language-code>  -->  while replying to a message
!dt                 --> while repling to a message

# Lingva  -->  !dt --> only language
# Libre   -->  !dt --> language with confidence score
<language-code>    --> according to the translator using mostly same in both
```

---

---

---

### Interaction Commands

---

#### BT channel

---

```
/set-bt trap:<BT1/BT2> --> Academy support will be added soon for Big NAP Alliances
```

## set the bear trap anytime on the Bear Trap Day and it will automatically run on the same time specified in the `.env` file

#### Redeem Channel

```
/redeem code:<giftcode> --> Manually Redeems Code for Everyone in DB
```

- (PS:- Make sure someone doesn't spam this or it would be DOS on KSNet 😭)

---

## Any Doubts?

PM me! Find me at DES K1405!

---

## Want to contribute?

Your Onboard 😎! Pick out any feature you want and implement it or raise a issue!
