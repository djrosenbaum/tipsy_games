import { app } from '../../app';
import { get, shuffle } from 'lodash-es';
import { getRef } from '../../../library/getRef';

// store the initial html markup, allows for an easy game reset
let initial_markup = '';
let $crates;
let $broadcast;
let $narrative;
let currentRound = 0;
const guesses = 3;

function game() {
  console.log('render game');

  // check if there is an existing game state
  if (!window.app.host.game) {
    if (!initial_markup) {
      initial_markup = document.querySelector('[data-screen="game"]').innerHTML;
    }
    newGame();
    updatePlayerList();
    return;
  }
  if ($broadcast.innerText === 'Time to hide your treasure') {
    updatePlayerList();
    if (isReadyToStartRound()) {
      console.log('Ready to start the round');
      startRound();
    }
    return;
  }
}

function isReadyToStartRound() {
  console.log('isReadyToStartRound');
  // loop through each player and check if every player has 3 treasures
  return Array.from(document.querySelectorAll('.player-list .player'))
    .map(($player) => $player.querySelectorAll('.treasure').length)
    .every((treasure) => treasure === 3);
}

async function startRound() {
  console.log('start round');

  const roundNumber = getRoundNumber();
  if (currentRound === roundNumber) {
    return;
  }
  currentRound = roundNumber;

  const { playerList } = get(window, 'app.host') || {};
  const { players } = get(window, 'app.host.game') || {};
  const remainingBoards = getRemainingBoards();
  console.log('remaining boards:', remainingBoards);

  // get the player order
  const playerOrder = shuffle(Object.keys(players));
  console.log('player order:', playerOrder);

  // set the hider
  const seeker = playerOrder[0];

  // set the seeker
  const hider = shuffle(remainingBoards.filter((board) => board !== seeker))[0];

  const round = {
    guesses,
    hider,
    playerOrder,
    roundNumber,
    seeker,
  };

  const ref = getRef();

  await ref
    .child(`game/round`)
    .update(round)
    .then(() => {
      // set round number
      $broadcast.innerHTML = `<div>Round ${roundNumber}</div>`;
      $narrative.innerHTML = `<div>${playerList[seeker].playerName}<div><div>is seeking</div><div>${playerList[hider].playerName}'s treasure</div>`;
    });
}

function getRoundNumber() {
  return get(window, 'app.host.game.round.roundNumber') || 1;
}

function getRemainingBoards() {
  const { players } = get(window, 'app.host.game') || {};
  const remainingBoards = [];

  for (const player in players) {
    if (players[player].treasure > 0) {
      remainingBoards.push(player);
    }
  }
  return remainingBoards;
}

async function newGame() {
  document.querySelector('[data-screen="game"]').innerHTML = initial_markup;

  $crates = document.querySelector('[data-screen="game"] .crates');
  $broadcast = document.querySelector('[data-screen="game"] .broadcast');
  $narrative = document.querySelector('[data-screen="game"] .narrative');

  $broadcast.innerHTML = 'Time to hide your treasure';
  $broadcast.classList.remove('hide');

  displayGrid(getDefaultGridArray());
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

function updatePlayerList() {
  const { playerList } = app.host;
  console.log('update player list', playerList);
  const treasureMarkup = '<div class="treasure"></div>';

  let markup = Object.keys(playerList)
    .map((player) => {
      const { playerName } =
        get(app, `host.playerList.${player}`) || 'undefined';
      const { treasure } = get(app, `host.game.players.${player}`) || 0;

      return `<div class="player" data-key=${player}><div class="player-name">${playerName}</div>${treasureMarkup.repeat(
        treasure
      )}</div>`;
    })
    .join('');

  const $playerList = document.querySelector(
    '[data-screen="game"] .player-list'
  );
  $playerList.innerHTML = markup;
}

export { game };
