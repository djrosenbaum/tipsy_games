import { app } from '../../app';
// import { getRef } from '../../../library/getRef';

// store the initial html markup, allows for an easy game reset
let initial_markup = '';
let can_start_new_game = true;
let first_run = true;
// let outcome;
let $crates;
let $broadcast;

function game() {
  console.log('render game intro');

  if (first_run) {
    first_run = false;
    initial_markup = document.querySelector('[data-screen="game"]').innerHTML;
  }

  newGame();
}

async function newGame() {
  if (!can_start_new_game) {
    return;
  }
  can_start_new_game = false;
  document.querySelector('[data-screen="game"]').innerHTML = initial_markup;

  $crates = document.querySelector('[data-screen="game"] .crates');
  $broadcast = document.querySelector('[data-screen="game"] .broadcast');
  $broadcast.innerHTML = 'Time to hide your treasure';
  $broadcast.classList.remove('hide');
  displayGrid(getDefaultGridArray());
  updatePlayerList();
  // startCountdown();
}

function getDefaultGridArray() {
  let gridArray = [];
  gridArray.length = 25;
  gridArray.fill(0);
  return gridArray;
}

function displayGrid(gridArray) {
  let markup = gridArray
    .map((item, index) => {
      if (item === 0) {
        return `<div class="crate" data-index="${index}"></div>`;
      }
      if (item === 1) {
        return `<div class="crate open" data-index="${index}"></div>`;
      }
    })
    .join('');
  console.log('markup', markup);
  $crates.innerHTML = `<div data-crates="default">${markup}</div>`;
}

// async function startCountdown() {
//   // set start time
//   const startTime = Math.floor(Date.now() / 1000) + 10;
//   outcome = getOutcome();

//   // get reference to firebase
//   const ref = getRef();

//   // send message to firebase with the timestamp
//   await ref
//     .update({
//       outcome: JSON.stringify(outcome),
//       race_time: startTime,
//     })
//     .then(() => {
//       countdown(startTime);
//     });
// }

// function countdown(startTime) {
//   const currentTime = Math.floor(Date.now() / 1000);
//   const timeTilStart = startTime - currentTime;

//   if (timeTilStart <= 0) {
//     startRace();
//     return;
//   }

//   document.querySelector(
//     '[data-screen="game"] .countdown'
//   ).innerHTML = timeTilStart;

//   setTimeout(() => {
//     countdown(startTime);
//   }, 1000);
// }

// function getWinner(outcome) {
//   // sort by frame finished
//   const step1 = outcome.sort((a, b) => a.frame - b.frame);

//   // only keep the lowest frame
//   const step2 = step1.filter((a) => a.frame === step1[0].frame);

//   // sort by how many steps were taken in the last frame
//   const step3 = step2.sort((a, b) => a.steps - b.steps);

//   const winner = step3[0];

//   console.log('==== GET WINNER ', winner);
//   const { playerName } = window.app.host.playerList[winner.player];
//   console.log('==== PLAYER NAME ', playerName);
//   return playerName;
// }

function updatePlayerList() {
  const { playerList } = app.host;
  console.log('update player list', playerList);

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } = playerList[player];
      return `<div class="player" data-key=${player}><div class="player-name">${playerName}</div></div>`;
    })
    .join('');

  const $playerList = document.querySelector(
    '[data-screen="game"] .player-list'
  );
  $playerList.innerHTML = markup;
}

// function getOutcome() {
//   const { playerList } = window.app.host;

//   return Object.keys(playerList).map((player) => {
//     let distances = [];
//     let totalDistance = 0;
//     let frame = 0;
//     let steps = 0;

//     // keep looping until the horse reaches the minimum
//     for (let i = 0; i < 100; i++) {
//       const distance = getRandomDistance(30, 40);

//       if (totalDistance + distance >= 960) {
//         frame = i;
//         steps = 960 - totalDistance;
//         break;
//       }

//       distances.push(distance);
//       totalDistance += distance;
//     }

//     return {
//       distances,
//       frame,
//       player,
//       steps,
//     };
//   });
// }

// // min and max included
// function getRandomDistance(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export { game, newGame };
