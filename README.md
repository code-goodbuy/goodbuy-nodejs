# GoodBuy-nodejs.

This is the repository of the GoodBuy backend for the GoodBuy project.   
More information can be found here: [app.code.berlin](https://app.code.berlin/projects/ckjaeqzpr00720vmeeznknkuh)

## Motivation

The current repository reflects the work done on the backend for the GoodBuy project.

## Build status

Travis CI - [![Build Status](https://travis-ci.com/code-goodbuy/goodbuy-nodejs.svg?branch=dev)](https://travis-ci.com/code-goodbuy/goodbuy-nodejs)

## Tech / Framework used

**Built with:**
- Typescript
- Node.js
- Express
- Docker
- MongoDB
- AWS
- RabbitMQ

## Installation

1. Clone the source locally:
```
$ git clone https://github.com/code-goodbuy/goodbuy-nodejs
$ cd goodbuy-nodejs
```
2. Checkout the dev branch:
```
$ git checkout dev
```
3. Add global ENV variables (*list shared via PassCamp*) - **mandatory**
4. Install Node.js (will also install NPM)
5. Install MongoDB as local DB and run it **mandatory**
6. Install project dependencies:
```
$ npm install
```
7. To compile Typescript, switch to src folder:
```
$ npx tsc -w -p .
```
8. Run the dev branch:
```
$ npm run local
```

## API Reference

You can find a complete reference to the API here:
[Swaggerhub](https://app.swaggerhub.com/apis-docs/Goodbuy-node/Goodbuy/1.0.0#/)

## Tests

To run the tests:
```
$ npm run test
```

## Credits

@5h3rr1ll - Anthony Sherrill  
@Darjusch - Darjusch Schrand  
@jwdotpark - Jongwoo Park  
@d-pettersson - David Pettersson

## Licence

MIT © GoodBuy team
