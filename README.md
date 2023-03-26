# rock-paper-scissor-mobile

Rock Paper Scissor Buzzer App

Simple multiplayer rock paper scissors system

Created from Multibuzzer [https://github.com/wsun/multibuzzer](https://github.com/wsun/multibuzzer)

Built using Create React App and boardgame.io

Please open an issue if you experience a bug or have product feedback!

## Development

- Prerequisites: node and a package manager (e.g. npm, yarn)
- Run yarn install to install dependencies
- Run yarn dev to run local client on localhost:4000 and local server on localhost:4001

## Deployment

- React app will be built using yarn build and served through Koa server (same server used for boardgame.io server and lobby)

#package.json comment
"start": "node -r esm src/server.js",

#npm start will work only after yarn build
`npm start`
