# Poker Leaderboard

_View and edit a list of folks who had some luck playing poker 🃏_

---

## Overview
The apps purpose is to display a list of poker players along with their country of origin and tournament winnings. Users may add, remove, or modify players. 

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

The app's data is stored in MongoDB. The backend api is written in Node.js and is served through Express. The api [is documented](https://documenter.getpostman.com/view/1208943/S11GRKeT) through postman. The front end was bootstrapped with create-react-app and uses that to compile the front end code into a production bundle. The front end relies on Material-UI as a UI framework and DevExtreme React Grid to display a nice looking grid.

---

## Database Design

Currently the data is stored in a NoSql mongo database in a single `player` collection like this...
```
{
    "_id": {
        "$oid": "5c721a7eac426fcf905abcb7"
    },
    "playerName": "Frank",
    "country": "USA",
    "amount": 234,
}
{
    "_id": {
        "$oid": "5c721a7eac426fcf905abcb7"
    },
    "playerName": "Jose",
    "country": "Mexico",
    "amount": 324,
}
```
For simplicity of this project I think it made sense to store it like that but the problems that could come from this is that perhaps a prize is announced before a player has won it. It that case it would make more sense to store prizes in a separate collection and reference the prizes in the player collection.


---

## Areas to Improve on 

-  have different winnings data model than part of player
-  have different read only vs. admin modes
-  have full list of countries, would need to switch to use an autocomplete UI component
-  should localize string constants for different languages
-  do better logging instead of console.logs in server code
-  figure out if app should remember sorting preferences after user refreshes
-  add rearrangement of columns or addition/removal of columns
-  figure out how to make local developement hit local DB
-  make sure concurrency works and two people aren't editing the same thing at the same time. could hook up websockets to make everything show up in real time
-  put styling into css preprocessor
-  stop using rows.find() to avoid linear time operation and use a constant time operation instead
-  if requirement is to show lots of data, the backend needs to support pagination and should return data in chunks
-  store credentials in environment variable instead of in plain text in the app
-  add integration tests
-  use redux for state management
-  use proptypes/typescript to ensure we aren't getting the wrong types of data passed around
-  put front end request into separate files so UI components dont need to worry about business logic
-  reduce duplication in server code

