# Poker Leaderboard

🃏 View and edit a list of folks who had some luck playing poker 🃏

## Overview
The app's purpose is to display a list of poker players along with their country of origin and tournament winnings. Users may add, remove, or modify players. Please take a look at the repository's website to play with the app. 

---
## How to run locally
1. checkout the repo
1. change into root of directory `cd poker-leaderboard`
1. install dependencies `yarn`
1. start server `yarn start-server-dev`
1. in a separate terminal start the client `yarn start-client-dev`
1. open browser to `http://localhost:3000/`
1. enjoy! any code changes will automatically update the app

---

## Tech Stack Overview

| Database        | Backend           | Frontend  |
| ------------- |:-------------:| -----:|
| MongoDB      | Node/Express | React |

The app's data is stored in MongoDB. The backend api is written in Node.js and is served through Express. The api [is documented](https://documenter.getpostman.com/view/1208943/S11GRKeT) through postman. The front end was bootstrapped with create-react-app and uses that to compile the client side code into a production bundle. The front end relies on Material-UI as a UI framework and DevExtreme React Grid to display a nice looking grid.

---

## Database Design

Currently the data is stored in a NoSql mongo database in a single `player` collection like this...
```
{
    "_id": "5c721a7eac426fcf905abcb7",
    "playerName": "Frank",
    "country": "USA",
    "amount": 234,
}
{
    "_id": "5c721a8dac426fcf905abcb9",
    "playerName": "Jose",
    "country": "Mexico",
    "amount": 324,
}
```
For simplicity of this project I think this database schema made sense. However problems could arise from this schema if one player won multiple prizes or if we want to display a separate this of all the prizes. Also perhaps a prize has been announced before a player has won it.

For these reasons I think a smarter schema would be to have a separate collection for prizes. The `player` table would reference the prizeIds from the other collection and store the denormalized sum of the player's prizes to allow for quick reads. [Here's how I would structure the improved database schema](./docs/databaseDesign.png). The only part we would have to be careful about is to remember to update the sum whenever prizeIds change or a prize's amount changes.

---

## Areas to Improve on 

- finish writing tests for all production code, especially server side code and front end code that modifies the store
- have different read only and admin modes in the UI
- have full list of countries, would need to switch to use an autocomplete UI component
- should localize string constants for different languages
- do logging the proper way instead of `console.log()`
- figure out how to make local developement hit local DB
- make sure concurrency works and two people aren't editing the same thing at the same time. could hook up websockets to make everything show up in real time
- put styling into css preprocessor
- stop using `rows.find()` in update method to avoid linear time operation and use a constant time operation instead
- if requirement is to show lots of data, the backend needs to support pagination and should return data in chunks
- store credentials in environment variable instead of in plain text to reduce security vulnerabilities
- add integration tests
- use redux for state management
- use proptypes/typescript to ensure we aren't getting the wrong types of data passed around
- put front end requests into separate files so UI components dont need to worry about business logic
- reduce duplication in server code

