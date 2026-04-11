# How to setup this bot for yourself?

### Requirements

- A place where you can host a `VM`
- Install Postgres in the VM or modify the `docker-compose.yml`
- Install `Podman` or `Docker` in your machine or VM

_The Below should be done in your VM_

## STEP 01 --> Clone this Repo using git

```
$ git clone <repo-link>
```

This will copy all the code from here to your machine/VM

## STEP 02 --> make a .env file to store variables safely

```
$ cd ./DES-Bot-TS
$ touch .env
$ nano .env
```

## STEP 03 (IMP) --> Declare Environment Variables in .env file

Go through [`ENV.md`](./ENV.md) to declare the variables

## STEP 04 --> Host the bot

```
$ podman compose up --build -d
```

- `--build` makes the image from scratch
- `-d` makes it run detached

## Check Logs
